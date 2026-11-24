import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { LayoutContext } from "../../layouts/LayoutContext";

/**
 * Legacy admin menu. Inside AdminLayout the sidebar replaces it, so it
 * renders nothing there. Kept (with the broken /products link fixed) so
 * pages that have not been migrated yet still work if used elsewhere.
 */
const AdminMenu = () => {
  const { shell } = useContext(LayoutContext);
  if (shell === "admin") return null;

  return (
    <div className="text-center">
      <h1 className="fw-normal">Admin Panel</h1>
      <div className="list-group">
        <NavLink to="/dashboard/admin/create-category" className="list-group-item list-group-item-action">
          Create Category
        </NavLink>
        <NavLink to="/dashboard/admin/create-product" className="list-group-item list-group-item-action">
          Create Product
        </NavLink>
        <NavLink to="/dashboard/admin/allproducts" className="list-group-item list-group-item-action">
          Products
        </NavLink>
        <NavLink to="/dashboard/admin/manage-user" className="list-group-item list-group-item-action">
          Manage User
        </NavLink>
      </div>
    </div>
  );
};

export default AdminMenu;
