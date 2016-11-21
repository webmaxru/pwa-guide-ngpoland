var log = console.log.bind(console);
var err = console.error.bind(console);

var version = '4';
var cacheName = 'pwa-ngpoland-guide-v' + version;
var dataCacheName = 'pwa-ngpoland-guide-data-v' + version;
var appShellFilesToCache = [
  './',
  './index.html',
  './app.js',
  './indigo-pink.css',
  './Reflect.js',
  './zone.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(self.skipWaiting());
  log('Service Worker: Installed');

  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      log('Service Worker: Caching App Shell');
      return cache.addAll(appShellFilesToCache);
    })
  );

});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
  log('Service Worker: Active');

  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {

        if (key !== cacheName) {
          log('Service Worker: Removing old cache', key);
          return caches.delete(key);
        }

      }));
    })
  );

});

self.addEventListener('fetch', (e) => {
  log('Service Worker: Fetch URL ', e.request.url);

  // Match requests for data and handle them separately
  if (e.request.url.indexOf('assets/') != -1) {

    e.respondWith(

      fetch(e.request)
      .then((response) => {
        return caches.open(dataCacheName).then((cache) => {

          cache.put(e.request.url, response.clone());
          log('Service Worker: Fetched & Cached URL ', e.request.url);
          return response.clone();

        });
      })

      // Cache-first
      // caches.match(e.request.clone()).then((response) => {
      //   return response || fetch(e.request.clone()).then((r2) => {
      //     return caches.open(dataCacheName).then((cache) => {
      //       console.log('Service Worker: Fetched & Cached URL ', e.request.url);
      //       cache.put(e.request.url, r2.clone());
      //       return r2.clone();
      //     });
      //   });
      // })

    );

  } else {

    // The code for App Shell
    e.respondWith(

      caches.match(e.request).then((response) => {
        return response || fetch(e.request);
      })

      // Network-first
      // fetch(e.request).catch((err) => {
      //   return caches.match(e.request);
      // })

    );

  }
});
