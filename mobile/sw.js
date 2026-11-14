/* ISNAD - service worker */
const CACHE = 'namaz-v39';
const SHELL = [
  './', 'index.html', 'app.js', 'content.js', 'voice.js', 'a11y.js', 'i18n2.js', 'prayer.js', 'i18n.js', 'cities.js', 'manifest.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'fonts/amiri-regular.woff2'
];
// Optional Adhan recordings - only cached if you added them.
const ADHAN = ['adhan/voices.json', 'adhan/adhan.mp3', 'adhan/adhan-madinah.mp3', 'adhan/adhan-makkah2.mp3', 'adhan/adhan-fajr.mp3'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(async (c) => {
      await c.addAll(SHELL);
      // Best effort: one missing file must not fail the whole install.
      await Promise.all(ADHAN.map((u) => c.add(u).catch(() => {})));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first (always fresh when online), cache fallback when offline. Same-origin GET only.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req).then((m) => m || caches.match('index.html')))
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) if ('focus' in c) return c.focus();
      return self.clients.openWindow('./');
    })
  );
});
