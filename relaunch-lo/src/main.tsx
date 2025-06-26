// PFAD: src/main.tsx

import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

// PWA initialization
import './lib/pwa-registration';
import './lib/offline-storage';

// Static imports for core components (critical path)
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load ALL components to avoid bundling issues
const HomePage = lazy(() => import('./pages/HomePage'));
const WebentwicklungLayout = lazy(() => import('./pages/Webentwicklung/WebentwicklungLayout'));
const MarketingAutomationLayout = lazy(() => import('./pages/MarketingAutomation/MarketingAutomationLayout'));
const DigitalizationLayout = lazy(() => import('./pages/Digitalization/DigitalizationLayout'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Imprint = lazy(() => import('./pages/Imprint'));

// UI Provider
import { SnackbarProvider } from './components/ui/snackbar';

// Optimized loading component with better UX
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Seite wird geladen...</p>
    </div>
  </div>
);


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "webentwicklung",
        element: <WebentwicklungLayout />,
      },
      {
        path: "marketing-automation",
        element: <MarketingAutomationLayout />,
      },
      {
        path: "digitalization",
        element: <DigitalizationLayout />,
      },      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "datenschutz",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PrivacyPolicy />
          </Suspense>
        ),
      },
      {
        path: "impressum",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Imprint />
          </Suspense>
        ),
      }
    ],
  },
  { 
    path: '/login', 
    element: <LoginPage />
  },  { 
    path: '/dashboard', 
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard />
        </Suspense>
      </ProtectedRoute>
    )
  },
]);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root-Element mit der ID 'root' wurde im DOM nicht gefunden.");
}

// Remove initial loading spinner
const initialLoading = document.getElementById('initial-loading');
if (initialLoading) {
  initialLoading.remove();
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <SnackbarProvider>
        <HelmetProvider>
          <RouterProvider router={router} />
        </HelmetProvider>
      </SnackbarProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// PWA Service Worker Registration
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ SW registered:', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available
                console.log('🔄 New content available');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log('❌ SW registration failed:', error);
      });
  });
}

// Initialize Performance Monitoring
if (import.meta.env.PROD) {
  import('./lib/performance').then(({ PerformanceMonitor }) => {
    PerformanceMonitor.getInstance();
  });
}

// Load PWA Test Utils in development
if (import.meta.env.DEV) {
  import('./lib/pwa-test-utils');
}

// Import Inter font from @fontsource package
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";