import React from "react";

/**
 * Props unchanged from the original (handleSubmit, value, setValue).
 * Optional: submitLabel, loading, autoFocus, placeholder.
 */
const CategoryForm = ({
  handleSubmit,
  value,
  setValue,
  submitLabel = "Save category",
  loading = false,
  autoFocus = false,
  placeholder = "e.g. Football boots",
}) => {
  return (
    <form className="ad-form" onSubmit={handleSubmit}>
      <div className="ad-field">
        <label className="sk-label" htmlFor="category-name">
          Category name
        </label>
        <input
          id="category-name"
          type="text"
          className="sk-input"
          placeholder={placeholder}
          value={value}
          autoFocus={autoFocus}
          maxLength={60}
          required
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <button type="submit" className="sk-btn sk-btn--primary" disabled={loading || !value.trim()}>
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default CategoryForm;
