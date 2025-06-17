// src/components/Layout.jsx
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../lib/reveal-init"; // Import the reveal script

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* Hier werden die jeweiligen Seiteninhalte geladen */}
      </main>
      <Footer />
    </>
  );
};

export default Layout;