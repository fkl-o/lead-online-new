import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Cookie, Shield, TrendingUp, Target } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true);
      // Animated entrance
      setTimeout(() => setAnimationStep(1), 100);
      setTimeout(() => setAnimationStep(2), 300);
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
    if (typeof window !== 'undefined') {
      // Analytics implementation
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
    <div className={`cookie-banner-modern ${animationStep >= 1 ? 'visible' : ''}`} role="dialog" aria-labelledby="cookie-banner-title">
      <div className="cookie-banner-backdrop" onClick={() => {}} />
      
      <Card className={`cookie-banner-card-modern ${animationStep >= 2 ? 'ready' : ''}`}>
        <div className="cookie-banner-glow" />
        
        <div className="cookie-banner-content-modern">
          {/* Header with icon */}
          <div className="cookie-banner-header-modern">
            <div className="cookie-banner-icon-container">
              <Cookie className="cookie-banner-icon-modern" />
            </div>
            
            <div className="cookie-banner-main-modern">
              <h2 id="cookie-banner-title" className="cookie-banner-title-modern">
                Cookie-Einstellungen
              </h2>
              
              <p className="cookie-banner-description-modern">
                Wir nutzen Cookies zur Optimierung unserer Website und unserer Services.
              </p>
            </div>
          </div>

          {!showDetails ? (
            <>
              {/* Primary Action */}
              <div className="cookie-banner-actions-modern">
                <Button 
                  onClick={acceptAll} 
                  className="cookie-banner-primary-cta"
                >
                  Alle akzeptieren
                </Button>
                
                <Button 
                  onClick={() => setShowDetails(true)} 
                  className="cookie-banner-secondary-cta"
                >
                  Anpassen
                </Button>
              </div>
            </>
          ) : (
            <div className="cookie-banner-details-modern">
              {/* Enhanced Categories with Visual Appeal */}
              <div className="cookie-banner-categories-modern">
                
                {/* Essential - Always On */}
                <div className="cookie-category-modern essential-category">
                  <div className="category-header">
                    <div className="category-icon-container">
                      <Shield className="category-icon essential-icon" />
                    </div>
                    <div className="category-content">
                      <h3 className="category-title">Essentiell</h3>
                      <p className="category-description">Grundfunktionen & Sicherheit</p>
                    </div>
                    <div className="category-toggle">
                      <div className="toggle-essential">✓</div>
                    </div>
                  </div>
                </div>

                {/* Analytics - Recommended */}
                <div 
                  className="cookie-category-modern analytics-category"
                  onClick={() => updatePreference('analytics', !preferences.analytics)}
                >
                  <div className="category-header">
                    <div className="category-icon-container">
                      <TrendingUp className="category-icon analytics-icon" />
                    </div>
                    <div className="category-content">
                      <h3 className="category-title">Analyse</h3>
                      <p className="category-description">Website-Verbesserung durch Nutzungsanalyse</p>
                      <div className="category-benefit">Empfohlen für optimale Erfahrung</div>
                    </div>
                    <div className="category-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) => updatePreference('analytics', e.target.checked)}
                          className="toggle-input"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Marketing - Personalization */}
                <div 
                  className="cookie-category-modern marketing-category"
                  onClick={() => updatePreference('marketing', !preferences.marketing)}
                >
                  <div className="category-header">
                    <div className="category-icon-container">
                      <Target className="category-icon marketing-icon" />
                    </div>
                    <div className="category-content">
                      <h3 className="category-title">Personalisierung</h3>
                      <p className="category-description">Maßgeschneiderte Inhalte & relevante Angebote</p>
                      <div className="category-benefit">Für individuelle Empfehlungen</div>
                    </div>
                    <div className="category-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={(e) => updatePreference('marketing', e.target.checked)}
                          className="toggle-input"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions for Details View */}
              <div className="cookie-banner-actions-details">
                <Button onClick={acceptSelected} className="cookie-banner-save-cta">
                  Auswahl speichern
                </Button>
                <Button onClick={acceptAll} className="cookie-banner-all-cta">
                  Alle akzeptieren
                </Button>
              </div>

              {/* Minimal option - less prominent */}
              <Button 
                onClick={() => {
                  const minimalConsent = { necessary: true, analytics: false, marketing: false };
                  setPreferences(minimalConsent);
                  localStorage.setItem('cookieConsent', JSON.stringify(minimalConsent));
                  localStorage.setItem('cookieConsentDate', new Date().toISOString());
                  setIsVisible(false);
                }}
                className="cookie-banner-minimal-cta"
              >
                Nur essentiell (eingeschränkte Funktionen)
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CookieBanner;
