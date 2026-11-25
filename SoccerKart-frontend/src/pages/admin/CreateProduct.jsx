import React, { useEffect, useState } from "react";
import axios from "axios";
import toastr from "toastr";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../Components/Form/ProductForm";
import usePhotoPreview from "../../Components/Form/usePhotoPreview";
import { APIUrl } from "../../../utils";

const EMPTY = { name: "", description: "", price: "", quantity: "", category: "", shipping: "1" };

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const previewSrc = usePhotoPreview(photo);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!photo) {
      toastr.error("Please upload a product photo");
      return;
    }
    setSubmitting(true);
    try {
      const productData = new FormData();
      productData.append("name", form.name);
      productData.append("description", form.description);
      productData.append("price", form.price);
      productData.append("quantity", form.quantity);
      productData.append("category", form.category);
      productData.append("shipping", form.shipping);
      productData.append("photo", photo);

      const { data } = await axios.post(
        `${APIUrl}/api/v1/product/create-product`,
        productData,
        { headers: { Authorization: localStorage.getItem("authToken") } }
      );

      if (data?.success) {
        toastr.success("Product created successfully");
        navigate("/dashboard/admin/allproducts");
      } else {
        toastr.error(data?.message || "Could not create the product");
      }
    } catch (error) {
      console.log(error);
      toastr.error(error.response?.data?.error || error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ad-page">
      <div className="ad-head">
        <div>
          <h2>Add product</h2>
          <p>Fill in the details and upload a clear photo.</p>
        </div>
      </div>

      <ProductForm
        form={form}
        setForm={setForm}
        categories={categories}
        previewSrc={previewSrc}
        photoName={photo?.name}
        onPhoto={(e) => setPhoto(e.target.files[0] || null)}
        onSubmit={handleCreate}
        submitting={submitting}
        submitLabel="Create product"
      />
    </div>
  );
};

export default CreateProduct;
