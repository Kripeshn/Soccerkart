import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo2.png";
import fb from "../../../assets/fb.svg";
import insta from "../../../assets/insta.svg";
import x from "../../../assets/twitter.svg";
import "./footer.css";

// Add real profile URLs here.
const SOCIALS = [
  { label: "Facebook", icon: fb, href: "#" },
  { label: "X (Twitter)", icon: x, href: "#" },
  { label: "Instagram", icon: insta, href: "#" },
];

const Footers = () => {
  return (
    <footer className="sk-footer">
      <div className="sk-footer-inner">
        <div className="sk-footer-grid">
          <div className="sk-footer-brand">
            <Link to="/" className="sk-footer-logo" aria-label="Soccerkart home">
              <img src={logo} alt="Soccerkart" />
            </Link>
            <p>
              Football boots, jerseys, balls and accessories for players and
              fans across Nepal. Gear up for your next goal.
            </p>
            <div className="sk-footer-social">
              {SOCIALS.map(({ label, icon, href }) => (
                <a key={label} href={href} aria-label={label} rel="noreferrer">
                  <img src={icon} alt="" />
                </a>
              ))}
            </div>
          </div>

          <div className="sk-footer-col">
            <h2>Shop</h2>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">All products</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
          </div>

          <div className="sk-footer-col">
            <h2>Company</h2>
            <ul>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/login">Sign in</Link></li>
              <li><Link to="/signup">Create account</Link></li>
            </ul>
          </div>

          <div className="sk-footer-col">
            <h2>Get in touch</h2>
            <ul>
              <li><a href="tel:+9779876543210">+977-9876543210</a></li>
              <li><a href="mailto:contact@sokkerkart.com">contact@sokkerkart.com</a></li>
              <li>Pokhara, Nepal</li>
            </ul>
          </div>
        </div>

        <div className="sk-footer-bottom">
          <p>&copy; {new Date().getFullYear()} Soccerkart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footers;
