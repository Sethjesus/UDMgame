self.addEventListener('install', e => {
  console.log('Service Worker installed.');
  e.waitUntil(
    caches.open('jp-esg-cache-v1').then(cache => cache.addAll([
      './',
      './index.html',
      './manifest.json',
      './icons/icon-192.png',
      './icons/icon-512.png'
    ]))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
