import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";
import { FaBoxOpen } from "react-icons/fa";
import UserMenu from "../../Components/Layout/UserMenu";
import Modal from "../../Components/UI/Modal";
import { APIUrl } from "../../../utils";
import "./user.css";

const money = (n) => `Rs. ${Number(n).toLocaleString("en-IN")}`;
const date = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const BADGE = {
  Pending: "sk-badge--warning",
  Processing: "sk-badge--brand",
  Shipped: "sk-badge--brand",
  Delivered: "sk-badge--success",
  Cancelled: "sk-badge--danger",
};
const headers = () => ({ Authorization: localStorage.getItem("authToken") });

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [toCancel, setToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await axios.get(`${APIUrl}/api/v1/order/my-orders`, { headers: headers() });
      setOrders(data?.orders || []);
      setFailed(false);
    } catch (error) {
      console.log(error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const confirmCancel = async () => {
    setCancelling(true);
    try {
      await axios.put(`${APIUrl}/api/v1/order/cancel/${toCancel._id}`, {}, { headers: headers() });
      toastr.success("Order cancelled");
      setToCancel(null);
      await load();
    } catch (error) {
      toastr.error(error.response?.data?.message || "Could not cancel the order");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="ud">
      <UserMenu />
      <div className="ud-main">
        <div className="ud-head">
          <h1>Your orders</h1>
          <p>Everything you have bought from Soccerkart.</p>
        </div>

        {loading ? (
          <div className="sk-card" style={{ padding: 24, display: "grid", gap: 14 }}>
            {[80, 60, 70].map((w, i) => <div key={i} className="ad-skeleton" style={{ width: `${w}%`, height: 18 }} />)}
          </div>
        ) : failed ? (
          <section className="sk-card ud-empty">
            <h2>We couldn&apos;t load your orders</h2>
            <p>Please check your connection and try again.</p>
            <button className="sk-btn sk-btn--primary" onClick={() => { setLoading(true); load(); }}>Retry</button>
          </section>
        ) : orders.length === 0 ? (
          <section className="sk-card ud-empty">
            <span className="ud-empty-icon"><FaBoxOpen aria-hidden="true" /></span>
            <h2>No orders yet</h2>
            <p>When you place an order it will show up here.</p>
            <Link to="/products" className="sk-btn sk-btn--primary">Start shopping</Link>
          </section>
        ) : (
          orders.map((o) => (
            <article key={o._id} className="sk-card uo">
              <header className="uo-head">
                <div>
                  <strong>Order #{o._id.slice(-6).toUpperCase()}</strong>
                  <small>Placed {date(o.createdAt)}</small>
                </div>
                <span className={`sk-badge ${BADGE[o.status] || ""}`}>{o.status}</span>
              </header>

              <ul className="uo-items">
                {o.items.map((it) => (
                  <li key={it.product}>
                    <img src={`${APIUrl}/api/v1/product/product-photo/${it.product}`} alt="" />
                    <Link to={`/product/${it.slug}`}>{it.name}</Link>
                    <span>× {it.quantity}</span>
                    <span>{money(it.price * it.quantity)}</span>
                  </li>
                ))}
              </ul>

              <footer className="uo-foot">
                <div className="uo-ship">
                  <small>Deliver to</small>
                  <span>{o.shippingAddress.fullName}, {o.shippingAddress.address}</span>
                  <small>Cash on delivery</small>
                </div>
                <div className="uo-total">
                  <small>Total incl. delivery</small>
                  <strong>{money(o.total)}</strong>
                  {o.status === "Pending" && (
                    <button className="sk-btn sk-btn--danger" onClick={() => setToCancel(o)}>Cancel order</button>
                  )}
                </div>
              </footer>
            </article>
          ))
        )}
      </div>

      <Modal open={!!toCancel} onClose={() => setToCancel(null)} title="Cancel this order?">
        <p style={{ margin: 0, color: "var(--text-2)", lineHeight: 1.6 }}>
          Order <strong style={{ color: "var(--ink)" }}>#{toCancel?._id.slice(-6).toUpperCase()}</strong> will be cancelled and the items returned to stock.
        </p>
        <div className="sk-modal-actions">
          <button className="sk-btn sk-btn--ghost" onClick={() => setToCancel(null)}>Keep order</button>
          <button className="sk-btn sk-btn--danger" onClick={confirmCancel} disabled={cancelling}>
            {cancelling ? "Cancelling..." : "Cancel order"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Orders;
