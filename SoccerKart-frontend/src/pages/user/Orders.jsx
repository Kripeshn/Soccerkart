import React from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen } from "react-icons/fa";
import UserMenu from "../../Components/Layout/UserMenu";
import "./user.css";

/** Empty state until the backend exposes an orders endpoint for the signed-in user. */
const Orders = () => (
  <div className="ud">
    <UserMenu />
    <div className="ud-main">
      <div className="ud-head">
        <h1>Your orders</h1>
        <p>Everything you have bought from Soccerkart.</p>
      </div>

      <section className="sk-card ud-empty">
        <span className="ud-empty-icon"><FaBoxOpen aria-hidden="true" /></span>
        <h2>No orders yet</h2>
        <p>When you place an order it will show up here.</p>
        <Link to="/products" className="sk-btn sk-btn--primary">Start shopping</Link>
      </section>
    </div>
  </div>
);

export default Orders;
