import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { NavBar } from "../Components/Layout/Nav";
import Footers from "../Components/Layout/Footer/Footer";
import { LayoutContext } from "./LayoutContext";
import "./PublicLayout.css";

const shellValue = { shell: "public" };

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export default function PublicLayout() {
  return (
    <LayoutContext.Provider value={shellValue}>
      <ScrollToTop />
      <div className="sk-public">
        <NavBar />
        <main className="sk-public-main">
          <Outlet />
        </main>
        <Footers />
      </div>
    </LayoutContext.Provider>
  );
}
