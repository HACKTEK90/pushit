self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('reminder-cache').then(cache => {
      return cache.addAll([
        'index.html',
        'script.js',
        'style.css',
        'manifest.json',
        'icon.png'
        'beep-329314.mp3'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
