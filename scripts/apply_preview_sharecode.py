#!/usr/bin/env python3
"""Make a static copy reliable behind a sharecode-gated preview host.

Chrome fetches a web app manifest, icons and the service worker WITHOUT
credentials. On a host that gates every request behind a sharecode session
cookie, those requests return 403 unless the URL itself carries a valid
`sharecode` query parameter.

The same is true after a reload: Expo Router's in-app navigation replaces the
URL with a clean path (/settings, /transaction, ...) that has lost the
sharecode. If the session cookie is gone too, the HTML and the JS bundle both
403, React never hydrates, and the browser is left showing Expo's raw SSR
shell -- a white bar titled "index".

This script makes the sharecode survive everything:
  * every same-origin URL in every HTML file (scripts, fonts, favicon,
    manifest, icons, tab links, CSS url(...)) gets ?sharecode=
  * a tiny inline keeper re-adds the code after any client-side navigation
  * the manifest start_url / icon / shortcut URLs get ?sharecode=
  * pwa-register.js derives the code from its own src and registers
    /sw.js?sharecode=, and sw.js adds it to every request it makes

Only the PWA-facing URLs are rewritten and only in the target static copy.
The portable repo export keeps clean URLs, so deploying it to a real domain
needs no changes.

Usage:
    python3 scripts/apply_preview_sharecode.py <static-dir> <sharecode>
Example:
    python3 scripts/apply_preview_sharecode.py /workspace/mr_fin_preview BHTU5C2ZE7
"""

from __future__ import annotations

import json
import os
import re
import sys

KEEPER_START = "<!-- mrfin-sharecode:start -->"
KEEPER_END = "<!-- mrfin-sharecode:end -->"
KEEPER_RE = re.compile(
    re.escape(KEEPER_START) + r".*?" + re.escape(KEEPER_END),
    re.S,
)

# src="/..." / href="/..." and CSS url(/...). Protocol-relative and data URLs
# are skipped by the "/" + no leading "//" check inside with_code().
ATTR_URL_RE = re.compile(
    r"(?P<attr>src|href)=(?P<q>[\"'])(?P<url>/[^\"'>]+)(?P=q)"
)
CSS_URL_RE = re.compile(
    r"url\((?P<q>[\"']?)(?P<url>/[^)\"']+)(?P=q)\)"
)

KEEPER_TEMPLATE = """<script>
(function(){
  var KEY='__mrfin_sharecode';
  var code=new URLSearchParams(location.search).get('sharecode');
  if(code){ try{ localStorage.setItem(KEY,code); }catch(e){} }
  else { try{ code=localStorage.getItem(KEY)||''; }catch(e){} }
  if(!code) return;
  var ps=history.pushState, rs=history.replaceState, busy=false;
  function restore(){
    if(busy) return;
    try{
      var u=new URL(location.href);
      if(u.searchParams.get('sharecode')===code) return;
      u.searchParams.set('sharecode',code);
      busy=true; rs.call(history,history.state,'',u.toString()); busy=false;
    }catch(e){ busy=false; }
  }
  history.pushState=function(){ var r=ps.apply(history,arguments); restore(); return r; };
  history.replaceState=function(){ var r=rs.apply(history,arguments); restore(); return r; };
  window.addEventListener('popstate',restore);
  restore();
})();
</script>"""


def with_code(url: str, code: str) -> str:
    if not url.startswith("/") or url.startswith("//") or url.startswith("/#"):
        return url
    # Preserve an existing query string / fragment.
    base, sep, tail = url.partition("#")
    if "sharecode=" in base:
        return url
    joiner = "&" if "?" in base else "?"
    return base + joiner + "sharecode=" + code + (sep + tail if sep else "")


def rewrite_html(html: str, code: str) -> str:
    html = ATTR_URL_RE.sub(
        lambda m: '%s=%s%s%s' % (
            m.group("attr"), m.group("q"),
            with_code(m.group("url"), code), m.group("q"),
        ),
        html,
    )
    html = CSS_URL_RE.sub(
        lambda m: 'url(%s%s%s)' % (
            m.group("q"), with_code(m.group("url"), code), m.group("q"),
        ),
        html,
    )
    block = KEEPER_START + KEEPER_TEMPLATE + KEEPER_END
    if KEEPER_RE.search(html):
        html = KEEPER_RE.sub(lambda _m: block, html, count=1)
    elif "</head>" in html:
        html = html.replace("</head>", block + "</head>", 1)
    else:
        html = block + html
    return html


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
            html = rewrite_html(original, code)
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

    print(f"patched {patched_html} HTML files (assets + links + sharecode keeper)")
    print(f"start_url = {data['start_url']}")
    print(f"icons     = {[i['src'] for i in data.get('icons', [])]}")
    print("note      : pwa-register.js reads the code from its own src; "
          "sw.js propagates it to every request")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
