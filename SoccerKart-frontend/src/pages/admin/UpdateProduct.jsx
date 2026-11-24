import React, { useEffect, useState } from "react";
import axios from "axios";
import toastr from "toastr";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import ProductForm from "../../Components/Form/ProductForm";
import usePhotoPreview from "../../Components/Form/usePhotoPreview";
import Modal from "../../Components/UI/Modal";
import { APIUrl } from "../../../utils";

const EMPTY = { name: "", description: "", price: "", quantity: "", category: "", shipping: "1" };
const authHeaders = () => ({ Authorization: localStorage.getItem("authToken") });

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [photo, setPhoto] = useState(null);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const newPreview = usePhotoPreview(photo);
  const previewSrc = newPreview || (id ? `${APIUrl}/api/v1/product/product-photo/${id}` : "");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${APIUrl}/api/v1/product/get-product/${params.slug}`);
        const p = data.product;
        setId(p._id);
        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price ?? "",
          quantity: p.quantity ?? "",
          category: p.category?._id || p.category || "",
          shipping: p.shipping ? "1" : "0",
        });
      } catch (error) {
        console.log(error);
        toastr.error("Could not load this product");
        navigate("/dashboard/admin/allproducts");
      } finally {
        setLoading(false);
      }
    })();
  }, [params.slug, navigate]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${APIUrl}/api/v1/category/get-category`);
        if (data?.success) setCategories(data.category);
      } catch (error) {
        console.log(error);
        toastr.error("Something went wrong in getting categories");
      }
    })();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const productData = new FormData();
      productData.append("name", form.name);
      productData.append("description", form.description);
      productData.append("price", form.price);
      productData.append("quantity", form.quantity);
      productData.append("category", form.category);
      productData.append("shipping", form.shipping);
      if (photo) productData.append("photo", photo);

      const { data } = await axios.put(
        `${APIUrl}/api/v1/product/update-product/${id}`,
        productData,
        { headers: authHeaders() }
      );

      if (data?.success) {
        toastr.success("Product updated successfully");
        navigate("/dashboard/admin/allproducts");
      } else {
        toastr.error(data?.message || "Could not update the product");
      }
    } catch (error) {
      console.log(error);
      toastr.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${APIUrl}/api/v1/product/delete-product/${id}`, { headers: authHeaders() });
      toastr.success("Product deleted successfully");
      navigate("/dashboard/admin/allproducts");
    } catch (error) {
      console.log(error);
      toastr.error("Something went wrong");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="ad-page">
        <div className="ad-card ad-card-pad" style={{ display: "grid", gap: 16 }}>
          {[80, 60, 90, 50].map((w, i) => (
            <div key={i} className="ad-skeleton" style={{ width: `${w}%`, height: 18 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="ad-page">
      <div className="ad-head">
        <div>
          <h2>Edit product</h2>
          <p>{form.name}</p>
        </div>
      </div>

      <ProductForm
        form={form}
        setForm={setForm}
        categories={categories}
        previewSrc={previewSrc}
        photoName={photo?.name}
        onPhoto={(e) => setPhoto(e.target.files[0] || null)}
        onSubmit={handleUpdate}
        submitting={submitting}
        submitLabel="Save changes"
        extraActions={
          <button type="button" className="sk-btn sk-btn--danger" onClick={() => setConfirmDelete(true)}>
            <FaTrash aria-hidden="true" /> Delete product
          </button>
        }
      />

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete product?">
        <p style={{ margin: 0, color: "var(--text-2)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--ink)" }}>{form.name}</strong> will be removed from the store. This cannot be undone.
        </p>
        <div className="sk-modal-actions">
          <button className="sk-btn sk-btn--ghost" onClick={() => setConfirmDelete(false)}>Cancel</button>
          <button className="sk-btn sk-btn--danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateProduct;
