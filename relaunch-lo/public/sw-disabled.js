// DISABLED Service Worker - Complete removal for static hosting
// This file exists to prevent 404 errors but does nothing

console.log('⚠️ Service Worker disabled for static hosting');

// Immediate unregistration of any existing service workers
self.addEventListener('install', () => {
  console.log('🚫 Service Worker install - immediately unregistering');
  self.registration.unregister();
});

self.addEventListener('activate', () => {
  console.log('🚫 Service Worker activate - immediately unregistering');  
  self.registration.unregister();
});

// No fetch event handler - let all requests pass through normally
