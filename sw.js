const CACHE_NAME = "pv-site-v71";

const URLS = [
  "/",
  "/cv/",
  "/portfolio/",
  "/artifacts",
  "/contact/",
  "/assets/css/style.css?v=65",
  "/assets/img/favicon-16.png",
  "/assets/img/favicon-32.png",
  "/assets/img/apple-touch-icon.png",
  "/assets/img/phv-icon-192.png",
  "/assets/img/phv-icon-source-512.png",
  "/assets/img/phv-og-image-1200x630.jpg",
  "/assets/img/phv-site-preview-1200x630.jpg",
  "/assets/img/portfolio.jpg",
  "/.well-known/security.txt",
  "/humans.txt",
  "/llms.txt",
  "/site.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names.map((n) => (n === CACHE_NAME ? null : caches.delete(n))),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (!res || res.status !== 200 || res.type === "opaque") return res;
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => cached);
    }),
  );
});
