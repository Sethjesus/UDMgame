const CACHE = "udmgame-pwa-v1";
const ASSETS = [
  "/UDMgame/",
  "/UDMgame/index.html",
  "/UDMgame/manifest.json",
  "/UDMgame/192.png",
  "/UDMgame/512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE && caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
