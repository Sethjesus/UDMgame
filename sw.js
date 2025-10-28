// sw.js
const CACHE_VERSION = 'v4';           // ← 調版本即可強制刷新
const CACHE_NAME = `udmgame-${CACHE_VERSION}`;

// 盡量用相對路徑，避免子路徑錯亂
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
  // 需要的 css/js 檔也加進來，例如：
  // './styles.css',
  // './main.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k.startsWith('udmgame-') && k !== CACHE_NAME) ? caches.delete(k) : null))
    ).then(() => self.clients.claim())
  );
});

// cache-first with network fallback
self.addEventListener('fetch', (e) => {
  const req = e.request;
  // 只處理 GET
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        // 只快取同源成功回應
        try {
          const url = new URL(req.url);
          if (url.origin === location.origin && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          }
        } catch (_) {}
        return res;
      }).catch(() => cached || Response.error());
    })
  );
});
