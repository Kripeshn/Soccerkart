import React from "react";
import { Routes, Route } from "react-router-dom";
import "../index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";

// route guards
import PrivateRoute from "./Components/Routes/Private";
import AdminRoute from "./Components/Routes/AdminRoute";

// public pages
import Index from "./pages/Home/Index";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Search from "./pages/Search";
import About from "./pages/About";
import Cart from "./pages/Cart/CartPage";
import PageNotFound from "./pages/PageNotFound";

// auth pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPassword from "./pages/ForgotPassword";

// user area
import Dashboard from "./pages/user/Dashboard";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";

// admin area
import Admin from "./pages/admin/Admin";
import CreateCategory from "./pages/admin/CreateCategory";
import CreateProduct from "./pages/admin/CreateProduct";
import UpdateProduct from "./pages/admin/UpdateProduct";
import AllProducts from "./pages/admin/AllProducts";
import ManageUsers from "./pages/admin/ManageUsers";

export default function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* ── Storefront: Nav + page + Footer ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="home" element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="product/:slug" element={<Product />} />
          <Route path="search" element={<Search />} />
          <Route path="about" element={<About />} />

          <Route path="cart" element={<PrivateRoute />}>
            <Route index element={<Cart />} />
          </Route>

          <Route path="dashboard" element={<PrivateRoute />}>
            <Route path="user" element={<Dashboard />} />
            <Route path="user/orders" element={<Orders />} />
            <Route path="user/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Route>

        {/* ── Auth screens: minimal shell, no Nav / Footer ── */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* ── Admin: sidebar + top bar, no Nav / Footer ── */}
        <Route path="dashboard" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="admin" element={<Admin />} />
            <Route path="admin/create-category" element={<CreateCategory />} />
            <Route path="admin/create-product" element={<CreateProduct />} />
            <Route path="admin/product/:slug" element={<UpdateProduct />} />
            <Route path="admin/allproducts" element={<AllProducts />} />
            <Route path="admin/manage-user" element={<ManageUsers />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}
