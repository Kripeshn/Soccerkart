import React, { useState } from "react";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import "./AuthCard.css";

// one place for toast settings used by the three auth pages
toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: "toast-top-right",
};

const PERKS = [
  "Boots, kits, balls and accessories in one place",
  "Your cart and account, saved when you sign in",
  "Simple, fast shopping from any device",
];

/** Password field with a show / hide toggle. */
export function PasswordInput({ id, value, onChange, placeholder, autoComplete, minLength }) {
  const [show, setShow] = useState(false);
  return (
    <div className="au-pass">
      <input
        id={id}
        className="sk-input"
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        required
      />
      <button
        type="button"
        className="au-eye"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
      </button>
    </div>
  );
}

/** Split card used by Login, Signup and Forgot password. */
export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="au">
      <aside className="au-side">
        <h2>
          Gear up for your <span>next goal.</span>
        </h2>
        <ul>
          {PERKS.map((perk) => (
            <li key={perk}>
              <span className="au-tick"><FaCheck aria-hidden="true" /></span>
              {perk}
            </li>
          ))}
        </ul>
      </aside>

      <section className="au-card">
        <h1>{title}</h1>
        <p className="au-sub">{subtitle}</p>
        {children}
        {footer && <div className="au-foot">{footer}</div>}
      </section>
    </div>
  );
}
