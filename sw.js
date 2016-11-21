var log = console.log.bind(console);
var err = console.error.bind(console);

self.addEventListener('install', (e) => {
  e.waitUntil(self.skipWaiting());
  log('Service Worker: Installed');
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
  log('Service Worker: Active');
});

self.addEventListener('fetch', (e) => {
  log('Service Worker: Fetch');
});
