import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import banner from "../../assets/banner.png";
import "./header.css";

const CATEGORIES = ["Boots", "Jerseys", "Balls", "Accessories"];

const Hero = () => {
  const navigate = useNavigate();

  const goShop = () => {
    const el = document.getElementById("our-products");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else navigate("/products");
  };

  return (
    <section className="sk-hero" style={{ backgroundImage: `url(${banner})` }}>
      <div className="sk-hero-overlay" aria-hidden="true" />

      <div className="sk-hero-content">
        <p className="sk-hero-eyebrow sk-hero-anim sk-hero-anim--1">
          <span className="sk-hero-dot" /> New season gear in stock
        </p>

        <h1 className="sk-hero-title sk-hero-anim sk-hero-anim--2">
          Gear up for your <span>next goal.</span>
        </h1>

        <p className="sk-hero-text sk-hero-anim sk-hero-anim--3">
          High-performance boots, durable balls and stylish kits &mdash;
          everything you need to play harder, move faster and look sharper.
        </p>

        <div className="sk-hero-actions sk-hero-anim sk-hero-anim--4">
          <button className="sk-btn sk-btn--primary" onClick={goShop}>
            Shop now <FaArrowRight aria-hidden="true" />
          </button>
          <Link to="/about" className="sk-btn sk-hero-ghost">
            Our story
          </Link>
        </div>

        <ul className="sk-hero-chips sk-hero-anim sk-hero-anim--5" aria-label="Popular categories">
          {CATEGORIES.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Hero;
