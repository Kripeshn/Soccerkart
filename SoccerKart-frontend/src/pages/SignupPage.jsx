import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";
import AuthCard, { PasswordInput } from "../Components/Form/AuthCard";
import { APIUrl } from "../../utils";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${APIUrl}/register`, { name, email, password, answer });
      if (response.status === 201) {
        toastr.success("User registered successfully.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toastr.error("An unexpected error occurred.");
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        if (error.response.status === 400) {
          toastr.error("User already exists.");
        } else {
          toastr.error(error.response.data?.message || "Internal server error");
        }
      } else {
        toastr.error("Network error or invalid URL");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join Soccerkart in a minute"
      footer={
        <>
          Already have an account? <NavLink to="/login">Log in</NavLink>
        </>
      }
    >
      <form className="au-form" onSubmit={handleSubmit}>
        <div className="au-field">
          <label className="sk-label" htmlFor="username">Full name</label>
          <input
            id="username"
            className="sk-input"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
            placeholder="Choose a password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="au-field">
          <label className="sk-label" htmlFor="answer">What is your favourite sport?</label>
          <input
            id="answer"
            className="sk-input"
            type="text"
            placeholder="Your answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
          <span className="au-hint">You will need this answer if you ever reset your password.</span>
        </div>

        <button type="submit" className="sk-btn sk-btn--primary au-submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
