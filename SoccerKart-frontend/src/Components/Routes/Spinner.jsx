import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Spinner.css";

/** Quiet loader shown while a route guard is checking access (no redirect). */
export const PageLoader = ({ label = "Loading..." }) => (
  <div className="sp-wrap" role="status" aria-live="polite">
    <span className="sp-ring" aria-hidden="true" />
    <p>{label}</p>
  </div>
);

/**
 * Redirect screen. Counts down 3 seconds, then navigates to `path`
 * (default: login), remembering where the user came from.
 */
const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();
  const target = path.startsWith("/") ? path : `/${path}`;

  useEffect(() => {
    if (count === 0) {
      navigate(target, { state: location.pathname, replace: true });
      return undefined;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, navigate, target, location.pathname]);

  return (
    <div className="sp-wrap" role="status" aria-live="polite">
      <span className="sp-ring" aria-hidden="true" />
      <h1>Redirecting you in {count} second{count === 1 ? "" : "s"}</h1>
      <p>You need to sign in with the right account to view this page.</p>
    </div>
  );
};

export default Spinner;
