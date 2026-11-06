/* Mr. Fin — offline app shell.
 * A fetch handler here is one of Chrome's PWA installability requirements.
 * Bump CACHE_VERSION whenever the shell changes so old caches are dropped.
 *
 * Sharecode-gated preview hosts authorise a request either by a session
 * cookie or by a valid `sharecode` query parameter. Chrome fetches PWA assets
 * without cookies, so EVERY same-origin request made here is given the code
 * that was used to register this worker. On a normal domain there is no code
 * and this file behaves like a plain offline shell.
 */
const CACHE_VERSION = 'mr-fin-shell-v3';

const SHARE_CODE = (function () {
  try { return new URL(self.location.href).searchParams.get('sharecode') || ''; }
  catch (e) { return ''; }
})();

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/transaction.html',
  '/settings.html',
  '/profile.html',
  '/manifest.webmanifest',
  '/pwa-register.js',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-192-maskable.png',
  '/icons/icon-512-maskable.png',
];

/** Append the worker's sharecode to a same-origin URL that is missing it. */
function withCode(url) {
  if (!SHARE_CODE) return url;
  try {
    const u = new URL(url, self.location.origin);
    if (u.origin !== self.location.origin) return url;
    if (!u.searchParams.has('sharecode')) u.searchParams.set('sharecode', SHARE_CODE);
    return u.toString();
  } catch (e) { return url; }
}

/** Cache key with the sharecode removed, so coded + uncoded URLs share a slot. */
function cacheKey(url) {
  try {
    const u = new URL(url, self.location.origin);
    u.searchParams.delete('sharecode');
    return u.toString();
  } catch (e) { return url; }
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache =>
      Promise.all(
        CORE_ASSETS.map(url =>
          fetch(withCode(url), { cache: 'reload' })
            .then(res => (res && res.ok ? cache.put(url, res.clone()) : null))
            .catch(() => null)
        )
      )
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const coded = withCode(req.url);
  // Keep the original Request when no rewrite is needed (normal domains).
  const target = coded === req.url ? req : coded;
  const key = cacheKey(req.url);

  // Navigations: network first, but fall back to the cached app shell so the
  // installed app still opens if the preview session or the network expires.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(target)
        .then(res => {
          if (!res || !res.ok) throw new Error('navigation failed');
          const copy = res.clone();
          caches.open(CACHE_VERSION)
            .then(cache => cache.put(cacheKey('/index.html'), copy))
            .catch(() => {});
          return res;
        })
        .catch(() =>
          caches.match(cacheKey('/index.html')).then(hit => hit || caches.match('/'))
        )
    );
    return;
  }

  // Static assets: cache first (bundle filenames are content-hashed, so a new
  // deploy always produces a new URL and never serves stale JS).
  event.respondWith(
    caches.match(key).then(hit => {
      if (hit) return hit;
      return fetch(target).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_VERSION)
            .then(cache => cache.put(key, copy))
            .catch(() => {});
        }
        return res;
      });
    })
  );
});
