
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toastr from "toastr";
import { APIUrl } from "../../../utils";

const USERS_ENDPOINT = `${APIUrl}/api/v1/user`;

// Get the logged-in user's ID from the stored login response or JWT
const getCurrentUserId = () => {
  try {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    const user = authData.user || {};

    // Check common user ID field names
    const storedId =
      user._id ||
      user.id ||
      user.userID ||
      user.userId ||
      authData.userID;

    if (storedId) return String(storedId);

    // Fallback: decode the JWT payload
    const token = localStorage.getItem("authToken");

    if (token) {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
      );

      const tokenId =
        decoded.userID ||
        decoded._id ||
        decoded.id;

      if (tokenId) return String(tokenId);
    }

    return null;
  } catch (error) {
    console.error("Unable to identify logged-in user:", error);
    return null;
  }
};

const authConfig = () => ({
  headers: {
    Authorization: localStorage.getItem("authToken"),
  },
});

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const currentUserId = getCurrentUserId();

      const { data } = await axios.get(
        `${USERS_ENDPOINT}/all-users`,
        authConfig()
      );

      const fetchedUsers = data.users || [];

      // Never display the currently logged-in admin
      const filteredUsers = fetchedUsers.filter((user) => {
        const userId = String(user._id || user.id || "");
        return !currentUserId || userId !== currentUserId;
      });

      setUsers(filteredUsers);
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        "Unable to fetch users. Please try again.";

      setError(message);
      toastr.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search users locally
  const filteredUsers = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return users;

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search)
    );
  }, [users, query]);

  // Open edit modal
  const handleEdit = (user) => {
    setEditingUser({
      _id: user._id,
      name: user.name || "",
      email: user.email || "",
      role: user.role ?? 0,
    });
  };

  // Update user
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingUser) return;

    try {
      setSaving(true);

      const { data } = await axios.put(
        `${USERS_ENDPOINT}/update-user/${editingUser._id}`,
        {
          name: editingUser.name.trim(),
          email: editingUser.email.trim(),
          role: Number(editingUser.role),
        },
        authConfig()
      );

      if (!data.success) {
        throw new Error(data.message || "Unable to update user.");
      }

      const updatedUser = data.user || data.updatedUser;

      if (updatedUser) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === editingUser._id
              ? updatedUser
              : user
          )
        );
      } else {
        await fetchUsers();
      }

      setEditingUser(null);
      toastr.success(data.message || "User updated successfully.");
    } catch (err) {
      console.error(err);

      toastr.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to update user."
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
      setDeletingId(userId);

      const { data } = await axios.delete(
        `${USERS_ENDPOINT}/delete-user/${userId}`,
        authConfig()
      );

      if (!data.success) {
        throw new Error(data.message || "Unable to delete user.");
      }

      setUsers((prev) =>
        prev.filter((user) => user._id !== userId)
      );

      toastr.success(data.message || "User deleted successfully.");
    } catch (err) {
      console.error(err);

      toastr.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete user."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="ad-page">
      <div className="ad-head">
        <div>
          <h1>Manage Users</h1>
          <p>View, search, update and manage registered users.</p>
        </div>
      </div>

      <div className="ad-card">
        <div className="ad-card-pad">
          <div className="ad-toolbar">
            <div>
              <h3 className="ad-card-title">All Users</h3>
              <p>{users.length} registered users</p>
            </div>

            <input
              className="sk-input"
              type="text"
              placeholder="Search by name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="ad-empty">Loading users...</div>
          ) : error ? (
            <div className="ad-empty">
              <p>{error}</p>
              <button
                className="sk-btn sk-btn--primary"
                onClick={fetchUsers}
              >
                Retry
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="ad-empty">
              {query
                ? "No users match your search."
                : "No registered users found."}
            </div>
          ) : (
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="ad-cell-main">
                          {user.name}
                        </div>
                      </td>

                      <td>{user.email}</td>

                      <td>
                        <span
                          className={`sk-badge ${
                            user.role === 1
                              ? "sk-badge--admin"
                              : "sk-badge--user"
                          }`}
                        >
                          {user.role === 1 ? "Admin" : "Customer"}
                        </span>
                      </td>

                      <td>{formatDate(user.createdAt)}</td>

                      <td>
                        <div className="ad-user-actions">
                          <button
                            className="sk-btn sk-btn--sm"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>

                          <button
                            className="sk-btn sk-btn--sm ad-delete-btn"
                            onClick={() => handleDelete(user._id)}
                            disabled={deletingId === user._id}
                          >
                            {deletingId === user._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div
          className="ad-modal-backdrop"
          onClick={() => {
            if (!saving) setEditingUser(null);
          }}
        >
          <div
            className="ad-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Edit User</h2>

            <form onSubmit={handleUpdate}>
              <label>
                Full Name
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
              </label>

              <label>
                Email Address
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
              </label>

              <label>
                Role
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
              </label>

              <div className="ad-modal-actions">
                <button
                  type="button"
                  className="sk-btn"
                  onClick={() => setEditingUser(null)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="sk-btn sk-btn--primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
