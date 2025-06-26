// Service Worker Cleanup - Complete removal of caching functionality

export const registerSW = () => {
  console.log('🧹 Starting Service Worker cleanup process...');
  
  if ('serviceWorker' in navigator) {
    // First, unregister any existing service workers
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
        console.log('🗑️ Unregistered existing service worker');
      });
    });

    // Clear all caches manually
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('🗑️ Clearing cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        console.log('✅ All caches cleared manually');
      });
    }

    // Register the cleanup service worker temporarily
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('🔄 Cleanup Service Worker registered temporarily');
        
        // Listen for messages from the service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'CACHE_CLEARED') {
            console.log('✅ Received cache cleared notification');
            // Reload the page after a short delay to ensure clean state
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        });

        // Force update to activate cleanup immediately
        registration.update();
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
        // If registration fails, just reload the page
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
  } else {
    console.log('ℹ️ Service Worker not supported in this browser');
  }
};

export const unregisterSW = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
          console.log('🗑️ Service Worker unregistered');
        });
      })
      .catch((error) => {
        console.error('❌ Error unregistering service worker:', error);
      });
  }
};
