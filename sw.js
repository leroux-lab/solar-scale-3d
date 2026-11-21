const CACHE_NAME = 'solar-scale-3d-v11';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './src/style.css',
  './src/main.js',
  './src/planetsData.js',
  './icon-192.png',
  './icon-512.png',
  './icon.svg',
];

// 1. Install: Pre-cache core app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// 2. Activate: Clean up old caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// 3. Fetch:
// - Network-First (with cache fallback) for HTML, CSS, JS so mobile PWAs pick up updates immediately
// - Cache-First (with background refresh) for icons & Three.js CDN modules for instant offline loads
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isAppCode =
    isSameOrigin &&
    (event.request.mode === 'navigate' ||
      event.request.destination === 'document' ||
      event.request.destination === 'script' ||
      event.request.destination === 'style' ||
      /\.(html|js|css|json)$/i.test(url.pathname));

  if (isAppCode) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request, { ignoreSearch: true }))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkFetch = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === 'basic' || networkResponse.type === 'cors')
          ) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkFetch;
    })
  );
});
