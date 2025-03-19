import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./pages/Product";
import LoginPage from "./pages/LoginPage";
import Index from "./pages/Home/Index";
import PageNotFound from "./pages/PageNotFound";
import "../index.css";
import SignupPage from "./pages/SignupPage";
import Home from "./pages/Home";
import About from "./pages/About";
import Admin from "./pages/admin/Admin";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./Components/Routes/Private";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ForgotPassword from "./pages/ForgotPassword";
import AdminRoute from "./Components/Routes/AdminRoute";
import CreateCategory from "./pages/admin/CreateCategory";
import CreateProduct from "./pages/admin/CreateProduct";
import ManageUsers from "./pages/admin/ManageUsers";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import Products from "./pages/admin/Products";
import UpdateProduct from "./pages/admin/UpdateProduct";
import Cart from "./pages/Cart/CartPage";
import Search from "./pages/Search";
import CartPage from "./pages/Cart/CartPage";
import { Footer } from "antd/es/layout/layout";
import Nav from "./Components/Layout/Nav";
import Login from "./pages/login/Login";

export default function App() {
  return (
    <div className="app">
      <Nav />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Index />}></Route>
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="user" element={<Dashboard />}></Route>
            <Route path="user/orders" element={<Orders />}></Route>
            <Route path="user/profile" element={<Profile />}></Route>
          </Route>
          <Route path="/dashboard" element={<AdminRoute />}>
            <Route path="admin" element={<Admin />}></Route>
            <Route
              path="admin/create-category"
              element={<CreateCategory />}
            ></Route>
            <Route
              path="admin/create-product"
              element={<CreateProduct />}
            ></Route>
            <Route
              path="admin/product/:slug"
              element={<UpdateProduct />}
            ></Route>
            <Route path="admin/products" element={<Products />}></Route>
            <Route path="admin/manage-user" element={<ManageUsers />}></Route>
          </Route>
          <Route path="home" element={<Home />}></Route>
          <Route path="cart" element={<CartPage />}></Route>
          <Route path="search" element={<Search />}></Route>
          <Route path="forgot-password" element={<ForgotPassword />}></Route>
          <Route path="admin" element={<Admin />}></Route>
          <Route path="product" element={<Product />}></Route>
          <Route path="product/:slug" element={<Product />}></Route>
          <Route path="login" element={<Login />}></Route>
          <Route path="signup" element={<SignupPage />}></Route>
          <Route path="about" element={<About />}></Route>
          <Route path="*" element={<PageNotFound />}></Route>
        </Routes>
      </div>
    </div>
  );
}
