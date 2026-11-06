#!/usr/bin/env python3
"""
Post-process an Expo static web export and publish it at the repository root,
which is the directory Vercel serves for mrfinance-teal.vercel.app.

A raw `npx expo export --platform web` output loses the mobile containment
rules that keep Android Chrome from clipping the left edge of the UI. This
script re-applies them to every generated HTML file, then copies the whole
export to the repo root.

Usage (from anywhere):
    cd finance_ui_ref
    npx expo export --platform web --output-dir dist --clear
    cd ..
    python scripts/patch_web_export.py
"""

from __future__ import annotations

import os
import re
import shutil
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DIST = os.path.join(ROOT, "finance_ui_ref", "dist")

VIEWPORT = (
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, '
    'maximum-scale=1.0, user-scalable=no, viewport-fit=cover"/>'
)

EXPO_RESET = (
    '<style id="expo-reset">'
    '#root,body,html{height:100%}'
    'html,body{overflow-x:hidden!important;max-width:100vw;margin:0;padding:0;box-sizing:border-box}'
    '#root{display:flex;overflow-x:hidden;width:100%}'
    '</style>'
)

OVERFLOW_GUARD = (
    '<style id="overflow-guard">'
    '*,*::before,*::after{box-sizing:border-box}'
    'body{overflow-x:hidden!important;max-width:100vw!important;width:100%!important}'
    '#root{overflow-x:hidden!important;max-width:100vw!important;width:100%!important}'
    '</style>'
)

# Inserted last so it wins over the generated react-native-web stylesheet.
RESPONSIVE_GUARD = """<style id="responsive-guard">
html,body,#root{overflow-x:hidden!important;max-width:100%!important;min-width:0!important;box-sizing:border-box}
body{width:100%!important;margin:0!important;padding:0!important}
#root{width:100%!important;display:flex!important}
*,*::before,*::after{box-sizing:border-box}
.css-175oi2r{max-width:100%!important}
svg{display:inline-block!important;vertical-align:middle!important}
</style>"""

# Defensive single-property overrides. Class names are content hashes and can
# change between builds, so match on the property/value instead of the name.
STYLE_SHRINKS = [
    (r"\{padding-left:20px;padding-right:20px;\}", "{padding-left:14px;padding-right:14px;}"),
    (r"\{width:150px;\}", "{width:125px;}"),
    (r"\{width:110px;\}", "{width:90px;}"),
    (r"\{font-size:34px;\}", "{font-size:28px;}"),
    (r"\{font-size:32px;\}", "{font-size:26px;}"),
]

VIEWPORT_RE = re.compile(r'<meta name="viewport"[^>]*/?>')
EXPO_RESET_RE = re.compile(r'<style id="expo-reset">.*?</style>', re.S)


def patch_html(source: str) -> str:
    html = source

    # 1. Viewport: lock zoom and let content respect the safe area / notch.
    html = VIEWPORT_RE.sub(VIEWPORT, html, count=1)

    # 2. Expo reset + overflow guard (replace, don't duplicate on re-runs).
    html = EXPO_RESET_RE.sub(EXPO_RESET + OVERFLOW_GUARD, html, count=1)

    # 3. Trim oversized generated rules that push carousels past the viewport.
    for pattern, replacement in STYLE_SHRINKS:
        html = re.sub(pattern, replacement, html)

    # 4. Legacy tab-bar centering used a negative translate that still
    #    allocates off-screen width before the transform is applied.
    html = html.replace("transform:translateX(-110px)", "")

    # 5. Final containment layer, appended at the end of <head>.
    if 'id="responsive-guard"' in html:
        html = re.sub(
            r'<style id="responsive-guard">.*?</style>',
            RESPONSIVE_GUARD.strip(),
            html,
            count=1,
            flags=re.S,
        )
    else:
        html = html.replace("</head>", RESPONSIVE_GUARD + "</head>", 1)

    return html


def main() -> int:
    if not os.path.isdir(DIST):
        print(f"ERROR: export directory not found: {DIST}", file=sys.stderr)
        print("Run `npx expo export --platform web --output-dir dist` first.", file=sys.stderr)
        return 1

    html_files = []
    for base, _dirs, files in os.walk(DIST):
        for name in files:
            if name.endswith(".html"):
                html_files.append(os.path.join(base, name))

    for path in sorted(html_files):
        with open(path, encoding="utf-8") as fh:
            original = fh.read()
        patched = patch_html(original)
        with open(path, "w", encoding="utf-8", newline="") as fh:
            fh.write(patched)
        rel = os.path.relpath(path, DIST)
        print(f"patched  {rel}  ({len(original)} -> {len(patched)} bytes)")

    # Remove stale bundles before copying so the old hash is not served.
    stale_js_dir = os.path.join(ROOT, "_expo", "static", "js", "web")
    if os.path.isdir(stale_js_dir):
        for name in os.listdir(stale_js_dir):
            if name.endswith(".js"):
                os.remove(os.path.join(stale_js_dir, name))
                print(f"removed stale bundle {name}")

    copied = 0
    for base, _dirs, files in os.walk(DIST):
        rel_dir = os.path.relpath(base, DIST)
        target_dir = ROOT if rel_dir == "." else os.path.join(ROOT, rel_dir)
        os.makedirs(target_dir, exist_ok=True)
        for name in files:
            shutil.copy2(os.path.join(base, name), os.path.join(target_dir, name))
            copied += 1

    print(f"\nPublished {copied} files from {DIST} -> {ROOT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
