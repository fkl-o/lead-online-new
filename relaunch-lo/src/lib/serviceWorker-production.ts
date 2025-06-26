// Alternative Service Worker Registration - Production Safe
// This version completely avoids service workers for static hosting

export const registerSW = () => {
  console.log('🚫 Service Worker registration disabled for production');
  
  // Only perform cleanup if there are existing service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      if (registrations.length > 0) {
        console.log(`🧹 Found ${registrations.length} existing service worker(s), cleaning up...`);
        
        registrations.forEach((registration) => {
          registration.unregister().then(() => {
            console.log('🗑️ Service Worker unregistered');
          });
        });
        
        // Clear all caches
        if ('caches' in window) {
          caches.keys().then((cacheNames) => {
            return Promise.all(
              cacheNames.map((cacheName) => {
                console.log('🗑️ Clearing cache:', cacheName);
                return caches.delete(cacheName);
              })
            );
          }).then(() => {
            console.log('✅ All caches cleared');
          });
        }
      } else {
        console.log('✅ No existing service workers found');
      }
    });
  }
};

export const unregisterSW = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
  }
};
