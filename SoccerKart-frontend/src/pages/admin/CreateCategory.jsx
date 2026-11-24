import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toastr from "toastr";
import { FaEdit, FaTrash } from "react-icons/fa";
import CategoryForm from "../../Components/Form/CategoryForm";
import Modal from "../../Components/UI/Modal";
import { APIUrl } from "../../../utils";

const authHeaders = () => ({ Authorization: localStorage.getItem("authToken") });

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");

  const [selected, setSelected] = useState(null); // category being edited
  const [updatedName, setUpdatedName] = useState("");
  const [updating, setUpdating] = useState(false);

  const [toDelete, setToDelete] = useState(null); // category pending delete
  const [deleting, setDeleting] = useState(false);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${APIUrl}/api/v1/category/get-category`);
      if (data.success) setCategories(data.category);
    } catch (error) {
      console.log(error);
      toastr.error("Could not load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await axios.post(
        `${APIUrl}/api/v1/category/create-category`,
        { name },
        { headers: authHeaders() }
      );
      if (data?.success) {
        toastr.success(`${name} is created`);
        setName("");
        getAllCategory();
      } else {
        toastr.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toastr.error("Something went wrong while creating the category.");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const { data } = await axios.put(
        `${APIUrl}/api/v1/category/update-category/${selected._id}`,
        { name: updatedName },
        { headers: authHeaders() }
      );
      if (data.success) {
        toastr.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        getAllCategory();
      } else {
        toastr.error(data.message);
      }
    } catch (error) {
      toastr.error("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { data } = await axios.delete(
        `${APIUrl}/api/v1/category/delete-category/${toDelete._id}`,
        { headers: authHeaders() }
      );
      if (data.success) {
        toastr.success("Category is deleted");
        setToDelete(null);
        getAllCategory();
      } else {
        toastr.error(data.message);
      }
    } catch (error) {
      toastr.error("Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? categories.filter((c) => c.name.toLowerCase().includes(q)) : categories;
  }, [categories, query]);

  return (
    <div className="ad-page">
      <div className="ad-head">
        <div>
          <h2>Manage categories</h2>
          <p>Group products so shoppers can filter them in the store.</p>
        </div>
      </div>

      <div className="ad-split">
        <section className="ad-card ad-card-pad">
          <h3 className="ad-card-title">New category</h3>
          <p className="ad-card-sub">Names must be unique.</p>
          <CategoryForm
            handleSubmit={handleSubmit}
            value={name}
            setValue={setName}
            loading={creating}
            submitLabel="Create category"
          />
        </section>

        <section className="ad-card">
          <div className="ad-toolbar">
            <h3 className="ad-card-title" style={{ margin: 0 }}>
              All categories <span className="sk-badge" style={{ marginLeft: 8 }}>{categories.length}</span>
            </h3>
            <input
              type="search"
              className="sk-input"
              placeholder="Search categories"
              aria-label="Search categories"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="ad-table-wrap">
            {loading ? (
              <div className="ad-card-pad" style={{ display: "grid", gap: 14 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="ad-skeleton" style={{ width: `${70 - i * 10}%` }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="ad-empty">
                <strong>{query ? "No matches" : "No categories yet"}</strong>
                {query ? "Try a different search." : "Create your first category using the form."}
              </div>
            ) : (
              <table className="ad-table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col" className="ad-col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <div className="ad-cell-main">
                          <span className="ad-cell-dot" aria-hidden="true">{c.name.charAt(0).toUpperCase()}</span>
                          {c.name}
                        </div>
                      </td>
                      <td className="ad-col-actions">
                        <button
                          className="sk-btn sk-btn--ghost sk-btn--sm"
                          onClick={() => {
                            setSelected(c);
                            setUpdatedName(c.name);
                          }}
                        >
                          <FaEdit aria-hidden="true" /> Edit
                        </button>
                        <button className="sk-btn sk-btn--danger sk-btn--sm" onClick={() => setToDelete(c)}>
                          <FaTrash aria-hidden="true" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Edit category">
        <CategoryForm
          value={updatedName}
          setValue={setUpdatedName}
          handleSubmit={handleUpdate}
          loading={updating}
          submitLabel="Save changes"
          autoFocus
        />
      </Modal>

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Delete category?">
        <p style={{ margin: 0, color: "var(--text-2)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--ink)" }}>{toDelete?.name}</strong> will be removed. This cannot be undone.
        </p>
        <div className="sk-modal-actions">
          <button className="sk-btn sk-btn--ghost" onClick={() => setToDelete(null)}>
            Cancel
          </button>
          <button className="sk-btn sk-btn--danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CreateCategory;
