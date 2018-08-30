let assetsCacheName = 'restaurant-reviews-static-v1';

/** Create the cache */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(assetsCacheName).then(cache => {
      return cache.addAll([
        'index.html',
        'restaurant.html',
        // 'css/styles.css',
        'dist/css/styles.bundle.min.css',
        // 'js/dbhelper.js',
        'dist/js/dbhelper.min.js',
        'js/main.js',
        'js/restaurant_info.js',
        'manifest.json'
      ]).catch(err => {
        console.log(`Cache failed! ${err}`);
      });
    })
  );
});

/** Delete old caches for our app when update SW */
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

/** Intercept requests to return from our cache if there */
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  // console.log(requestUrl);
  // console.log(event.request);

  if (event.request.method !== 'GET') return;
  if (requestUrl.origin !== location.origin && requestUrl.origin !== 'https://unpkg.com') return;

  event.respondWith(
    caches.match(requestUrl).then(response => {
      if (response) return response;

      return fetch(event.request).then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200 ) {
            return networkResponse;
          }

          return caches.open(assetsCacheName).then(cache => {
            cache.put(requestUrl, networkResponse.clone());
            return networkResponse;
          });
        }).catch(err => {
          console.warn(`Error Fetching item! ${err}`);
        });
    })
  );
});
