
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { APIUrl } from "../../../utils";

const USERS_ENDPOINT = `${APIUrl}/api/v1/user`;

const getToken = () => localStorage.getItem("authToken");

const authConfig = () => ({
  headers: {
    Authorization: getToken(),
  },
});

const formatDate = (d) => {
  if (!d) return "–";

  const date = new Date(d);

  return Number.isNaN(date.getTime())
    ? "–"
    : date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get(
        `${USERS_ENDPOINT}/all-users`,
        authConfig()
      );

      setUsers(data.users || []);
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message ||
        "Unable to fetch users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search users locally
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return users;

    return users.filter((user) =>
      `${user.name} ${user.email}`.toLowerCase().includes(q)
    );
  }, [users, query]);

  // Open edit form
  const handleEdit = (user) => {
    setEditingUser({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  // Update user
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const { data } = await axios.put(
        `${USERS_ENDPOINT}/update-user/${editingUser._id}`,
        {
          name: editingUser.name,
          email: editingUser.email,
          role: Number(editingUser.role),
        },
        authConfig()
      );

      setUsers((prev) =>
        prev.map((user) =>
          user._id === editingUser._id ? data.user : user
        )
      );

      setEditingUser(null);
      alert("User updated successfully");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Failed to update user"
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${USERS_ENDPOINT}/delete-user/${userId}`,
        authConfig()
      );

      setUsers((prev) =>
        prev.filter((user) => user._id !== userId)
      );

      alert("User deleted successfully");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  };

  return (
    <div className="ad-page">

      <div className="ad-head">
        <div>
          <h2>Users</h2>
          <p>Manage everyone registered on the store.</p>
        </div>
      </div>

      <section className="ad-card">

        <div className="ad-toolbar">
          <h3 className="ad-card-title" style={{ margin: 0 }}>
            All users
            <span className="sk-badge" style={{ marginLeft: 8 }}>
              {users.length}
            </span>
          </h3>

          <input
            type="search"
            className="sk-input"
            placeholder="Search by name or email"
            aria-label="Search users"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="ad-table-wrap">

          {loading ? (
            <div className="ad-card-pad" style={{ display: "grid", gap: 14 }}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="ad-skeleton"
                  style={{ width: `${85 - i * 10}%` }}
                />
              ))}
            </div>
          ) : error ? (
            <div className="ad-empty">
              <strong>Unable to load users</strong>
              {error}
              <button
                className="sk-btn"
                onClick={fetchUsers}
                style={{ marginTop: 12 }}
              >
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="ad-empty">
              <strong>
                {query ? "No matching users" : "No users yet"}
              </strong>
              {query
                ? "Try a different search."
                : "Registered customers will appear here."}
            </div>
          ) : (
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="ad-cell-main">
                        <span className="ad-cell-dot">
                          {(u.name || "?").charAt(0).toUpperCase()}
                        </span>
                        {u.name}
                      </div>
                    </td>

                    <td>{u.email}</td>

                    <td>
                      {u.role === 1 ? (
                        <span className="sk-badge sk-badge--brand">
                          Admin
                        </span>
                      ) : (
                        <span className="sk-badge">
                          Customer
                        </span>
                      )}
                    </td>

                    <td>{formatDate(u.createdAt)}</td>

                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="sk-btn sk-btn--sm"
                          onClick={() => handleEdit(u)}
                        >
                          Edit
                        </button>

                        <button
                          className="sk-btn sk-btn--sm"
                          onClick={() => handleDelete(u._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </section>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="ad-modal-backdrop">
          <div className="ad-card ad-modal">

            <div className="ad-card-pad">
              <h3>Edit User</h3>

              <form onSubmit={handleUpdate}>

                <label>Name</label>
                <input
                  className="sk-input"
                  type="text"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      name: e.target.value,
                    })
                  }
                  required
                />

                <label>Email</label>
                <input
                  className="sk-input"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      email: e.target.value,
                    })
                  }
                  required
                />

                <label>Role</label>
                <select
                  className="sk-input"
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      role: Number(e.target.value),
                    })
                  }
                >
                  <option value={0}>Customer</option>
                  <option value={1}>Admin</option>
                </select>

                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <button
                    className="sk-btn"
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    className="sk-btn"
                    type="button"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ManageUsers;
