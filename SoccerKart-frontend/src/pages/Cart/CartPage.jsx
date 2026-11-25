import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import toastr from "toastr";
import { FaMinus, FaPlus, FaTrash, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../../context/cart";
import { APIUrl } from "../../../utils";
import "./Cart.css";

const DELIVERY_FEE = 100;
const money = (n) => `Rs. ${Number(n).toLocaleString("en-IN")}`;

const Cart = () => {
  const [cart, setCart] = useCart();

  const persist = (next) => {
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  // the cart is a flat array; group duplicates into lines with a quantity
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
  const delivery = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;

  const increase = (line) => persist([...cart, cart.find((i) => i._id === line._id)]);

  const decrease = (id) => {
    const index = cart.findIndex((i) => i._id === id);
    if (index === -1) return;
    const next = [...cart];
    next.splice(index, 1);
    persist(next);
  };

  const removeLine = (id) => persist(cart.filter((i) => i._id !== id));

  if (lines.length === 0) {
    return (
      <section className="ct">
        <div className="sk-card ct-empty">
          <span className="ct-empty-icon"><FaShoppingBag aria-hidden="true" /></span>
          <h1>Your cart is empty</h1>
          <p>Looks like you haven&apos;t added anything yet.</p>
          <Link to="/products" className="sk-btn sk-btn--primary">Start shopping</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="ct">
      <div className="ct-head">
        <h1>Your cart</h1>
        <p>{cart.length} item{cart.length === 1 ? "" : "s"}</p>
      </div>

      <div className="ct-layout">
        <ul className="ct-list">
          {lines.map((line) => (
            <li key={line._id} className="sk-card ct-item">
              <Link to={`/product/${line.slug}`} className="ct-thumb">
                <img src={`${APIUrl}/api/v1/product/product-photo/${line._id}`} alt={line.name} />
              </Link>

              <div className="ct-main">
                <Link to={`/product/${line.slug}`} className="ct-name">{line.name}</Link>
                <span className="ct-unit">{money(line.price)} each</span>

                <div className="ct-qty" role="group" aria-label={`Quantity of ${line.name}`}>
                  <button type="button" onClick={() => decrease(line._id)} aria-label="Decrease quantity">
                    <FaMinus aria-hidden="true" />
                  </button>
                  <span>{line.quantity}</span>
                  <button type="button" onClick={() => increase(line)} aria-label="Increase quantity">
                    <FaPlus aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="ct-side">
                <strong>{money(line.price * line.quantity)}</strong>
                <button type="button" className="ct-remove" onClick={() => removeLine(line._id)} aria-label={`Remove ${line.name}`}>
                  <FaTrash aria-hidden="true" /> Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="sk-card ct-summary">
          <h2>Order summary</h2>
          <div className="ct-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="ct-row"><span>Delivery fee</span><span>{money(delivery)}</span></div>
          <div className="ct-row ct-total"><span>Total</span><span>{money(total)}</span></div>
          <button
            type="button"
            className="sk-btn sk-btn--primary ct-checkout"
            onClick={() => toastr.info("Checkout is not available yet.")}
          >
            Proceed to checkout
          </button>
          <Link to="/products" className="ct-continue">Continue shopping</Link>
        </aside>
      </div>
    </section>
  );
};

export default Cart;
