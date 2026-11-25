import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FaShoppingCart, FaMinus, FaPlus, FaTruck } from "react-icons/fa";
import useAddToCart from "../Components/Product/useAddToCart";
import { APIUrl } from "../../utils";
import "./productdetails.css";

export default function Product() {
  const params = useParams();
  const addToCart = useAddToCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!params?.slug) return;
    let alive = true;
    setLoading(true);
    setNotFound(false);
    setQty(1);
    (async () => {
      try {
        const { data } = await axios.get(`${APIUrl}/api/v1/product/get-product/${params.slug}`);
        if (!alive) return;
        if (data?.product) setProduct(data.product);
        else setNotFound(true);
      } catch (error) {
        console.log(error);
        if (alive) setNotFound(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="pd pd-loading">
        <div className="pd-skel pd-skel-img" />
        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          <div className="pd-skel" style={{ height: 22, width: "30%" }} />
          <div className="pd-skel" style={{ height: 36, width: "80%" }} />
          <div className="pd-skel" style={{ height: 90 }} />
          <div className="pd-skel" style={{ height: 32, width: "35%" }} />
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="pd-missing sk-card">
        <h1>Product not found</h1>
        <p>It may have been removed or the link is wrong.</p>
        <Link to="/products" className="sk-btn sk-btn--primary">Browse products</Link>
      </div>
    );
  }

  const inStock = product.quantity > 0;
  const maxQty = Math.max(1, Math.min(product.quantity || 1, 10));

  return (
    <div className="pd-page">
      <nav className="pd-crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="pd">
        <div className="pd-media sk-card">
          <img
            src={`${APIUrl}/api/v1/product/product-photo/${product._id}`}
            alt={product.name}
          />
        </div>

        <div className="pd-info">
          {product.category?.name && <span className="pd-cat">{product.category.name}</span>}
          <h1 className="pd-title">{product.name}</h1>

          <div className="pd-price">
            <strong>Rs. {product.price}</strong>
            <span className="pd-old">Rs. {product.price + (50 / 100) * product.price}</span>
          </div>

          <div className="pd-badges">
            {inStock ? (
              <span className="sk-badge sk-badge--success">In stock</span>
            ) : (
              <span className="sk-badge sk-badge--danger">Out of stock</span>
            )}
            {product.shipping ? (
              <span className="sk-badge">
                <FaTruck aria-hidden="true" /> Shipping available
              </span>
            ) : null}
          </div>

          <p className="pd-desc">{product.description}</p>

          <div className="pd-buy">
            <div className="pd-qty" role="group" aria-label="Quantity">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={!inStock || qty <= 1}
                aria-label="Decrease quantity"
              >
                <FaMinus aria-hidden="true" />
              </button>
              <span aria-live="polite">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                disabled={!inStock || qty >= maxQty}
                aria-label="Increase quantity"
              >
                <FaPlus aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              className="sk-btn sk-btn--primary pd-add"
              disabled={!inStock}
              onClick={() => addToCart(product, qty)}
            >
              <FaShoppingCart aria-hidden="true" /> {inStock ? "Add to cart" : "Sold out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
