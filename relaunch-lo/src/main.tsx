// PFAD: src/main.tsx

import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

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

// Service Worker komplett deaktiviert für statisches Hosting
// Nur Cleanup für bestehende Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
      console.log('�️ Existing Service Worker unregistered');
    });
  });
  
  // Caches manuell löschen
  if ('caches' in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
        console.log('🗑️ Cache deleted:', cacheName);
      });
    });
  }
}