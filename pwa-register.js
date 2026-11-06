/* Registers the offline service worker on every exported HTML page.
 * Kept as an external file (not inline) so it works under strict CSP too.
 *
 * On a sharecode-gated preview host this script is loaded as
 * /pwa-register.js?sharecode=XXXX. The same code is appended to /sw.js so the
 * worker script itself can be fetched without relying on a session cookie.
 * On a normal domain there is no query, so this stays a plain /sw.js.
 */
(function () {
  if (!('serviceWorker' in navigator)) return;

  function shareCode() {
    try {
      var s = document.currentScript;
      if (s && s.src) return new URL(s.src, location.href).searchParams.get('sharecode');
    } catch (e) { /* no currentScript or odd URL */ }
    return null;
  }

  var done = false;
  function register() {
    if (done) return;
    done = true;
    var code = shareCode();
    var url = '/sw.js' + (code ? '?sharecode=' + encodeURIComponent(code) : '');
    navigator.serviceWorker.register(url, { scope: '/' }).catch(function () {
      // Non-secure context, private mode, or blocked SW: the web app still works.
    });
  }

  if (document.readyState === 'complete') register();
  else {
    window.addEventListener('load', register, { once: true });
    setTimeout(register, 4000); // don't wait forever for a slow font/image
  }
})();
