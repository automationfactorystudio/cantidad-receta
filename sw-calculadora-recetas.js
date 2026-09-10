const PREFIX = 'calculadora-recetas-' + new URL(self.registration.scope).pathname + '-';
const CACHE = PREFIX + 'v4';
const ASSETS = ['./', './index.html', './manual.html', './manifest-calculadora-recetas.json', './icon-appdeboy-192.png', './icon-appdeboy-512.png'];
self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
 event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
 const url = new URL(event.request.url);
 if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
 event.respondWith(caches.open(CACHE).then(async cache => {
  const stored = await cache.match(event.request, {ignoreSearch: true});
  if (stored) return stored;
  if (event.request.mode === 'navigate') return (await cache.match('./index.html')) || fetch(event.request);
  return fetch(event.request);
 }));
});
