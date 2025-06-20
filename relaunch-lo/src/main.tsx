// PFAD: src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

// Die Importpfade benötigen keine Endung mehr, Vite/TS findet die .tsx-Dateien
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import WebentwicklungLayout from './pages/Webentwicklung/WebentwicklungLayout';
import MarketingAutomationLayout from './pages/MarketingAutomation/MarketingAutomationLayout';
import DigitalizationLayout from './pages/Digitalization/DigitalizationLayout';
import LoginPage from './pages/LoginPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },      {
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
      }
    ],
  },
  { path: '/login', element: <LoginPage /> },
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