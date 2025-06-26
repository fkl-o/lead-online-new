// EMPTY Service Worker - No functionality
// This file exists only to prevent 404 errors but does nothing

console.log('🚫 Service Worker completely disabled');

// Immediately unregister without any functionality
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
  // Unregister immediately
  self.registration.unregister();
});

// No fetch event handler - all requests pass through normally
