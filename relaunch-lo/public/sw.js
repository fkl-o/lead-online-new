// Service Worker für Performance-Optimierung
const CACHE_NAME = 'leadgen-dashboard-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/login',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// API Routes die gecacht werden sollen
const API_CACHE_PATTERNS = [
  /\/api\/auth\/me$/,
  /\/api\/leads\/stats$/,
  /\/api\/users\/stats$/
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE_URLS);
      })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Nur GET Requests cachen
  if (request.method !== 'GET') {
    return;
  }

  // Cache-Strategie für Dashboard-spezifische Requests
  if (url.pathname.startsWith('/dashboard')) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          // Return cached version if available
          if (response) {
            return response;
          }

          // Fetch from network and cache
          return fetch(request)
            .then((response) => {
              // Check if valid response
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // Clone response as it can only be consumed once
              const responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });

              return response;
            });
        })
    );
    return;
  }

  // Cache-Strategie für API Requests
  if (url.pathname.startsWith('/api/')) {
    const shouldCache = API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
    
    if (shouldCache) {
      event.respondWith(
        caches.match(request)
          .then((response) => {
            // Cache first, then network (stale-while-revalidate)
            const fetchPromise = fetch(request)
              .then((networkResponse) => {
                if (networkResponse.ok) {
                  const responseToCache = networkResponse.clone();
                  caches.open(CACHE_NAME)
                    .then((cache) => {
                      cache.put(request, responseToCache);
                    });
                }
                return networkResponse;
              })
              .catch(() => {
                // Return cached version if network fails
                return response;
              });

            // Return cached version immediately, update in background
            return response || fetchPromise;
          })
      );
      return;
    }
  }

  // Default behavior for other requests
  event.respondWith(
    caches.match(request)
      .then((response) => {
        return response || fetch(request);
      })
  );
});
