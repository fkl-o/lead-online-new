// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

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