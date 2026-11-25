import React from "react";
import { NavLink } from "react-router-dom";
import { FaThLarge, FaUser, FaBoxOpen } from "react-icons/fa";
import "./UserMenu.css";

const ITEMS = [
  { to: "/dashboard/user", label: "Overview", icon: FaThLarge, end: true },
  { to: "/dashboard/user/profile", label: "Profile", icon: FaUser },
  { to: "/dashboard/user/orders", label: "Orders", icon: FaBoxOpen },
];

const UserMenu = () => (
  <nav className="um sk-card" aria-label="Account">
    {ITEMS.map(({ to, label, icon: Icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) => `um-link ${isActive ? "is-active" : ""}`}
      >
        <Icon aria-hidden="true" />
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
);

export default UserMenu;
