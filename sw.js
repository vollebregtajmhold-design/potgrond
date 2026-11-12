// Kleine service worker zodat de pagina als app geïnstalleerd kan worden.
// Haalt alles gewoon van internet; de gegevens komen uit Firebase.
const CACHE = 'potgrond-v2';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  // Eerst internet, bij geen verbinding de laatst bewaarde versie.
  e.respondWith(
    fetch(e.request).then(res => {
      const kopie = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, kopie));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
