import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBoxOpen, FaStore } from "react-icons/fa";
import UserMenu from "../../Components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import "./user.css";

const Dashboard = () => {
  const [auth] = useAuth();
  const [cart] = useCart();
  const name = auth?.user?.name || "there";
  const items = cart?.length || 0;

  return (
    <div className="ud">
      <UserMenu />
      <div className="ud-main">
        <div className="ud-head">
          <h1>Hi, {name.split(" ")[0]}</h1>
          <p>Manage your account and keep track of your shopping.</p>
        </div>

        <section className="sk-card ud-profile">
          <span className="ud-avatar" aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
          <div>
            <strong>{auth?.user?.name}</strong>
            <span>{auth?.user?.email}</span>
          </div>
        </section>

        <div className="ud-tiles">
          <Link to="/cart" className="sk-card ud-tile">
            <span className="ud-tile-icon"><FaShoppingCart aria-hidden="true" /></span>
            <div>
              <strong>Your cart</strong>
              <small>{items} item{items === 1 ? "" : "s"} waiting</small>
            </div>
          </Link>
          <Link to="/dashboard/user/orders" className="sk-card ud-tile">
            <span className="ud-tile-icon"><FaBoxOpen aria-hidden="true" /></span>
            <div>
              <strong>Your orders</strong>
              <small>Track past purchases</small>
            </div>
          </Link>
          <Link to="/products" className="sk-card ud-tile">
            <span className="ud-tile-icon"><FaStore aria-hidden="true" /></span>
            <div>
              <strong>Keep shopping</strong>
              <small>Browse all products</small>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
