import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";
import { FaPlus } from "react-icons/fa";
import { APIUrl } from "../../../utils";
import "./AllProducts.css";

function stockBadge(qty) {
  if (!qty || qty <= 0) return <span className="sk-badge sk-badge--danger">Out of stock</span>;
  if (qty <= 5) return <span className="sk-badge sk-badge--warning">Low stock · {qty}</span>;
  return <span className="sk-badge sk-badge--success">In stock · {qty}</span>;
}

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${APIUrl}/api/v1/product/get-product`, {
          headers: { Authorization: localStorage.getItem("authToken") },
        });
        setProducts(data.products || []);
      } catch (error) {
        console.log(error);
        toastr.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products;
  }, [products, query]);

  return (
    <div className="ad-page">
      <div className="ad-head">
        <div>
          <h2>Products</h2>
          <p>{loading ? "Loading..." : `${products.length} product${products.length === 1 ? "" : "s"} in your store`}</p>
        </div>
        <div className="ap-tools">
          <input
            type="search"
            className="sk-input"
            placeholder="Search products"
            aria-label="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Link to="/dashboard/admin/create-product" className="sk-btn sk-btn--primary">
            <FaPlus aria-hidden="true" /> Add product
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="ap-grid">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="ad-card ap-card">
              <div className="ap-img ad-skeleton" style={{ borderRadius: 0 }} />
              <div className="ap-body" style={{ display: "grid", gap: 10 }}>
                <div className="ad-skeleton" style={{ width: "70%" }} />
                <div className="ad-skeleton" style={{ width: "40%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="ad-card ad-empty">
          <strong>{query ? "No matching products" : "No products yet"}</strong>
          {query ? "Try a different search." : "Add your first product to start selling."}
        </div>
      ) : (
        <div className="ap-grid">
          {filtered.map((p) => (
            <Link key={p._id} to={`/dashboard/admin/product/${p.slug}`} className="ad-card ap-card">
              <div className="ap-img">
                <img
                  src={`${APIUrl}/api/v1/product/product-photo/${p._id}`}
                  alt={p.name}
                  loading="lazy"
                />
              </div>
              <div className="ap-body">
                {p.category?.name && <span className="ap-cat">{p.category.name}</span>}
                <h3 className="ap-name">{p.name}</h3>
                <p className="ap-desc">{p.description}</p>
                <div className="ap-foot">
                  <strong>Rs. {p.price}</strong>
                  {stockBadge(p.quantity)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
