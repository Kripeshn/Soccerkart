import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import useAddToCart from "./useAddToCart";
import { APIUrl } from "../../../utils";
import "./ProductCard.css";

/** Shared product tile (home, products, search). */
const ProductCard = ({ product: p }) => {
  const addToCart = useAddToCart();
  const soldOut = typeof p.quantity === "number" && p.quantity <= 0;
  const link = `/product/${p.slug}`;

  return (
    <article className="pc sk-card">
      <div className="pc-media">
        <Link to={link} className="pc-img" tabIndex={-1} aria-hidden="true">
          <img
            src={`${APIUrl}/api/v1/product/product-photo/${p._id}`}
            alt=""
            loading="lazy"
          />
        </Link>
        {soldOut && <span className="pc-tag">Sold out</span>}
        <button
          type="button"
          className="pc-add"
          onClick={() => addToCart(p)}
          disabled={soldOut}
          aria-label={`Add ${p.name} to cart`}
        >
          <FaShoppingCart aria-hidden="true" />
        </button>
      </div>

      <div className="pc-body">
        <h3 className="pc-name">
          <Link to={link}>{p.name}</Link>
        </h3>
        <p className="pc-desc">{p.description}</p>
        <div className="pc-price">
          <strong>Rs. {p.price}</strong>
          <span className="pc-old">Rs. {p.price + (50 / 100) * p.price}</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
