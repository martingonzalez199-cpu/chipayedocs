const CACHE_NAME = 'chipaye-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/css/reset.css',
  '/css/variables.css',
  '/css/styles.css',
  '/js/storage.js',
  '/js/state.js',
  '/js/orders.js',
  '/js/ui.js',
  '/js/app.js'
];

// Instalar service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.warn('Error en install:', error);
      })
  );
  self.skipWaiting();
});

// Activar service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar requests
self.addEventListener('fetch', event => {
  // Solo interceptar GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorar requests de Chrome extensions
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Estrategia: Cache first, fallback to network
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then(response => {
            // No cachear si no es una response válida
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clonar la response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Fallback offline
            return new Response('Offline - No hay conexión a internet', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});
