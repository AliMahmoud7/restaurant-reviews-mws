let assetsCacheName = 'restaurant-reviews-static-v1';

// Create the cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(assetsCacheName).then(cache => {
      return cache.addAll([
        '/',
        'index.html',
        'restaurant.html',
        'css/styles.css',
        'js/main.js',
        'js/dbhelper.js',
        'js/restaurant_info.js',
        'data/restaurants.json',
        'img/1.jpg',
        'img/2.jpg',
        'img/3.jpg',
        'img/4.jpg',
        'img/5.jpg',
        'img/6.jpg',
        'img/7.jpg',
        'img/8.jpg',
        'img/9.jpg',
        'img/10.jpg',
      ]).catch(err => {
        console.log('Cache failed!!', err);
      });
    })
  );
});

// Delete old caches for our app when update SW
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('restaurant-reviews-') &&
            cacheName !== assetsCacheName;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Intercept requests to return from our cache if there
self.addEventListener('fetch', event => {
  // const requestUrl = new URL(event.request.url);
  const requestUrl = event.request.url;

  event.respondWith(
    caches.match(event.request).then(response => {
      return response ||
        fetch(event.request).then(networkResponse => {
          return caches.open(assetsCacheName).then(cache => {
            cache.put(requestUrl, networkResponse.clone());
            return networkResponse;
          });
        });
    })
  );
});
