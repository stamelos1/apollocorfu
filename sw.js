const CACHE_NAME = 'apollo-corfu-v1';
const urlsToCache = [
  '/apollocorfu/',
  '/apollocorfu/index.html',
  '/apollocorfu/apollo_corfu_qna.html',
  '/apollocorfu/apollo_corfu_handbook.html',
  '/apollocorfu/asador_farm_to_flame.html',
  '/apollocorfu/coryfo_by_botrini.html',
  '/apollocorfu/la_cantina_ristorante.html',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) return response;
      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200) return response;
        var responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
