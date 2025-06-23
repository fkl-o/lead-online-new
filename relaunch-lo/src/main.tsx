// PFAD: src/main.tsx

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

// Static imports for core components
import Layout from './components/Layout';

// Dynamic imports using React.lazy for code splitting
const HomePage = React.lazy(() => import('./pages/HomePage'));
const WebentwicklungLayout = React.lazy(() => import('./pages/Webentwicklung/WebentwicklungLayout'));
const MarketingAutomationLayout = React.lazy(() => import('./pages/MarketingAutomation/MarketingAutomationLayout'));
const DigitalizationLayout = React.lazy(() => import('./pages/Digitalization/DigitalizationLayout'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-600"></div>
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
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "webentwicklung",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <WebentwicklungLayout />
          </Suspense>
        ),
      },
      {
        path: "marketing-automation",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <MarketingAutomationLayout />
          </Suspense>
        ),
      },
      {
        path: "digitalization",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <DigitalizationLayout />
          </Suspense>
        ),
      },
      {
        path: "contact",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ContactPage />
          </Suspense>
        ),
      }
    ],
  },
  { 
    path: '/login', 
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage />
      </Suspense>
    )
  },
]);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root-Element mit der ID 'root' wurde im DOM nicht gefunden.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
);