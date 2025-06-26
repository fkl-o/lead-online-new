import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ZoomIn, ZoomOut, Eye, Contrast, Type } from 'lucide-react';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
}

export const AccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 100,
    highContrast: false,
    reducedMotion: false,
    screenReaderMode: false
  });

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      const parsedSettings = JSON.parse(saved);
      setSettings(parsedSettings);
      applySettings(parsedSettings);
    }
    
    // Check for user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      updateSetting('reducedMotion', true);
    }
  }, []);

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = `${newSettings.fontSize}%`;
    
    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Screen reader mode
    if (newSettings.screenReaderMode) {
      root.classList.add('screen-reader-mode');
    } else {
      root.classList.remove('screen-reader-mode');
    }
  };

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
    localStorage.setItem('accessibilitySettings', JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      fontSize: 100,
      highContrast: false,
      reducedMotion: false,
      screenReaderMode: false
    };
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    localStorage.removeItem('accessibilitySettings');
  };

  return (
    <>
      {/* Accessibility Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
        aria-label="Barrierefreiheits-Einstellungen öffnen"
        title="Barrierefreiheits-Einstellungen"
      >
        <Eye className="w-5 h-5" />
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <Card className="fixed top-16 right-4 z-50 p-4 w-80 shadow-2xl bg-white border-2 border-blue-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Barrierefreiheit
              </h2>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                aria-label="Schließen"
              >
                ×
              </Button>
            </div>

            {/* Font Size Controls */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Schriftgröße: {settings.fontSize}%
              </label>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => updateSetting('fontSize', Math.max(80, settings.fontSize - 10))}
                  variant="outline"
                  size="sm"
                  disabled={settings.fontSize <= 80}
                  aria-label="Schrift verkleinern"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <input
                  type="range"
                  min="80"
                  max="150"
                  step="10"
                  value={settings.fontSize}
                  onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                  className="flex-1"
                  aria-label="Schriftgröße einstellen"
                />
                <Button
                  onClick={() => updateSetting('fontSize', Math.min(150, settings.fontSize + 10))}
                  variant="outline"
                  size="sm"
                  disabled={settings.fontSize >= 150}
                  aria-label="Schrift vergrößern"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Contrast className="w-4 h-4" />
                Hoher Kontrast
              </label>
              <Button
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                variant={settings.highContrast ? "default" : "outline"}
                size="sm"
                aria-pressed={settings.highContrast}
              >
                {settings.highContrast ? 'Ein' : 'Aus'}
              </Button>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Animationen reduzieren
              </label>
              <Button
                onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                variant={settings.reducedMotion ? "default" : "outline"}
                size="sm"
                aria-pressed={settings.reducedMotion}
              >
                {settings.reducedMotion ? 'Ein' : 'Aus'}
              </Button>
            </div>

            {/* Screen Reader Mode */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Screenreader-Modus
              </label>
              <Button
                onClick={() => updateSetting('screenReaderMode', !settings.screenReaderMode)}
                variant={settings.screenReaderMode ? "default" : "outline"}
                size="sm"
                aria-pressed={settings.screenReaderMode}
              >
                {settings.screenReaderMode ? 'Ein' : 'Aus'}
              </Button>
            </div>

            {/* Reset Button */}
            <Button
              onClick={resetSettings}
              variant="outline"
              className="w-full"
            >
              Alle Einstellungen zurücksetzen
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};

// Hook for accessibility utilities
export const useAccessibility = () => {
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const focusElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
    }
  };

  const skipToContent = () => {
    const main = document.querySelector('main') as HTMLElement;
    if (main) {
      main.focus();
      main.scrollIntoView();
    }
  };

  return {
    announceToScreenReader,
    focusElement,
    skipToContent
  };
};
