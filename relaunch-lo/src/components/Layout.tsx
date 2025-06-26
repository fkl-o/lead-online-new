import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { revealInit } from "../lib/reveal-init";
import Header from "./Header";
import Footer from "./Footer";
import CookieBanner from "./CookieBanner";
import { Helmet } from "react-helmet-async";

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Mark document as JS loaded for reveal fallback
    document.documentElement.classList.add('js-loaded');
    
    // Delay reveal init slightly to ensure DOM is ready
    setTimeout(() => {
      revealInit();
    }, 100);
  }, [location.pathname]);
  return (
    <>
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Helmet>
      
      {/* Skip to content link for screen readers */}
      <a 
        href="#main-content" 
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
      >
        Zum Hauptinhalt springen
      </a>
      
      <div className="min-h-screen">
        <Header />
        <main id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
        <Footer />
      </div>
      
      {/* DSGVO Components */}
      <CookieBanner />
    </>
  );
};

export default Layout;
