import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { revealInit } from "../lib/reveal-init";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async"; // ✅ Import hinzugefügt

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    revealInit();
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
