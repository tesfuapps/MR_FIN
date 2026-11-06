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
MAX_BUNDLE_ALIASES = 3

# Bundle hashes that were publicly deployed; keep these as aliases forever so
# a cached index.html never hits a dead script URL.
LEGACY_BUNDLE_HASHES = (
    "entry-c252f6d7f392298190d873af943131a5.js",
    "entry-d5f5440a6b06dccaf5fd45ac551f4562.js",
    "entry-cc517c36b841230e9d33093c2ddcb992.js",
    # Shipped publicly with the "Mr. Fin" rebrand; keep it resolvable so a
    # phone that cached that index.html still hydrates after this deploy.
    "entry-482c5a2a2f72544fb1d281f66aadde6b.js",
)

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

# ---------------------------------------------------------------------------
# PWA installability tags. Chrome only offers "Install app" when the page has
# a valid manifest (name, standalone display, 192 + 512 icons) and a service
# worker with a fetch handler. Expo does not emit any of these for a bare
# static export, so we add the head tags here and ship the actual files from
# finance_ui_ref/public/.
# ---------------------------------------------------------------------------
PWA_START = "<!-- finspark-pwa:start -->"
PWA_END = "<!-- finspark-pwa:end -->"
TITLE_TEXT = "Mr. Fin"

PWA_TAGS = (
    '<meta name="description" content="Mr. Fin — Ethiopian-calendar daily pace budget '
    'for the Addis Ababa cash economy."/>'
    '<meta name="theme-color" content="#0b0f19"/>'
    '<meta name="application-name" content="Mr. Fin"/>'
    '<meta name="mobile-web-app-capable" content="yes"/>'
    '<meta name="apple-mobile-web-app-capable" content="yes"/>'
    '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>'
    '<meta name="apple-mobile-web-app-title" content="Mr. Fin"/>'
    '<link rel="manifest" href="/manifest.webmanifest"/>'
    '<link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png"/>'
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png"/>'
    '<script src="/pwa-register.js" defer></script>'
)
PWA_BLOCK = PWA_START + PWA_TAGS + PWA_END

# ---------------------------------------------------------------------------
# Reload / hydration guard.
#
# An Expo static export contains a fully rendered SSR shell. If the JS bundle
# cannot load (expired preview session, offline, blocked CDN), React never
# hydrates and the browser keeps showing that raw shell: Expo's default white
# header titled "index" plus stale prerendered numbers. Users see a white
# "Index" board after a reload.
#
# Three defences, all portable (no sharecode, no external assets):
#   1. Hide the SSR-only white header and force a dark background.
#   2. Cover the shell with a branded boot splash until React hydrates.
#   3. Always remove the splash (mutation / load / hard timeout) so it can
#      never trap the app behind an overlay.
# ---------------------------------------------------------------------------
BOOT_START = "<!-- mrfin-boot:start -->"
BOOT_END = "<!-- mrfin-boot:end -->"

BOOT_BLOCK = BOOT_START + """<style id="mrfin-boot-css">
html,body,#root{background-color:#0b0f19!important}
#root h1[role="heading"][dir="auto"]{display:none!important}
#root div[style*="background-color:rgba(255,255,255,1.00)"][style*="border-bottom-color:rgba(216,216,216,1.00)"]{display:none!important}
#wb-boot{position:fixed;inset:0;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:#0b0f19;color:#f8fafc;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;transition:opacity .25s ease}
#wb-boot .wb-mark{font-size:36px;font-weight:800;letter-spacing:-1.5px}
#wb-boot .wb-mark span{color:#11ef8c}
#wb-boot .wb-sub{font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:#94a3b8}
#wb-boot .wb-bar{width:132px;height:3px;border-radius:3px;background:#243049;overflow:hidden;margin-top:10px}
#wb-boot .wb-bar i{display:block;width:42%;height:100%;background:#11ef8c;animation:wb-slide 1.1s ease-in-out infinite}
@keyframes wb-slide{0%{transform:translateX(-110%)}100%{transform:translateX(350%)}}
</style>
<div id="wb-boot" aria-hidden="true">
<div class="wb-mark">Mr. <span>Fin</span></div>
<div class="wb-sub">Addis daily pace</div>
<div class="wb-bar"><i></i></div>
</div>
<script>
(function(){
  var el=document.getElementById('wb-boot');
  if(!el) return;
  var done=false;
  function hide(){
    if(done) return; done=true;
    el.style.opacity='0';
    setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); },280);
  }
  function watch(){
    try{
      var root=document.getElementById('root');
      if(!root || !window.MutationObserver) return;
      var mo=new MutationObserver(function(){ hide(); mo.disconnect(); });
      mo.observe(root,{childList:true,subtree:true});
    }catch(e){}
  }
  if(document.readyState==='loading')
    document.addEventListener('DOMContentLoaded',watch,{once:true});
  else watch();
  if(document.readyState==='complete') setTimeout(hide,150);
  else window.addEventListener('load',function(){ setTimeout(hide,150); },{once:true});
  setTimeout(hide,3000);
})();
</script>""" + BOOT_END

