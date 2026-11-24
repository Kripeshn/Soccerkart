import React from "react";
import { Link } from "react-router-dom";
import { FaFutbol, FaShoppingCart, FaLock } from "react-icons/fa";
import "./About.css";

const FEATURES = [
  {
    icon: FaFutbol,
    title: "Quality products",
    text: "Premium football gear including shoes, jerseys, and accessories.",
  },
  {
    icon: FaShoppingCart,
    title: "Easy shopping",
    text: "Simple and smooth shopping experience with an intuitive interface.",
  },
  {
    icon: FaLock,
    title: "Secure orders",
    text: "Safe checkout process with secure authentication and payments.",
  },
];

export default function About() {
  return (
    <div className="ab">
      <section className="ab-hero">
        <span className="ab-eyebrow">About us</span>
        <h1>
          Football gear, made <span>easy to shop.</span>
        </h1>
        <p>
          SoccerKart is a modern e-commerce platform dedicated to providing
          high-quality football gear and accessories. We aim to make sports
          shopping easy, fast, and secure for all football enthusiasts.
        </p>
        <div className="ab-actions">
          <Link to="/products" className="sk-btn sk-btn--primary">Shop the collection</Link>
          <Link to="/" className="sk-btn sk-btn--ghost">Back to home</Link>
        </div>
      </section>

      <section className="ab-features" aria-labelledby="ab-what">
        <h2 id="ab-what">What we provide</h2>
        <div className="ab-grid">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="sk-card ab-card">
              <span className="ab-icon"><Icon aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}