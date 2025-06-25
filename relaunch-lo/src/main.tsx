// PFAD: src/main.tsx

import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

// Performance optimization
import { registerSW } from './lib/serviceWorker';

// Static imports for core components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import WebentwicklungLayout from './pages/Webentwicklung/WebentwicklungLayout';
import MarketingAutomationLayout from './pages/MarketingAutomation/MarketingAutomationLayout';
import DigitalizationLayout from './pages/Digitalization/DigitalizationLayout';
import LoginPage from './pages/LoginPage';
import ContactPage from './pages/ContactPage';
import TestPage from './pages/TestPage';
import { SnackbarProvider } from './components/ui/snackbar';

// Lazy load dashboard components to improve initial page load
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Dashboard wird geladen...</p>
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
        element: <HomePage />,
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
  { 
    path: '/test', 
    element: <TestPage />
  },
]);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root-Element mit der ID 'root' wurde im DOM nicht gefunden.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <SnackbarProvider>
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    </SnackbarProvider>
  </React.StrictMode>
);

// Register service worker for performance optimization
registerSW();