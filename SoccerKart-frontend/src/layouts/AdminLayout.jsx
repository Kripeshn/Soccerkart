import React, { useEffect, useState } from "react";
import { NavLink, Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaThLarge,
  FaBoxOpen,
  FaPlus,
  FaTags,
  FaUsers,
  FaStore,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import toastr from "toastr";
import logo from "../assets/logo1.png";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import { LayoutContext } from "./LayoutContext";
import "./AdminLayout.css";
import "../styles/admin.css";

const shellValue = { shell: "admin" };

const NAV_ITEMS = [
  { to: "/dashboard/admin", label: "Overview", icon: FaThLarge, end: true },
  { to: "/dashboard/admin/allproducts", label: "Products", icon: FaBoxOpen },
  { to: "/dashboard/admin/create-product", label: "Add product", icon: FaPlus },
  { to: "/dashboard/admin/create-category", label: "Categories", icon: FaTags },
  { to: "/dashboard/admin/manage-user", label: "Users", icon: FaUsers },
];

function pageTitle(pathname) {
  if (pathname.startsWith("/dashboard/admin/product/")) return "Edit product";
  const match = NAV_ITEMS.find((i) =>
    i.end ? pathname === i.to : pathname.startsWith(i.to)
  );
  return match ? match.label : "Admin";
}

export default function AdminLayout() {
  const [auth, setAuth] = useAuth();
  const [, setCart] = useCart();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("authToken");
    localStorage.removeItem("cart");
    setAuth({ user: null, token: "" });
    setCart([]);
    toastr.success("Logged out successfully.");
    navigate("/");
  };

  const name = auth?.user?.name || "Admin";
  const initial = name.charAt(0).toUpperCase();

  return (
    <LayoutContext.Provider value={shellValue}>
      <div className="sk-admin">
        <div
          className={`sk-admin-overlay ${open ? "is-open" : ""}`}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />

        <aside className={`sk-admin-sidebar ${open ? "is-open" : ""}`}>
          <div className="sk-admin-brand">
            <Link to="/dashboard/admin" className="sk-admin-logo">
              <img src={logo} alt="Soccerkart" />
            </Link>
            <button
              className="sk-admin-close"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          </div>

          <p className="sk-admin-group">Manage</p>
          <nav className="sk-admin-nav" aria-label="Admin">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `sk-admin-link ${isActive ? "is-active" : ""}`
                }
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sk-admin-foot">
            <Link to="/" className="sk-admin-link">
              <FaStore aria-hidden="true" />
              <span>View store</span>
            </Link>
            <button className="sk-admin-link" onClick={handleLogout}>
              <FaSignOutAlt aria-hidden="true" />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        <div className="sk-admin-body">
          <header className="sk-admin-topbar">
            <button
              className="sk-admin-burger"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <FaBars />
            </button>
            <h1 className="sk-admin-title">{pageTitle(pathname)}</h1>
            <div className="sk-admin-user">
              <span className="sk-admin-avatar" aria-hidden="true">{initial}</span>
              <span className="sk-admin-user-meta">
                <strong>{name}</strong>
                <small>Administrator</small>
              </span>
            </div>
          </header>

          <main className="sk-admin-content">
            <Outlet />
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
