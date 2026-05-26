import React from "react";
import Nav from "../Components/Layout/Nav";

export default function About() {
  return (
    <div style={{ padding: "20px" }}>
      <Nav />

      <h1>About Us</h1>
      <p>
        SoccerKart is a modern e-commerce platform dedicated to providing high-quality football gear and accessories.
        We aim to make sports shopping easy, fast, and secure for all football enthusiasts.
      </p>

      <h2 style={{ marginTop: "30px" }}>What We Provide</h2>

      <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
        
        <div style={boxStyle}>
          <h3>⚽ Quality Products</h3>
          <p>Premium football gear including shoes, jerseys, and accessories.</p>
        </div>

        <div style={boxStyle}>
          <h3>🛒 Easy Shopping</h3>
          <p>Simple and smooth shopping experience with intuitive UI.</p>
        </div>

        <div style={boxStyle}>
          <h3>🔒 Secure Orders</h3>
          <p>Safe checkout process with secure authentication and payments.</p>
        </div>

      </div>
    </div>
  );
}

const boxStyle = {
  flex: 1,
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};