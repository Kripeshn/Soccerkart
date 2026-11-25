import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";
import { FaMoneyBillWave, FaLock } from "react-icons/fa";
import { useCart } from "../../context/cart";
import { useAuth } from "../../context/auth";
import { APIUrl } from "../../../utils";
import "../Cart/Cart.css";
import "./Checkout.css";

const DELIVERY_FEE = 100; // display only; the server calculates the real total
const money = (n) => `Rs. ${Number(n).toLocaleString("en-IN")}`;
const PHONE = /^\+?[0-9][0-9\s-]{6,18}$/;

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const user = auth?.user || {};

  const [form, setForm] = useState({
    fullName: user.name || "",
    phone: user.phone || "",
    address: user.address || "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const lines = useMemo(() => {
    const map = new Map();
    cart.forEach((item) => {
      const line = map.get(item._id);
      if (line) line.quantity += 1;
      else map.set(item._id, { ...item, quantity: 1 });
    });
    return [...map.values()];
  }, [cart]);

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal + (subtotal > 0 ? DELIVERY_FEE : 0);

  if (lines.length === 0 && !submitting) {
    return (
      <section className="ct">
        <div className="sk-card ct-empty">
          <h1>Nothing to check out</h1>
          <p>Your cart is empty.</p>
          <Link to="/products" className="sk-btn sk-btn--primary">Start shopping</Link>
        </div>
      </section>
    );
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) return toastr.error("Please enter your full name");
    if (!PHONE.test(form.phone.trim())) return toastr.error("Please enter a valid phone number");
    if (!form.address.trim()) return toastr.error("Please enter your delivery address");

    setSubmitting(true);
    try {
      const { data } = await axios.post(
        `${APIUrl}/api/v1/order/create`,
        {
          items: lines.map((l) => ({ productId: l._id, quantity: l.quantity })),
          shippingAddress: form,
          paymentMethod: "cod",
        },
        { headers: { Authorization: localStorage.getItem("authToken") } }
      );
      if (data?.success) {
        setCart([]);
        localStorage.removeItem("cart");
        toastr.success("Order placed successfully");
        navigate("/dashboard/user/orders");
      } else {
        toastr.error(data?.message || "Could not place the order");
        setSubmitting(false);
      }
    } catch (error) {
      console.log(error);
      toastr.error(error.response?.data?.message || "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <section className="ct">
      <div className="ct-head">
        <h1>Checkout</h1>
        <p>Almost there. Tell us where to deliver.</p>
      </div>

      <form className="ct-layout" onSubmit={placeOrder} noValidate>
        <div className="ck-main">
          <section className="sk-card ck-card">
            <h2>Delivery details</h2>
            <div className="ck-grid">
              <div>
                <label className="sk-label" htmlFor="ck-name">Full name</label>
                <input id="ck-name" className="sk-input" value={form.fullName} onChange={set("fullName")} autoComplete="name" />
              </div>
              <div>
                <label className="sk-label" htmlFor="ck-phone">Phone</label>
                <input id="ck-phone" className="sk-input" value={form.phone} onChange={set("phone")} autoComplete="tel" inputMode="tel" />
              </div>
              <div className="ck-full">
                <label className="sk-label" htmlFor="ck-address">Delivery address</label>
                <input id="ck-address" className="sk-input" value={form.address} onChange={set("address")} autoComplete="street-address" maxLength={200} />
              </div>
              <div className="ck-full">
                <label className="sk-label" htmlFor="ck-note">Note for the courier (optional)</label>
                <textarea id="ck-note" className="sk-input" rows={3} value={form.note} onChange={set("note")} maxLength={300} />
              </div>
            </div>
          </section>

          <section className="sk-card ck-card">
            <h2>Payment</h2>
            <div className="ck-pay">
              <span className="ck-pay-icon"><FaMoneyBillWave aria-hidden="true" /></span>
              <div>
                <strong>Cash on delivery</strong>
                <small>Pay when your order arrives.</small>
              </div>
            </div>
          </section>
        </div>

        <aside className="sk-card ct-summary">
          <h2>Order summary</h2>
          <ul className="ck-items">
            {lines.map((l) => (
              <li key={l._id}>
                <span>{l.name} <em>× {l.quantity}</em></span>
                <span>{money(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="ct-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="ct-row"><span>Delivery fee</span><span>{money(DELIVERY_FEE)}</span></div>
          <div className="ct-row ct-total"><span>Total</span><span>{money(total)}</span></div>
          <button type="submit" className="sk-btn sk-btn--primary ct-checkout" disabled={submitting}>
            <FaLock aria-hidden="true" /> {submitting ? "Placing order..." : "Place order"}
          </button>
          <Link to="/cart" className="ct-continue">Back to cart</Link>
        </aside>
      </form>
    </section>
  );
};

export default Checkout;
