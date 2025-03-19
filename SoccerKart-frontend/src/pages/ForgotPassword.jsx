import React, { useState } from "react";
import Nav from "../Components/Layout/Nav";

import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "toastr/build/toastr.min.css";
import toastr from "toastr";

toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: "toast-top-right",
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState(""); // ✅ Renamed to match backend
  const [answer, setAnswer] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/forgot-password", {
        email,
        newPassword,
        answer,
      }) // ✅ Fixed field name
      .then((result) => {
        if (result.status === 200) {
          toastr.success(`Password reset successful. Please log in.`);
          navigate("/login");
        } else {
          toastr.error("Password reset failed. Please try again.");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {/* <Nav className="navbar" /> */}
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Reset Password</h2>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="answer">Reset Question</label>
            <input
              type="text"
              id="answer"
              name="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)} // ✅ Fixed here
              placeholder="Enter your favourite sport"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={newPassword} // ✅ Controlled input
              placeholder="Enter new password"
              onChange={(e) => setNewPassword(e.target.value)} // ✅ Corrected function name
              required
            />
          </div>

          <button type="submit" className="login-button">
            Reset
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
