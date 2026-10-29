// Minimal hand-written service worker: app shell + offline fallback.
// API responses are never cached.
const CACHE = "santhai-v1";
const SHELL = ["/", "/offline.html", "/icons/icon-192.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  // Cross-origin (backend, Supabase, fonts), non-GET and /api: straight to network, no caching.
  if (req.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api")) return;

  // Hashed build assets are immutable: cache-first.
  if (url.pathname.startsWith("/_next/static/")) {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
            return res;
          })
      )
    );
    return;
  }

  // Pages: network-first, fall back to cached copy, then the offline page.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).catch(() => caches.match(req).then((hit) => hit || caches.match("/offline.html")))
    );
  }
});
