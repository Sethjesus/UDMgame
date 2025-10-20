const CACHE_NAME = "udmgame-pwa-v1";
const ASSETS = [
  "/UDMgame/",
  "/UDMgame/index.html",
  "/UDMgame/manifest.json",
  "/UDMgame/icons/icon-192.png",
  "/UDMgame/icons/icon-512.png"
];

// 安裝階段：快取主要資源
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 啟用階段：清除舊快取
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 讀取階段：先快取再網路
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
