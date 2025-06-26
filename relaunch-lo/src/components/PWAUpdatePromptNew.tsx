import { useState, useEffect } from 'react';
import { RefreshCw, X, Wifi, WifiOff, Download } from 'lucide-react';
import { initializePWA, isOnline, onlineStatus } from '../lib/pwa-registration';
import { offlineStorage } from '../lib/offline-storage';

interface PWAPromptProps {
  className?: string;
}

export function PWAUpdatePrompt({ className = '' }: PWAPromptProps) {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [isOnlineStatus, setIsOnlineStatus] = useState(isOnline());
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [updateSW, setUpdateSW] = useState<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    // Initialize PWA synchronously with the safe version
    const pwaRegistration = initializePWA();
    setUpdateSW(() => pwaRegistration.updateSW);

    // Listen for PWA events
    const handleNeedRefresh = (event: CustomEvent) => {
      setNeedRefresh(event.detail);
      setShowPrompt(true);
    };

    const handleOfflineReady = (event: CustomEvent) => {
      setOfflineReady(event.detail);
      setShowPrompt(true);
    };

    window.addEventListener('pwa-need-refresh', handleNeedRefresh as EventListener);
    window.addEventListener('pwa-offline-ready', handleOfflineReady as EventListener);

    // Monitor online status
    const unsubscribeOnlineStatus = onlineStatus.subscribe(setIsOnlineStatus);

    return () => {
      window.removeEventListener('pwa-need-refresh', handleNeedRefresh as EventListener);
      window.removeEventListener('pwa-offline-ready', handleOfflineReady as EventListener);
      unsubscribeOnlineStatus();
    };
  }, []);

  // Auto-hide offline ready message after 5 seconds
  useEffect(() => {
    if (offlineReady && !needRefresh) {
      const timer = setTimeout(() => {
        setShowPrompt(false);
        setOfflineReady(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [offlineReady, needRefresh]);

  const handleUpdate = async () => {
    if (!updateSW) return;
    
    setIsUpdating(true);
    try {
      await updateSW(true);
    } catch (error) {
      console.error('Failed to update service worker:', error);
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    setNeedRefresh(false);
    setOfflineReady(false);
  };

  const syncOfflineData = async () => {
    if (isOnlineStatus) {
      try {
        await offlineStorage.syncOfflineData();
        // You could show a success message here
      } catch (error) {
        console.error('Failed to sync offline data:', error);
      }
    }
  };

  if (!showPrompt) {
    // Show online/offline status indicator
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            isOnlineStatus
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
          title={isOnlineStatus ? 'Online' : 'Offline - Data will sync when back online'}
        >
          {isOnlineStatus ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4" />
          )}
          <span>{isOnlineStatus ? 'Online' : 'Offline'}</span>
          {!isOnlineStatus && (
            <button
              onClick={syncOfflineData}
              className="ml-2 text-red-600 hover:text-red-800 transition-colors"
              title="Sync offline data"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {needRefresh ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Update verfügbar</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Eine neue Version der App ist verfügbar. Aktualisieren Sie jetzt für die neuesten Features.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUpdating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {isUpdating ? 'Aktualisiere...' : 'Aktualisieren'}
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-3 py-2 text-gray-600 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Später
                  </button>
                </div>
              </>
            ) : offlineReady ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <WifiOff className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Offline bereit</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Die App ist jetzt für die Offline-Nutzung konfiguriert. Sie können sie auch ohne Internetverbindung verwenden.
                </p>
              </>
            ) : null}
          </div>
          
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
