import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import toastr from "toastr";
import styles from "./Nav.module.css";
import logo from "../../assets/logo1.png";
import cartimg from "../../assets/cart.svg";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import SearchInput from "../Form/SearchInput";
import { LayoutContext } from "../../layouts/LayoutContext";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About us" },
];

/** The real navigation bar. Rendered once by PublicLayout. */
export function NavBar() {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setUserOpen(false);
  }, [pathname]);

  // elevation on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close user dropdown on outside click / Escape
  useEffect(() => {
    if (!userOpen) return;
    const onDown = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setUserOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [userOpen]);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("authToken");
    localStorage.removeItem("cart");
    setAuth({ user: null, token: "" });
    setCart([]);
    setUserOpen(false);
    toastr.success("Logged out successfully.");
    navigate("/");
  };

  const count = cart?.length || 0;
  const name = auth?.user?.name || "";
  const isAdmin = auth?.user?.role === 1;
  const dashboardPath = `/dashboard/${isAdmin ? "admin" : "user"}`;

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="Soccerkart home">
          <img src={logo} alt="Soccerkart" />
        </Link>

        <nav className={`${styles.panel} ${menuOpen ? styles.open : ""}`} aria-label="Main">
          <div className={styles.searchMobile}>
            <SearchInput />
          </div>
          <ul className={styles.links}>
            {LINKS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.linkActive : ""}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.right}>
          <div className={styles.searchDesktop}>
            <SearchInput />
          </div>

          <Link
            to={auth?.user ? "/cart" : "/login"}
            className={styles.iconBtn}
            aria-label={`Cart${count ? `, ${count} items` : ""}`}
            onClick={() => {
              if (!auth?.user) toastr.warning("You need to login to view your cart");
            }}
          >
            <img src={cartimg} alt="" />
            {count > 0 && <span className={styles.badge}>{count > 99 ? "99+" : count}</span>}
          </Link>

          {auth?.user ? (
            <div className={styles.user} ref={userRef}>
              <button
                className={styles.userBtn}
                onClick={() => setUserOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userOpen}
              >
                <span className={styles.avatar}>{name.charAt(0).toUpperCase() || "U"}</span>
                <FaChevronDown className={`${styles.chev} ${userOpen ? styles.chevUp : ""}`} aria-hidden="true" />
              </button>

              {userOpen && (
                <div className={styles.menu} role="menu">
                  <div className={styles.menuHead}>
                    <strong>{name}</strong>
                    <small>{isAdmin ? "Administrator" : "Customer"}</small>
                  </div>
                  <Link to={dashboardPath} className={styles.menuItem} role="menuitem">
                    Dashboard
                  </Link>
                  {!isAdmin && (
                    <Link to="/dashboard/user/orders" className={styles.menuItem} role="menuitem">
                      My orders
                    </Link>
                  )}
                  <button className={`${styles.menuItem} ${styles.menuDanger}`} onClick={handleLogout} role="menuitem">
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className={styles.signIn}>
              Sign in
            </Link>
          )}

          <button
            className={styles.burger}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
}

/**
 * Backwards-compatible default export.
 * Legacy pages still render <Nav /> themselves; inside a layout that already
 * provides the navigation this renders nothing, so it never appears twice.
 * (Remove this wrapper and the per-page <Nav /> once every page is migrated.)
 */
export default function Nav() {
  const { shell } = useContext(LayoutContext);
  return shell ? null : <NavBar />;
}
