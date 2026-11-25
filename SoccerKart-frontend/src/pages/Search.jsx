import React from "react";
import { Link } from "react-router-dom";
import { useSearch } from "../context/search";
import ProductCard from "../Components/Product/ProductCard";
import "./Search.css";

const Search = () => {
  const [values] = useSearch();
  const results = values?.results || [];
  const keyword = values?.keyword?.trim();

  return (
    <section className="sr">
      <div className="sr-head">
        <h1>Search results</h1>
        <p>
          {results.length < 1
            ? "No products found"
            : `Found ${results.length} product${results.length === 1 ? "" : "s"}`}
          {keyword ? <> for <strong>&ldquo;{keyword}&rdquo;</strong></> : null}
        </p>
      </div>

      {results.length < 1 ? (
        <div className="sk-card sr-empty">
          <strong>Nothing matched your search</strong>
          <p>Check the spelling or try a broader word like &ldquo;boots&rdquo; or &ldquo;jersey&rdquo;.</p>
          <Link to="/products" className="sk-btn sk-btn--primary">Browse all products</Link>
        </div>
      ) : (
        <div className="sr-grid">
          {results.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Search;
