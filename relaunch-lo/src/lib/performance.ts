// Performance Monitoring für PWA
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private observer: PerformanceObserver | null = null;

  private constructor() {
    this.initializePerfObserver();
    this.measureWebVitals();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializePerfObserver(): void {
    if ('PerformanceObserver' in window) {
      try {
        this.observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              this.reportMetric('LCP', entry.startTime, 'ms');
            }
            if (entry.entryType === 'first-input') {
              this.reportMetric('FID', (entry as any).processingStart - entry.startTime, 'ms');
            }
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              this.reportMetric('CLS', (entry as any).value, '');
            }
          });
        });

        this.observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      } catch (e) {
        console.warn('Performance Observer not supported:', e);
      }
    }
  }

  private measureWebVitals(): void {
    // First Contentful Paint
    if ('performance' in window && 'getEntriesByType' in performance) {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.reportMetric('FCP', fcpEntry.startTime, 'ms');
      }

      // Time to Interactive (approximation)
      window.addEventListener('load', () => {
        setTimeout(() => {
          const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
          this.reportMetric('TTI', loadTime, 'ms');
        }, 0);
      });
    }
  }

  private reportMetric(name: string, value: number, unit: string): void {
    console.log(`📊 ${name}: ${Math.round(value)}${unit}`);
    
    // Report to analytics if available
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'web_vitals', {
        metric_name: name,
        metric_value: Math.round(value),
        metric_unit: unit
      });
    }
    
    // Store in localStorage for debugging
    const metrics = JSON.parse(localStorage.getItem('pwa-metrics') || '{}');
    metrics[name] = { value: Math.round(value), unit, timestamp: Date.now() };
    localStorage.setItem('pwa-metrics', JSON.stringify(metrics));
  }

  public getStoredMetrics(): Record<string, any> {
    return JSON.parse(localStorage.getItem('pwa-metrics') || '{}');
  }

  public clearMetrics(): void {
    localStorage.removeItem('pwa-metrics');
  }
}

// Auto-initialize in production
if (import.meta.env.PROD) {
  PerformanceMonitor.getInstance();
}
