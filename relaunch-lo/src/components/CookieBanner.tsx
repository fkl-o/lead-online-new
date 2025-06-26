import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Cookie } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);
    
    // Enable analytics if accepted
    if (allAccepted.analytics) {
      enableAnalytics();
    }
  };

  const acceptSelected = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);
    
    if (preferences.analytics) {
      enableAnalytics();
    }
  };

  const enableAnalytics = () => {
    // Only enable analytics if user consented
    if (typeof window !== 'undefined') {
      // Example: Google Analytics 4
      // window.gtag?.('consent', 'update', {
      //   analytics_storage: 'granted'
      // });
    }
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 cookie-banner" role="dialog" aria-labelledby="cookie-banner-title">
      <Card className="bg-white border-t-2 border-t-brand-600 shadow-xl max-w-4xl mx-auto">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Cookie className="w-6 h-6 text-brand-600" aria-hidden="true" />
            </div>
            
            <div className="flex-1">
              <h2 id="cookie-banner-title" className="text-lg font-bold text-gray-900 mb-2">
                Cookie-Einstellungen
              </h2>
              
              <p className="text-gray-600 mb-4 text-sm">
                Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. 
                Durch das Akzeptieren helfen Sie uns, unsere Services kontinuierlich zu verbessern.
              </p>

              {!showDetails ? (
                <div className="flex flex-wrap gap-3">
                  <Button onClick={acceptAll} className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2">
                    Alle akzeptieren & fortfahren
                  </Button>
                  <Button 
                    onClick={() => setShowDetails(true)} 
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-50 px-4 py-2"
                  >
                    Einstellungen anpassen
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-blue-800 text-xs">
                      <strong>Hinweis:</strong> Für die optimale Nutzung unserer Website empfehlen wir Ihnen, 
                      alle Cookies zu akzeptieren. Dies ermöglicht uns, Ihnen personalisierte Inhalte 
                      und ein verbessertes Nutzererlebnis zu bieten.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                            ✅ Notwendige Cookies
                          </h3>
                          <p className="text-xs text-gray-600">
                            Erforderlich für grundlegende Website-Funktionen und Sicherheit
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.necessary}
                          disabled
                          className="w-3 h-3 text-green-600"
                          aria-label="Notwendige Cookies (erforderlich)"
                        />
                      </label>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">📊 Analyse-Cookies</h3>
                          <p className="text-xs text-gray-600">
                            Helfen uns zu verstehen, wie Sie unsere Website nutzen, um diese zu verbessern
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Empfohlen für besseres Nutzererlebnis
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) => updatePreference('analytics', e.target.checked)}
                          className="w-3 h-3 text-blue-600"
                          aria-label="Analyse-Cookies"
                        />
                      </label>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">🎯 Marketing-Cookies</h3>
                          <p className="text-xs text-gray-600">
                            Ermöglichen relevante Werbung und personalisierte Inhalte
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Für maßgeschneiderte Angebote
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={(e) => updatePreference('marketing', e.target.checked)}
                          className="w-3 h-3 text-blue-600"
                          aria-label="Marketing-Cookies"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    <Button onClick={acceptSelected} className="bg-brand-600 hover:bg-brand-700 text-white font-semibold flex-1 py-3">
                      Auswahl bestätigen
                    </Button>
                    <Button onClick={acceptAll} className="bg-green-600 hover:bg-green-700 text-white font-semibold flex-1 py-3">
                      Alle akzeptieren (empfohlen)
                    </Button>
                  </div>
                  
                  <div className="pt-1">
                    <Button 
                      onClick={() => {
                        const minimalConsent = {
                          necessary: true,
                          analytics: false,
                          marketing: false,
                        };
                        setPreferences(minimalConsent);
                        localStorage.setItem('cookieConsent', JSON.stringify(minimalConsent));
                        localStorage.setItem('cookieConsentDate', new Date().toISOString());
                        setIsVisible(false);
                      }}
                      variant="ghost" 
                      className="w-full text-xs text-gray-500 hover:text-gray-600 h-auto py-1"
                    >
                      Nur notwendige Cookies (eingeschränkte Funktionalität)
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CookieBanner;
