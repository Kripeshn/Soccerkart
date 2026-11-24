import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";
import { FaSearch } from "react-icons/fa";
import { useSearch } from "../../context/search";
import { APIUrl } from "../../../utils";
import styles from "./SearchInput.module.css";

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const keyword = values.keyword.trim();
    if (!keyword) return;
    try {
      const { data } = await axios.get(
        `${APIUrl}/api/v1/product/search/${encodeURIComponent(keyword)}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
      toastr.error("Search failed. Please try again.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} role="search">
      <input
        type="search"
        className={styles.input}
        placeholder="Search products"
        aria-label="Search products"
        value={values.keyword}
        onChange={(e) => setValues({ ...values, keyword: e.target.value })}
      />
      <button type="submit" className={styles.btn} aria-label="Search">
        <FaSearch aria-hidden="true" />
      </button>
    </form>
  );
};

export default SearchInput;
