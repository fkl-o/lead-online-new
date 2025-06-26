import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';

// Simple implementation without virtual:pwa-register
interface PWAUpdateHookReturn {
  needRefresh: [boolean, (value: boolean) => void];
  offlineReady: [boolean, (value: boolean) => void];
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
}

function useRegisterSW(options?: {
  onRegistered?: (r: ServiceWorkerRegistration | undefined) => void;
  onRegisterError?: (error: any) => void;
}): PWAUpdateHookReturn {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          options?.onRegistered?.(registration);
          
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    setNeedRefresh(true);
                  } else {
                    setOfflineReady(true);
                  }
                }
              });
            }
          });
        }
      }).catch((error) => {
        options?.onRegisterError?.(error);
      });
    }
  }, []);

  const updateServiceWorker = async (reloadPage = true) => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        if (reloadPage) {
          window.location.reload();
        }
      }
    }
  };

  return {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  };
}

export const PWAUpdatePrompt: React.FC = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowUpdatePrompt(true);
    }
  }, [needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
    setNeedRefresh(false);
  };

  if (!showUpdatePrompt) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <RefreshCw className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-semibold text-blue-900">Update verfügbar</h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-blue-400 hover:text-blue-600 transition-colors"
            aria-label="Schließen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <p className="text-sm text-blue-800 mb-4">
          Eine neue Version von LeadGenPro ist verfügbar. Aktualisieren Sie für die neuesten Features.
        </p>
        
        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Aktualisieren
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Später
          </button>
        </div>
      </div>
    </div>
  );
};

export const PWAOfflineReady: React.FC = () => {
  const [showOfflineReady, setShowOfflineReady] = useState(false);

  const {
    offlineReady: [offlineReady],
  } = useRegisterSW();

  useEffect(() => {
    if (offlineReady) {
      setShowOfflineReady(true);
      // Auto-hide after 5 seconds
      setTimeout(() => setShowOfflineReady(false), 5000);
    }
  }, [offlineReady]);

  if (!showOfflineReady) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              App bereit für Offline-Nutzung
            </p>
          </div>
          <button
            onClick={() => setShowOfflineReady(false)}
            className="ml-auto text-green-400 hover:text-green-600"
            aria-label="Schließen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
