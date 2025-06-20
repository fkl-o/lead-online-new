import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { revealInit } from "../lib/reveal-init";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    revealInit();
  }, [location.pathname]); // <- neu: Observer neu bei Route-Änderung

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
