var log = console.log.bind(console);
var err = console.error.bind(console);

self.addEventListener('install', (e) => {
  log('Service Worker: Installed');
});

self.addEventListener('activate', (e) => {
  log('Push Service Worker: Active');
});

self.addEventListener('push', function(e) {
  log('Push Service Worker: Received push event');
  e.waitUntil(
    fetch('http://localhost:8090/pushdata').then(function(response) {
      return response.json();
    }).then(function(data) {
      var title = 'ngPoland';
      var body = data.msg;
      var icon = '/assets/favicons/favicon-32x32.png';
      var tag = 'static-tag';
      return self.registration.showNotification(title, {
        body: body,
        icon: icon,
        tag: tag
      });
    }, function(err) {
      err(err);
    })
  );
});
