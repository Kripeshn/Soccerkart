import React, { useEffect, useState } from "react";
import axios from "axios";
import toastr from "toastr";
import { FaFilter } from "react-icons/fa";
import { Prices } from "../Prices";
import ProductCard from "./ProductCard";
import { APIUrl } from "../../../utils";
import "./Catalog.css";

/**
 * Product listing with category + price filters and "load more".
 * Replaces the logic that was duplicated in Home/Index.jsx and Products.jsx
 * (and fixes the crash from the commented-out handleFilter in Index).
 */
export default function Catalog({ id, title = "Our products" }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [priceId, setPriceId] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtering = checked.length > 0 || priceId !== null;
  const activeCount = checked.length + (priceId !== null ? 1 : 0);

  // categories + total count (once)
  useEffect(() => {
    (async () => {
      try {
        const [cat, count] = await Promise.all([
          axios.get(`${APIUrl}/api/v1/category/get-category`),
          axios.get(`${APIUrl}/api/v1/product/product-count`),
        ]);
        if (cat.data?.success) setCategories(cat.data.category);
        setTotal(count.data?.total || 0);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // first page, or filtered results, whenever the filters change
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        if (filtering) {
          const radio = priceId === null ? [] : Prices.find((p) => p._id === priceId).array;
          const { data } = await axios.post(`${APIUrl}/api/v1/product/product-filters`, {
            checked,
            radio,
          });
          if (alive) setProducts(data?.products || []);
        } else {
          const { data } = await axios.get(`${APIUrl}/api/v1/product/product-list/1`);
          if (alive) {
            setProducts(data?.products || []);
            setPage(1);
          }
        }
      } catch (error) {
        console.log(error);
        if (alive) toastr.error("Could not load products");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [checked, priceId]);

  const loadMore = async () => {
    const next = page + 1;
    setLoadingMore(true);
    try {
      const { data } = await axios.get(`${APIUrl}/api/v1/product/product-list/${next}`);
      setProducts((prev) => [...prev, ...(data?.products || [])]);
      setPage(next);
    } catch (error) {
      console.log(error);
      toastr.error("Could not load more products");
    } finally {
      setLoadingMore(false);
    }
  };

  const toggleCategory = (cid) =>
    setChecked((prev) => (prev.includes(cid) ? prev.filter((x) => x !== cid) : [...prev, cid]));

  const reset = () => {
    setChecked([]);
    setPriceId(null);
  };

  return (
    <section className="cg" id={id}>
      <div className="cg-head">
        <div>
          <h2>{title}</h2>
          {!loading && (
            <p className="cg-sub">
              {products.length} product{products.length === 1 ? "" : "s"}
              {!filtering && total > products.length ? ` of ${total}` : ""}
            </p>
          )}
        </div>
        <button
          type="button"
          className="sk-btn sk-btn--ghost sk-btn--sm cg-toggle"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
        >
          <FaFilter aria-hidden="true" /> Filters{activeCount ? ` (${activeCount})` : ""}
        </button>
      </div>

      <div className="cg-layout">
        <aside className={`cg-filters sk-card ${filtersOpen ? "open" : ""}`} aria-label="Filters">
          <div className="cg-group">
            <h3>Category</h3>
            {categories.length === 0 && <p className="cg-none">No categories yet</p>}
            {categories.map((c) => (
              <label key={c._id} className="cg-check">
                <input
                  type="checkbox"
                  checked={checked.includes(c._id)}
                  onChange={() => toggleCategory(c._id)}
                />
                <span className="cg-box" />
                <span className="cg-label">{c.name}</span>
              </label>
            ))}
          </div>

          <div className="cg-group">
            <h3>Price</h3>
            {Prices.map((p) => (
              <label key={p._id} className="cg-check cg-radio">
                <input
                  type="radio"
                  name="price"
                  checked={priceId === p._id}
                  onChange={() => setPriceId(p._id)}
                />
                <span className="cg-box" />
                <span className="cg-label">{p.name}</span>
              </label>
            ))}
          </div>

          <button
            type="button"
            className="sk-btn sk-btn--ghost cg-reset"
            onClick={reset}
            disabled={!filtering}
          >
            Reset filters
          </button>
        </aside>

        <div>
          {loading ? (
            <div className="cg-grid">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="sk-card cg-skel">
                  <div className="cg-skel-img" />
                  <div className="cg-skel-line" style={{ width: "70%" }} />
                  <div className="cg-skel-line" style={{ width: "40%" }} />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="sk-card cg-empty">
              <strong>No products found</strong>
              <p>{filtering ? "Nothing matches these filters." : "Check back soon for new gear."}</p>
              {filtering && (
                <button className="sk-btn sk-btn--primary" onClick={reset}>
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="cg-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {!loading && !filtering && products.length < total && (
            <div className="cg-more">
              <button className="sk-btn sk-btn--dark" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
