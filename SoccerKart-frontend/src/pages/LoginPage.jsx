import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";
import AuthCard, { PasswordInput } from "../Components/Form/AuthCard";
import { useAuth } from "../context/auth";
import { APIUrl } from "../../utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(`${APIUrl}/login`, { email, password });

      if (result.status === 200 && result.data.token) {
        localStorage.setItem("authToken", result.data.token);
        localStorage.setItem("auth", JSON.stringify(result.data));
        setAuth({ ...auth, user: result.data.user, token: result.data.token });
        toastr.success(`Login successful, welcome ${result.data.user.name}.`);
        navigate(typeof location.state === "string" ? location.state : "/");
      } else if (result.data === "The password is incorrect") {
        toastr.error("Your password is incorrect. Please try again.");
      } else {
        toastr.error("Login failed. Please try again.");
      }
    } catch (err) {
      console.log(err);
      const body = err.response?.data;
      toastr.error(
        (typeof body === "string" && body) || body?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to your account"
      footer={
        <>
          Don&apos;t have an account? <NavLink to="/signup">Sign up</NavLink>
        </>
      }
    >
      <form className="au-form" onSubmit={handleSubmit}>
        <div className="au-field">
          <label className="sk-label" htmlFor="email">Email</label>
          <input
            id="email"
            className="sk-input"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="au-field">
          <label className="sk-label" htmlFor="password">Password</label>
          <PasswordInput
            id="password"
            placeholder="Your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="au-links">
          <NavLink className="au-link" to="/forgot-password">Forgot your password?</NavLink>
        </div>

        <button type="submit" className="sk-btn sk-btn--primary au-submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthCard>
  );
}
