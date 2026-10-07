const CACHE_NAME = "blatador-xrc-shell-v2";
const APP_SHELL = [
  "/",
  "/manifest.json",
  "/site-background.webp",
  "/apple-touch-icon.png",
  "/favicon-photo-64.png",
  "/pwa-icon-192.png",
  "/pwa-icon-512.png",
  "/pwa-icon-512-maskable.png",
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || event.request.url.includes("/api/")) return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
