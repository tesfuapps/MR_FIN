/* Registers the offline service worker on every exported HTML page.
 * Kept as an external file (not inline) so it works under strict CSP too.
 */
(function () {
  if (!('serviceWorker' in navigator)) return;

  var done = false;
  function register() {
    if (done) return;
    done = true;
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {
      // Non-secure context, private mode, or blocked SW: the web app still works.
    });
  }

  if (document.readyState === 'complete') register();
  else {
    window.addEventListener('load', register, { once: true });
    setTimeout(register, 4000); // don't wait forever for a slow font/image
  }
})();
