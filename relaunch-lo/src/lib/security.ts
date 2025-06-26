// Security utilities for preventing XSS, CSRF and other attacks
// Using native browser APIs for better compatibility with deployment

export class SecurityUtils {
  // XSS Protection - Basic HTML escaping using native DOM API
  static sanitizeHTML(dirty: string): string {
    if (typeof window === 'undefined') {
      // Server-side fallback
      return dirty.replace(/[&<>"']/g, (match) => {
        const map: Record<string, string> = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        };
        return map[match];
      });
    }
    
    // Client-side using DOM
    const div = document.createElement('div');
    div.textContent = dirty;
    return div.innerHTML;
  }

  // Input validation for forms
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  static validateText(text: string, maxLength: number = 1000): boolean {
    return typeof text === 'string' && text.length <= maxLength && text.trim().length > 0;
  }

  // Prevent SQL injection in API calls
  static escapeString(str: string): string {
    return str.replace(/['";\\]/g, '\\$&');
  }

  // Rate limiting check (client-side helper)
  static checkRateLimit(key: string, maxRequests: number = 5, timeWindow: number = 60000): boolean {
    const now = Date.now();
    const storageKey = `rate_limit_${key}`;
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) {
      localStorage.setItem(storageKey, JSON.stringify({ count: 1, firstRequest: now }));
      return true;
    }

    const data = JSON.parse(stored);
    
    // Reset if time window has passed
    if (now - data.firstRequest > timeWindow) {
      localStorage.setItem(storageKey, JSON.stringify({ count: 1, firstRequest: now }));
      return true;
    }

    // Check if limit exceeded
    if (data.count >= maxRequests) {
      return false;
    }

    // Increment counter
    localStorage.setItem(storageKey, JSON.stringify({ count: data.count + 1, firstRequest: data.firstRequest }));
    return true;
  }

  // CSRF Token management
  static getCSRFToken(): string {
    let token = sessionStorage.getItem('csrf_token');
    if (!token) {
      token = this.generateSecureToken();
      sessionStorage.setItem('csrf_token', token);
    }
    return token;
  }

  static generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Content Security Policy helpers
  static createNonce(): string {
    return this.generateSecureToken();
  }

  // Secure localStorage usage
  static secureSetItem(key: string, value: any): void {
    try {
      const encrypted = btoa(JSON.stringify(value));
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store data securely:', error);
    }
  }

  static secureGetItem(key: string): any {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      return JSON.parse(atob(encrypted));
    } catch (error) {
      console.error('Failed to retrieve data securely:', error);
      return null;
    }
  }

  // Form validation with security checks
  static validateFormData(data: Record<string, any>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for required fields
    if (!data.email || !this.validateEmail(data.email)) {
      errors.push('Ungültige E-Mail-Adresse');
    }

    if (data.phone && !this.validatePhone(data.phone)) {
      errors.push('Ungültige Telefonnummer');
    }

    if (!data.name || !this.validateText(data.name, 100)) {
      errors.push('Ungültiger Name');
    }

    if (data.message && !this.validateText(data.message, 5000)) {
      errors.push('Nachricht ist zu lang oder ungültig');
    }

    // Check for potential malicious content
    Object.values(data).forEach(value => {
      if (typeof value === 'string') {
        if (this.containsSuspiciousContent(value)) {
          errors.push('Verdächtiger Inhalt erkannt');
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static containsSuspiciousContent(content: string): boolean {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\(/i,
      /expression\(/i,
      /vbscript:/i,
      /data:text\/html/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(content));
  }

  // Browser security checks
  static checkBrowserSecurity(): { secure: boolean; warnings: string[] } {
    const warnings: string[] = [];

    // Check HTTPS
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      warnings.push('Unsichere HTTP-Verbindung erkannt');
    }

    // Check if localStorage is available
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
    } catch {
      warnings.push('LocalStorage nicht verfügbar');
    }

    // Check if cookies are enabled
    if (!navigator.cookieEnabled) {
      warnings.push('Cookies sind deaktiviert');
    }

    return {
      secure: warnings.length === 0,
      warnings
    };
  }

  // Cleanup sensitive data
  static clearSensitiveData(): void {
    // Clear auth tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('csrf_token');
    
    // Clear form data
    const formKeys = Object.keys(localStorage).filter(key => key.startsWith('form_'));
    formKeys.forEach(key => localStorage.removeItem(key));
  }
}
