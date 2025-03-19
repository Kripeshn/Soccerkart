import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Nav.module.css";
import { useAuth } from "../../context/auth";
import toastr from "toastr";
import logo from "../../assets/logo1.png";
import cartimg from "../../assets/cart.svg";
import search from "../../assets/search.svg";
import { useCart } from "../../context/cart";
import { FaChevronDown } from "react-icons/fa"; // Import dropdown icon
import SearchInput from "../Form/SearchInput";
import profile from "../../assets/profile.svg";
export default function Nav() {
  const [cart] = useCart();
  const [auth, setAuth] = useAuth();
  const [menu, setMenu] = useState("");

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    window.location.reload();
    localStorage.removeItem("auth");
    localStorage.removeItem("cart");
    toastr.success("Logged Out Successfully.");
  };
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_container}>
        <img className={styles.head} src={logo} alt="" />
        <ul className={styles.nav_menu}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? styles.active : styles.navlink
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/product"
              className={({ isActive }) =>
                isActive ? styles.active : styles.navlink
              }
            >
              Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? styles.active : styles.navlink
              }
            >
              About Us
            </NavLink>
          </li>
        </ul>
        <div className={styles.navbar_right}>
          <div className="">
            <SearchInput />
          </div>
          {auth.user ? (
            <>
              <NavLink className={styles.cart} to="/cart">
                <img src={cartimg} alt="" />
                <div className={styles.dot}>
                  {cart?.length >= 1 ? cart.length : ""}
                </div>
              </NavLink>
            </>
          ) : (
            <NavLink
              className={styles.cart}
              to="/login"
              onClick={() => {
                toastr.warning("You need to login to view your cart");
              }}
            >
              <img src={cartimg} alt="" />
              <div className={styles.dot}>
                {cart?.length >= 1 ? cart.length : ""}
              </div>
            </NavLink>
          )}

          {!auth.user ? (
            <>
              <li>
                <NavLink className={styles.signup} to="/login">
                  Sign In
                </NavLink>
              </li>
            </>
          ) : (
            <div className="dropdown">
              <NavLink
                className={styles.user}
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img src={profile} alt="" />
              </NavLink>
              <ul className="dropdown-menu mt-2">
                <li>
                  <NavLink
                    to={`/dashboard/${
                      auth?.user?.role === 1 ? "admin" : "user"
                    }`}
                    className="dropdown-item"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    onClick={handleLogout}
                    className="dropdown-item"
                    to="/"
                  >
                    Logout
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
