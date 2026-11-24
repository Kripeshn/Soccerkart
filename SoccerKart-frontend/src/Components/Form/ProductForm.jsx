import React from "react";
import { FaImage } from "react-icons/fa";
import "./ProductForm.css";

/**
 * Shared by Create and Update product.
 * form: { name, description, price, quantity, category, shipping }
 */
const ProductForm = ({
  form,
  setForm,
  categories,
  previewSrc,
  photoName,
  onPhoto,
  onSubmit,
  submitting,
  submitLabel,
  extraActions,
}) => {
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <form className="pf" onSubmit={onSubmit}>
      <div className="pf-grid">
        <section className="ad-card ad-card-pad pf-main">
          <h3 className="ad-card-title">Product details</h3>
          <p className="ad-card-sub">What shoppers will see on the product page.</p>

          <div className="ad-form">
            <div className="ad-field">
              <label className="sk-label" htmlFor="pf-name">Name</label>
              <input
                id="pf-name"
                className="sk-input"
                type="text"
                placeholder="e.g. Nepal home jersey 2026"
                value={form.name}
                onChange={set("name")}
                required
              />
            </div>

            <div className="ad-field">
              <label className="sk-label" htmlFor="pf-desc">Description</label>
              <textarea
                id="pf-desc"
                className="sk-input pf-textarea"
                rows={5}
                placeholder="Material, fit, what is in the box..."
                value={form.description}
                onChange={set("description")}
                required
              />
            </div>

            <div className="pf-row">
              <div className="ad-field">
                <label className="sk-label" htmlFor="pf-price">Price (Rs.)</label>
                <input
                  id="pf-price"
                  className="sk-input"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={form.price}
                  onChange={set("price")}
                  required
                />
              </div>
              <div className="ad-field">
                <label className="sk-label" htmlFor="pf-qty">Quantity in stock</label>
                <input
                  id="pf-qty"
                  className="sk-input"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={form.quantity}
                  onChange={set("quantity")}
                  required
                />
              </div>
            </div>
          </div>
        </section>

        <aside className="pf-side">
          <section className="ad-card ad-card-pad">
            <h3 className="ad-card-title">Photo</h3>
            <label className="pf-drop" htmlFor="pf-photo">
              {previewSrc ? (
                <img src={previewSrc} alt="Product preview" className="pf-preview" />
              ) : (
                <span className="pf-drop-empty">
                  <FaImage aria-hidden="true" />
                  Click to upload
                </span>
              )}
              <input id="pf-photo" type="file" accept="image/*" onChange={onPhoto} hidden />
            </label>
            <p className="pf-file">{photoName || (previewSrc ? "Current photo" : "No file chosen")}</p>
            {previewSrc && (
              <label htmlFor="pf-photo" className="sk-btn sk-btn--ghost sk-btn--sm pf-change">
                Change photo
              </label>
            )}
          </section>

          <section className="ad-card ad-card-pad">
            <h3 className="ad-card-title">Organise</h3>
            <div className="ad-form">
              <div className="ad-field">
                <label className="sk-label" htmlFor="pf-cat">Category</label>
                <select
                  id="pf-cat"
                  className="sk-input pf-select"
                  value={form.category}
                  onChange={set("category")}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="ad-field">
                <label className="sk-label" htmlFor="pf-ship">Shipping</label>
                <select
                  id="pf-ship"
                  className="sk-input pf-select"
                  value={form.shipping}
                  onChange={set("shipping")}
                >
                  <option value="1">Shipping available</option>
                  <option value="0">No shipping</option>
                </select>
              </div>
            </div>
          </section>

          <div className="pf-actions">
            <button type="submit" className="sk-btn sk-btn--primary" disabled={submitting}>
              {submitting ? "Saving..." : submitLabel}
            </button>
            {extraActions}
          </div>
        </aside>
      </div>
    </form>
  );
};

export default ProductForm;
