import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { APIUrl } from "../../../utils";

/**
 * BACKEND CONTRACT (implemented in backend step 1):
 *   GET {APIUrl}/api/v1/auth/users   (admin only, Authorization header = token)
 *   -> { users: [{ _id, name, email, role, createdAt, phone?, address? }] }
 * A bare array is accepted too. role === 1 means admin.
 * Change USERS_ENDPOINT if your route is named differently.
 */
const USERS_ENDPOINT = `${APIUrl}/api/v1/auth/users`;

const formatDate = (d) => {
  if (!d) return "–";
  const date = new Date(d);
  return Number.isNaN(date.getTime())
    ? "–"
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(USERS_ENDPOINT, {
          headers: { Authorization: localStorage.getItem("authToken") },
        });
        setUsers(Array.isArray(data) ? data : data?.users || []);
      } catch (error) {
        console.log(error);
        setUnavailable(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q))
      : users;
  }, [users, query]);

  return (
    <div className="ad-page">
      <div className="ad-head">
        <div>
          <h2>Users</h2>
          <p>Everyone who has registered on the store.</p>
        </div>
      </div>

      <section className="ad-card">
        <div className="ad-toolbar">
          <h3 className="ad-card-title" style={{ margin: 0 }}>
            All users <span className="sk-badge" style={{ marginLeft: 8 }}>{users.length}</span>
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
                <div key={i} className="ad-skeleton" style={{ width: `${85 - i * 10}%` }} />
              ))}
            </div>
          ) : unavailable ? (
            <div className="ad-empty">
              <strong>The users list is not available yet</strong>
              This page needs an admin-only <code>GET /api/v1/auth/users</code> endpoint on the backend.
            </div>
          ) : filtered.length === 0 ? (
            <div className="ad-empty">
              <strong>{query ? "No matching users" : "No users yet"}</strong>
              {query ? "Try a different search." : "Registered customers will appear here."}
            </div>
          ) : (
            <table className="ad-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                  <th scope="col">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="ad-cell-main">
                        <span className="ad-cell-dot" aria-hidden="true">
                          {(u.name || "?").charAt(0).toUpperCase()}
                        </span>
                        {u.name}
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      {u.role === 1 ? (
                        <span className="sk-badge sk-badge--brand">Admin</span>
                      ) : (
                        <span className="sk-badge">Customer</span>
                      )}
                    </td>
                    <td>{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default ManageUsers;
