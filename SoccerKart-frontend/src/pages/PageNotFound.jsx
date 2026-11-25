import React from "react";
import { Link } from "react-router-dom";
import "./PageNotFound.css";

export default function PageNotFound() {
  return (
    <section className="nf">
      <p className="nf-code" aria-hidden="true">404</p>
      <h1>Page not found</h1>
      <p className="nf-text">
        The page you are looking for does not exist or has moved.
      </p>
      <div className="nf-actions">
        <Link to="/" className="sk-btn sk-btn--primary">Back to home</Link>
        <Link to="/products" className="sk-btn sk-btn--ghost">Browse products</Link>
      </div>
    </section>
  );
}
