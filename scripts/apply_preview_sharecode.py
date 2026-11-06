#!/usr/bin/env python3
"""Make a static copy installable behind a sharecode-gated preview host.

Chrome fetches a web app manifest (and its icons) WITHOUT credentials. On a
host that gates every request behind a sharecode session cookie, those fetches
return 403 and Chrome greys out "Install app". The fix is to put the sharecode
in the PWA asset URLs themselves, since the gateway authorises any URL that
carries a valid sharecode query parameter.

Only PWA URLs are rewritten; app bundle URLs and the portable repo source stay
untouched, so deploying the same export to a real domain needs no changes.

Usage:
    python3 scripts/apply_preview_sharecode.py <static-dir> <sharecode>
Example:
    python3 scripts/apply_preview_sharecode.py /workspace/mr_fin_preview BHTU5C2ZE7
"""

from __future__ import annotations

import json
import os
import sys

PWA_HTML_PATHS = (
    "/manifest.webmanifest",
    "/icons/icon-192.png",
    "/apple-touch-icon.png",
    "/pwa-register.js",
)


def with_code(url: str, code: str) -> str:
    if "sharecode=" in url:
        return url
    sep = "&" if "?" in url else "?"
    return url + sep + "sharecode=" + code


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__.strip(), file=sys.stderr)
        return 1

    root, code = os.path.abspath(sys.argv[1]), sys.argv[2]

    patched_html = 0
    for base, _dirs, files in os.walk(root):
        for name in files:
            if not name.endswith(".html"):
                continue
            path = os.path.join(base, name)
            with open(path, encoding="utf-8") as fh:
                original = fh.read()
            html = original
            for asset in PWA_HTML_PATHS:
                for attr in ("href", "src"):
                    needle = f'{attr}="{asset}"'
                    html = html.replace(needle, f'{attr}="{with_code(asset, code)}"')
            if html != original:
                with open(path, "w", encoding="utf-8", newline="") as fh:
                    fh.write(html)
                patched_html += 1

    manifest_path = os.path.join(root, "manifest.webmanifest")
    if not os.path.isfile(manifest_path):
        print(f"ERROR: {manifest_path} not found", file=sys.stderr)
        return 1
    with open(manifest_path, encoding="utf-8") as fh:
        data = json.load(fh)

    data["start_url"] = with_code(data.get("start_url", "/"), code)
    for icon in data.get("icons", []):
        icon["src"] = with_code(icon["src"], code)
    for shortcut in data.get("shortcuts", []):
        shortcut["url"] = with_code(shortcut["url"], code)
        for icon in shortcut.get("icons", []):
            icon["src"] = with_code(icon["src"], code)

    with open(manifest_path, "w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    print(f"patched {patched_html} HTML files")
    print(f"start_url = {data['start_url']}")
    print(f"icons     = {[i['src'] for i in data.get('icons', [])]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
