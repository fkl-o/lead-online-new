// PFAD: src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

// Static imports for all components to avoid lazy loading issues
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import WebentwicklungLayout from './pages/Webentwicklung/WebentwicklungLayout';
import MarketingAutomationLayout from './pages/MarketingAutomation/MarketingAutomationLayout';
import DigitalizationLayout from './pages/Digitalization/DigitalizationLayout';
import LoginPage from './pages/LoginPage';
import ContactPage from './pages/ContactPage';
import Dashboard from './pages/Dashboard';
import TestPage from './pages/TestPage';


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
    element: <Dashboard />
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
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
);