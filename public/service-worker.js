/* eslint-disable no-restricted-globals */
// BUILD_VERSION is replaced with a timestamp by scripts/stamp-sw.js after each
// build, so every deploy produces a byte-different worker and browsers detect
// the update.
const BUILD_VERSION = '__BUILD_VERSION__';
const CACHE_PREFIX = 'dyn-';
const CACHE_NAME = CACHE_PREFIX + BUILD_VERSION;
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(APP_SHELL);
      // Clients still controlled by the old cache-first worker (caches named
      // like "0.0.24") never see the update prompt, so take over right away.
      const keys = await caches.keys();
      if (keys.some((k) => !k.startsWith(CACHE_PREFIX))) self.skipWaiting();
    })(),
  );
});

// The page asks for this when the user taps "Update"
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Firebase, fonts, CDNs etc. go straight to the network
  if (url.origin !== self.location.origin) return;

  // Pages: network first so a new deploy shows up, cached shell when offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put('/index.html', copy));
          }
          return res;
        })
        .catch(() => caches.match('/index.html')),
    );
    return;
  }

  // Hashed build assets never change: cache first
  if (url.pathname.startsWith('/static/')) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE_NAME).then((c) => c.put(request, copy));
            }
            return res;
          }),
      ),
    );
    return;
  }

  // Everything else (icons, manifest, images): stale-while-revalidate
  event.respondWith(
    caches.match(request).then((hit) => {
      const network = fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || network;
    }),
  );
});
