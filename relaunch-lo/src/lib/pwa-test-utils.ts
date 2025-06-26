// Test-Utilities für PWA Mobile Notification
// Diese Funktionen können in der Browser-Konsole verwendet werden

declare global {
  interface Window {
    PWA_TEST: {
      showMobileNotification: () => void;
      hideMobileNotification: () => void;
      resetNotificationSettings: () => void;
      simulateMobile: () => void;
      checkInstallability: () => void;
    };
  }
}

// Test-Tool für PWA Notification
const PWATestUtils = {
  showMobileNotification() {
    // Force show notification by clearing localStorage
    localStorage.removeItem('mobile-pwa-notification-dismissed');
    localStorage.removeItem('mobile-pwa-notification-last-shown');
    localStorage.removeItem('ios-pwa-notification-dismissed');
    
    // Dispatch custom event to trigger notification
    window.dispatchEvent(new CustomEvent('force-show-pwa-notification'));
    
    console.log('🔔 Mobile PWA Notification force-triggered');
    console.log('💡 Reload page to see the notification');
  },

  hideMobileNotification() {
    // Simulate user dismissal
    localStorage.setItem('mobile-pwa-notification-dismissed', 'true');
    localStorage.setItem('mobile-pwa-notification-last-shown', Date.now().toString());
    
    console.log('❌ Mobile PWA Notification dismissed');
    console.log('💡 Reload page - notification should not appear');
  },

  resetNotificationSettings() {
    // Clear all PWA notification settings
    const keys = [
      'mobile-pwa-notification-dismissed',
      'mobile-pwa-notification-last-shown',
      'ios-pwa-notification-dismissed',
      'pwa-install-dismissed'
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
    
    console.log('🔄 All PWA notification settings reset');
    console.log('💡 Reload page to see fresh behavior');
  },

  simulateMobile() {
    // Add mobile user agent temporarily
    const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1';
    
    Object.defineProperty(navigator, 'userAgent', {
      value: mobileUA,
      writable: false
    });
    
    console.log('📱 Mobile simulation activated');
    console.log('💡 Reload page to test mobile behavior');
  },

  checkInstallability() {
    const isHTTPS = location.protocol === 'https:';
    const hasManifest = document.querySelector('link[rel="manifest"]');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    console.log('🔍 PWA Installability Check:');
    console.log(`📡 HTTPS: ${isHTTPS ? '✅' : '❌'}`);
    console.log(`📄 Manifest: ${hasManifest ? '✅' : '❌'}`);
    console.log(`💻 Already Installed: ${isStandalone ? '✅' : '❌'}`);
    console.log(`📱 Mobile Device: ${isMobile ? '✅' : '❌'}`);
    
    if (isHTTPS && hasManifest && !isStandalone) {
      console.log('🎉 PWA can be installed!');
    } else {
      console.log('⚠️ PWA installation requirements not met');
    }
  }
};

// Make available globally for testing
if (typeof window !== 'undefined') {
  window.PWA_TEST = PWATestUtils;
  
  console.log(`
🧪 PWA Test Utils loaded!

Available commands:
- PWA_TEST.showMobileNotification()     // Force show notification
- PWA_TEST.hideMobileNotification()     // Hide notification  
- PWA_TEST.resetNotificationSettings()  // Reset all settings
- PWA_TEST.simulateMobile()            // Simulate mobile device
- PWA_TEST.checkInstallability()       // Check PWA requirements

Usage example:
PWA_TEST.resetNotificationSettings();
// Then reload page to see fresh notification behavior
  `);
}

export default PWATestUtils;
