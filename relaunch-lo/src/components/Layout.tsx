import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { revealInit } from "../lib/reveal-init";
import Header from "./Header";
import Footer from "./Footer";
import LoginModal from "./modals/LoginModal";

const Layout = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    revealInit();
  }, [location.pathname]); // <- neu: Observer neu bei Route-Änderung

  return (
    <>
      <Header onLoginClick={() => setLoginModalOpen(true)} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
};

export default Layout;
