import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaBoxOpen, FaTags, FaPlus, FaUsers, FaArrowRight } from "react-icons/fa";
import { useAuth } from "../../context/auth";
import { APIUrl } from "../../../utils";

const ACTIONS = [
  { to: "/dashboard/admin/create-product", icon: FaPlus, title: "Add a product", note: "List new gear in the store" },
  { to: "/dashboard/admin/allproducts", icon: FaBoxOpen, title: "Manage products", note: "Edit prices, stock and photos" },
  { to: "/dashboard/admin/create-category", icon: FaTags, title: "Manage categories", note: "Organise the catalogue" },
  { to: "/dashboard/admin/manage-user", icon: FaUsers, title: "View users", note: "See registered customers" },
];

const Admin = () => {
  const [auth] = useAuth();
  const [stats, setStats] = useState({ products: null, categories: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      const [p, c] = await Promise.allSettled([
        axios.get(`${APIUrl}/api/v1/product/product-count`),
        axios.get(`${APIUrl}/api/v1/category/get-category`),
      ]);
      if (!alive) return;
      setStats({
        products: p.status === "fulfilled" ? p.value.data?.total ?? 0 : "–",
        categories: c.status === "fulfilled" ? c.value.data?.category?.length ?? 0 : "–",
      });
    })();
    return () => {
      alive = false;
    };
  }, []);

  const firstName = (auth?.user?.name || "Admin").split(" ")[0];

  return (
    <div className="ad-page">
      <div className="ad-head">
        <div>
          <h2>Welcome back, {firstName}</h2>
          <p>Here is a quick look at your store.</p>
        </div>
        <Link to="/dashboard/admin/create-product" className="sk-btn sk-btn--primary">
          <FaPlus aria-hidden="true" /> Add product
        </Link>
      </div>

      <div className="ad-stats">
        <div className="ad-card ad-stat">
          <span className="ad-stat-icon"><FaBoxOpen aria-hidden="true" /></span>
          <div>
            <strong>{stats.products ?? "…"}</strong>
            <span>Products</span>
          </div>
        </div>
        <div className="ad-card ad-stat">
          <span className="ad-stat-icon ad-stat-icon--blue"><FaTags aria-hidden="true" /></span>
          <div>
            <strong>{stats.categories ?? "…"}</strong>
            <span>Categories</span>
          </div>
        </div>
        <div className="ad-card ad-stat">
          <span className="ad-stat-icon ad-stat-icon--green"><FaUsers aria-hidden="true" /></span>
          <div>
            <strong style={{ fontSize: 17, wordBreak: "break-all" }}>{auth?.user?.email || "–"}</strong>
            <span>Signed in as admin</span>
          </div>
        </div>
      </div>

      <h3 className="ad-card-title" style={{ marginBottom: 14 }}>Quick actions</h3>
      <div className="ad-actions">
        {ACTIONS.map(({ to, icon: Icon, title, note }) => (
          <Link key={to} to={to} className="ad-card ad-action">
            <span className="ad-action-icon"><Icon aria-hidden="true" /></span>
            <div style={{ flex: 1 }}>
              <strong>{title}</strong>
              <small>{note}</small>
            </div>
            <FaArrowRight aria-hidden="true" style={{ color: "var(--text-3)", fontSize: 13 }} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Admin;