BOOT_RE = re.compile(
    re.escape(BOOT_START) + r".*?" + re.escape(BOOT_END),
    re.S,
)

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
# Match the reset plus any previously injected overflow guard so re-running
# this script stays idempotent instead of stacking duplicate style blocks.
EXPO_RESET_RE = re.compile(
    r'<style id="expo-reset">.*?</style>'
    r'(?:\s*<style id="overflow-guard">.*?</style>)*',
    re.S,
)
PWA_RE = re.compile(
    re.escape(PWA_START) + r".*?" + re.escape(PWA_END),
    re.S,
)
PUBLIC_DIR = os.path.join(ROOT, "finance_ui_ref", "public")


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

    # 6. Give the static pages a real document title (Expo emits an empty one).
    if re.search(r"<title[^>]*>\s*</title>", html):
        html = re.sub(
            r"<title([^>]*)>\s*</title>",
            lambda m: "<title" + m.group(1) + ">" + TITLE_TEXT + "</title>",
            html,
            count=1,
        )
    elif "<title" not in html:
        html = html.replace("</head>", "<title>" + TITLE_TEXT + "</title></head>", 1)

    # 7. PWA manifest / icons / service-worker registration. Idempotent so
    #    re-running this script never stacks duplicate tags.
    if PWA_RE.search(html):
        html = PWA_RE.sub(lambda _m: PWA_BLOCK, html, count=1)
    else:
        html = html.replace("</head>", PWA_BLOCK + "</head>", 1)

    # 8. Branded boot guard. Inject right after <body> so the CSS applies
    #    before Expo's SSR shell is parsed, but the <div> stays valid markup.
    #    Idempotent: re-patching an already patched export replaces the block.
    if BOOT_RE.search(html):
        html = BOOT_RE.sub(lambda _m: BOOT_BLOCK, html, count=1)
    elif re.search(r"<body[^>]*>", html):
        html = re.sub(
            r"<body[^>]*>",
            lambda m: m.group(0) + BOOT_BLOCK,
            html,
            count=1,
        )
    else:
        html = BOOT_BLOCK + html

    return html


def main() -> int:
    if not os.path.isdir(DIST):
        print(f"ERROR: export directory not found: {DIST}", file=sys.stderr)
        print("Run `npx expo export --platform web --output-dir dist` first.", file=sys.stderr)
        return 1

    # Expo copies finance_ui_ref/public/ into dist/ during export. Mirror it
    # here as well so the PWA files survive a re-patch of an older export.
    if os.path.isdir(PUBLIC_DIR):
        for base, _dirs, files in os.walk(PUBLIC_DIR):
            rel_dir = os.path.relpath(base, PUBLIC_DIR)
            target_dir = DIST if rel_dir == "." else os.path.join(DIST, rel_dir)
            os.makedirs(target_dir, exist_ok=True)
            for name in files:
                shutil.copy2(
                    os.path.join(base, name),
                    os.path.join(target_dir, name),
                )
        print("synced  finance_ui_ref/public -> dist")

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

    # Keep previous bundle filenames as aliases that serve the newest app.
    #
    # A phone that cached an older index.html still points at the older hash.
    # If that file 404s the app never hydrates and no new features (e.g. the
    # logging toast) appear, even though the deploy is correct. Identical file
    # content means git stores just one blob, so aliases are cheap.
    js_rel_dir = os.path.join("_expo", "static", "js", "web")
    dist_js_dir = os.path.join(DIST, js_rel_dir)
    root_js_dir = os.path.join(ROOT, js_rel_dir)
    os.makedirs(root_js_dir, exist_ok=True)

    new_bundles = sorted(
        name for name in os.listdir(dist_js_dir)
        if name.startswith("entry-") and name.endswith(".js")
    ) if os.path.isdir(dist_js_dir) else []

    if new_bundles:
        with open(os.path.join(dist_js_dir, new_bundles[0]), "rb") as fh:
            newest_bytes = fh.read()

        legacy = [
            name for name in os.listdir(root_js_dir)
            if name.startswith("entry-") and name.endswith(".js")
            and name != new_bundles[0]
        ]
        # Most recent first, keep a small rolling window plus any hashes that
        # were shipped publicly (those are the ones a phone may still cache).
        legacy.sort(
            key=lambda n: os.path.getmtime(os.path.join(root_js_dir, n)),
            reverse=True,
        )
        keep = set(legacy[:MAX_BUNDLE_ALIASES])
        keep.update(
            name for name in LEGACY_BUNDLE_HASHES if name != new_bundles[0]
        )
        for name in sorted(keep):
            with open(os.path.join(root_js_dir, name), "wb") as fh:
                fh.write(newest_bytes)
            print(f"aliased {name} -> {new_bundles[0]}")
        for name in legacy:
            if name not in keep:
                os.remove(os.path.join(root_js_dir, name))
                print(f"removed old bundle alias {name}")

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
