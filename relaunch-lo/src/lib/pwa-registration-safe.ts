// Safe PWA registration that works in all environments
export interface PWAUpdateInfo {
  needRefresh: boolean;
  updateAvailable: boolean;
  offlineReady: boolean;
}

export interface PWARegistration {
  updateSW: (reloadPage?: boolean) => Promise<void>;
  needRefresh: [boolean, (value: boolean) => void];
  offlineReady: [boolean, (value: boolean) => void];
}

let updateSW: ((reloadPage?: boolean) => Promise<void>) | undefined;

// Safe import function that handles missing virtual modules
async function safeImportPWA() {
  try {
    // Try dynamic import for virtual:pwa-register
    const pwaModule = await import('virtual:pwa-register');
    return pwaModule.registerSW;
  } catch (error) {
    console.log('ℹ️ PWA: virtual:pwa-register not available, using fallback');
    return null;
  }
}

export const initializePWA = (): PWARegistration => {
  let needRefreshState = false;
  let offlineReadyState = false;
  
  const setNeedRefresh = (value: boolean) => {
    needRefreshState = value;
    // Trigger custom event for UI updates
    window.dispatchEvent(new CustomEvent('pwa-need-refresh', { detail: value }));
  };
  
  const setOfflineReady = (value: boolean) => {
    offlineReadyState = value;
    // Trigger custom event for UI updates  
    window.dispatchEvent(new CustomEvent('pwa-offline-ready', { detail: value }));
  };

  // Initialize PWA registration asynchronously
  safeImportPWA().then((registerSW) => {
    if (registerSW && typeof registerSW === 'function') {
      updateSW = registerSW({
        onNeedRefresh() {
          console.log('🔄 PWA: New content available, please refresh.');
          setNeedRefresh(true);
        },
        onOfflineReady() {
          console.log('✅ PWA: App ready to work offline.');
          setOfflineReady(true);
        },
        onRegistered(r: ServiceWorkerRegistration | undefined) {
          console.log('✅ PWA: Service worker registered successfully');
          // Check for updates every hour
          if (r) {
            setInterval(() => {
              r.update();
            }, 60 * 60 * 1000); // 1 hour
          }
        },
        onRegisterError(error: any) {
          console.error('❌ PWA: Service worker registration failed', error);
        },
      });
    } else {
      console.log('ℹ️ PWA: Service worker not available in this environment');
      // Create a no-op function for development
      updateSW = () => Promise.resolve();
    }
  }).catch(() => {
    console.log('ℹ️ PWA: PWA registration failed, using fallback');
    updateSW = () => Promise.resolve();
  });

  // Provide immediate fallback
  if (!updateSW) {
    updateSW = () => Promise.resolve();
  }

  return {
    updateSW: updateSW || (() => Promise.resolve()),
    needRefresh: [needRefreshState, setNeedRefresh],
    offlineReady: [offlineReadyState, setOfflineReady],
  };
};

// Utility functions for offline detection
export const isOnline = (): boolean => navigator.onLine;

export const onlineStatus = {
  subscribe: (callback: (online: boolean) => void) => {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Return unsubscribe function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
};

// Initialize PWA on module load
if (typeof window !== 'undefined') {
  // Register the PWA when the page loads
  window.addEventListener('load', () => {
    initializePWA();
  });
}
