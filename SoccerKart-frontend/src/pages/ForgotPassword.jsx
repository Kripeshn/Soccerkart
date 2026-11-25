import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";
import AuthCard, { PasswordInput } from "../Components/Form/AuthCard";
import { APIUrl } from "../../utils";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(`${APIUrl}/forgot-password`, { email, newPassword, answer });
      if (result.status === 200) {
        toastr.success("Password reset successful. Please log in.");
        navigate("/login");
      } else {
        toastr.error("Password reset failed. Please try again.");
      }
    } catch (err) {
      console.log(err);
      toastr.error(err.response?.data?.message || "Password reset failed. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset password"
      subtitle="Confirm your email and security answer to set a new password"
      footer={
        <>
          Remembered it? <NavLink to="/login">Back to log in</NavLink>
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
          <label className="sk-label" htmlFor="answer">What is your favourite sport?</label>
          <input
            id="answer"
            className="sk-input"
            type="text"
            placeholder="The answer you gave at signup"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </div>

        <div className="au-field">
          <label className="sk-label" htmlFor="password">New password</label>
          <PasswordInput
            id="password"
            placeholder="Enter a new password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="sk-btn sk-btn--primary au-submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset password"}
        </button>
      </form>
    </AuthCard>
  );
};

export default ForgotPassword;
