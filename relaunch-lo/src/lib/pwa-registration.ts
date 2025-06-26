import { registerSW } from 'virtual:pwa-register';

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

  updateSW = registerSW({
    onNeedRefresh() {
      console.log('🔄 PWA: New content available, please refresh.');
      setNeedRefresh(true);
    },
    onOfflineReady() {
      console.log('✅ PWA: App ready to work offline.');
      setOfflineReady(true);
    },
    onRegistered(r) {
      console.log('✅ PWA: Service worker registered successfully');
      // Check for updates every hour
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000); // 1 hour
      }
    },
    onRegisterError(error) {
      console.error('❌ PWA: Service worker registration failed', error);
    },
  });

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
