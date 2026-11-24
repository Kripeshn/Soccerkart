import React from "react";
import { Link, Outlet } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../assets/logo1.png";
import "./AuthLayout.css";

export default function AuthLayout() {
  return (
    <div className="sk-auth">
      <header className="sk-auth-top">
        <Link to="/" className="sk-auth-brand" aria-label="Soccerkart home">
          <img src={logo} alt="Soccerkart" />
        </Link>
        <Link to="/" className="sk-auth-back">
          <FaArrowLeft aria-hidden="true" /> Back to store
        </Link>
      </header>
      <main className="sk-auth-main">
        <Outlet />
      </main>
    </div>
  );
}
