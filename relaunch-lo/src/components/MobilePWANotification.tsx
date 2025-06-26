import React, { useState, useEffect } from 'react';
import { Smartphone, X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const MobilePWANotification: React.FC = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Mobile detection
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
      const hasSmallScreen = window.innerWidth <= 768;
      return isMobileDevice || hasSmallScreen;
    };

    // Check if already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as any).standalone === true) {
        return true;
      }
      return false;
    };

    setIsMobile(checkIfMobile());
    setIsInstalled(checkInstalled());

    // Only proceed if mobile and not installed
    if (!checkIfMobile() || checkInstalled()) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Check if user has already dismissed this notification
      const dismissed = localStorage.getItem('mobile-pwa-notification-dismissed');
      const lastShown = localStorage.getItem('mobile-pwa-notification-last-shown');
      const now = Date.now();
      
      // Show again if 7 days have passed since last dismissal
      if (!dismissed || (lastShown && now - parseInt(lastShown) > 7 * 24 * 60 * 60 * 1000)) {
        // Show notification after 10 seconds
        setTimeout(() => {
          setShowNotification(true);
        }, 10000);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowNotification(false);
      setDeferredPrompt(null);
      localStorage.removeItem('mobile-pwa-notification-dismissed');
      localStorage.removeItem('mobile-pwa-notification-last-shown');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For iOS - show manual installation hint
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream) {
      const dismissed = localStorage.getItem('ios-pwa-notification-dismissed');
      if (!dismissed) {
        setTimeout(() => {
          setShowNotification(true);
        }, 15000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
      } else {
        console.log('PWA installation dismissed');
      }
      
      setDeferredPrompt(null);
      setShowNotification(false);
    } else {
      // For iOS or browsers without install prompt
      setShowNotification(false);
      // Show manual installation instructions
      alert('Um LeadGenPro zu installieren:\n\n1. Tippen Sie auf das Teilen-Symbol\n2. Wählen Sie "Zum Home-Bildschirm hinzufügen"\n3. Bestätigen Sie mit "Hinzufügen"');
    }
  };

  const handleDismiss = () => {
    setShowNotification(false);
    localStorage.setItem('mobile-pwa-notification-dismissed', 'true');
    localStorage.setItem('mobile-pwa-notification-last-shown', Date.now().toString());
  };

  const handleLater = () => {
    setShowNotification(false);
    // Show again in 24 hours
    localStorage.setItem('mobile-pwa-notification-last-shown', Date.now().toString());
  };

  // Don't show if not mobile, already installed, or notification is disabled
  if (!isMobile || isInstalled || !showNotification) {
    return null;
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
        {/* Notification Card */}
        <div className="bg-white rounded-t-2xl shadow-2xl w-full max-w-sm transform transition-all duration-300 ease-out animate-in slide-in-from-bottom">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-2 rounded-lg">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">App installieren</h3>
                <p className="text-xs text-gray-500">Schneller & bequemer Zugriff</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Schließen"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 mb-4">
                <div className="text-4xl mb-2">📱</div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">
                  Jetzt diese WebApp auf Ihr Smartphone installieren!
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Nutzen Sie LeadGenPro wie eine native App - schneller Zugriff, 
                  offline verfügbar und direkt vom Homescreen.
                </p>
              </div>
              
              {/* Features */}
              <div className="grid grid-cols-3 gap-3 mb-6 text-xs">
                <div className="text-center">
                  <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-1">
                    ⚡
                  </div>
                  <span className="text-gray-600">Schneller</span>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-1">
                    📡
                  </div>
                  <span className="text-gray-600">Offline</span>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-1">
                    🏠
                  </div>
                  <span className="text-gray-600">Homescreen</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleInstallClick}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>{isIOS ? 'Installationsanleitung' : 'Jetzt installieren'}</span>
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleLater}
                  className="flex-1 bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Später
                </button>
                <button
                  onClick={handleDismiss}
                  className="flex-1 bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Nicht mehr zeigen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
