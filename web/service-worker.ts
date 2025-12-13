// @ts-check
/// <reference types="vite/client" />
/// <reference lib="WebWorker" />

let accessToken = '';

const CACHE_NAME = 'svg-cache-v1';

self.addEventListener('install', event => {
  // Activate SW immediately, no waiting
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      // Claim control of all clients immediately
      await self.clients.claim();

      // Delete old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) return caches.delete(name);
        }),
      );
    })(),
  );
});

self.addEventListener('fetch', event => {
  const {request} = event;
  // Check if the request is for an SVG file
  if (request.url.endsWith('.svg') || request.url.endsWith('.png')) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // If not in cache, fetch from network and cache the response
        return fetch(request).then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(request, networkResponse.clone()); // Cache the response
            return networkResponse;
          });
        });
      }),
    );
  } else {
    // For other requests, just fetch normally
    event.respondWith(fetch(request));
  }
});
