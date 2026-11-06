/* Mr. Fin — offline app shell.
 * A fetch handler here is one of Chrome's PWA installability requirements.
 * Bump CACHE_VERSION whenever the shell changes so old caches are dropped.
 */
const CACHE_VERSION = 'mr-fin-shell-v2';

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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache =>
      Promise.all(
        CORE_ASSETS.map(url =>
          fetch(url, { cache: 'reload' })
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

  // Navigations: network first, but fall back to the cached app shell so the
  // installed app still opens if the preview session or the network expires.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (!res || !res.ok) throw new Error('navigation failed');
          const copy = res.clone();
          caches.open(CACHE_VERSION)
            .then(cache => cache.put('/index.html', copy))
            .catch(() => {});
          return res;
        })
        .catch(() =>
          caches.match('/index.html').then(hit => hit || caches.match('/'))
        )
    );
    return;
  }

  // Static assets: cache first (bundle filenames are content-hashed, so a new
  // deploy always produces a new URL and never serves stale JS).
  event.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res && res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_VERSION)
            .then(cache => cache.put(req, copy))
            .catch(() => {});
        }
        return res;
      });
    })
  );
});
