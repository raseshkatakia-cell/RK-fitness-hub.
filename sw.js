const CACHE_NAME = 'rk-fitness-cache-v2';
const FILES_TO_CACHE = [
  '/',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'privacy.html',
  'logo-192.png',
  'logo-512.png'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => {
      if (key !== CACHE_NAME) return caches.delete(key);
    })))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  // Network-first for navigation, cache-first for others
  if (evt.request.mode === 'navigate') {
    evt.respondWith(
      fetch(evt.request).catch(() => caches.match('index.html'))
    );
    return;
  }
  evt.respondWith(
    caches.match(evt.request).then(response => response || fetch(evt.request))
  );
});
