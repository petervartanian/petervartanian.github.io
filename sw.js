const CACHE_NAME = 'pv-site-v2';

const URLS = [
  '/',
  '/projects',
  '/portfolio',
  '/media',
  '/cv',
  '/contact',
  '/assets/css/style.css',
  '/assets/img/favicon-16x16.png',
  '/assets/img/favicon-32x32.png',
  '/assets/img/apple-touch-icon.png',
  '/assets/img/og-card.jpg',
  '/site.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.map((n) => (n === CACHE_NAME ? null : caches.delete(n)))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          if (!res || res.status !== 200 || res.type === 'opaque') return res;
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => cached);
    })
  );
});
