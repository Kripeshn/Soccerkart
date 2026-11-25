
import React, { useState } from "react";
import axios from "axios";
import toastr from "toastr";
import { APIUrl } from "../../utils";

export default function CheckoutTest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    notes: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const { data } = await axios.post(
        `${APIUrl}/api/v1/auth/login`,
        { email, password }
      );

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toastr.success("Login successful!");
      }

      setResult(data);
    } catch (error) {
      setResult(error.response?.data || error.message);
      toastr.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  // CHECKOUT
  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const { data } = await axios.post(
        `${APIUrl}/api/v1/order/place-order`,
        {
          items: [
            {
              productId,
              quantity: Number(quantity),
            },
          ],
          shippingAddress: address,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setResult(data);
      toastr.success("Order placed successfully!");
    } catch (error) {
      setResult(error.response?.data || error.message);
      toastr.error("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setResult(null);
    toastr.info("Logged out");
  };

  return (
    <div style={{ maxWidth: 650, margin: "40px auto", padding: 24 }}>
      <h2>SoccerKart Checkout API Test</h2>

      {!token ? (
        <>
          <h3>1. Login</h3>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />

            <button disabled={loading} style={buttonStyle}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </>
      ) : (
        <>
          <p style={{ color: "green" }}>Logged in successfully!</p>
          <button onClick={logout}>Logout</button>

          <hr />

          <h3>2. Test Checkout</h3>

          <form onSubmit={handleCheckout}>
            <input
              placeholder="MongoDB Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              type="number"
              min="1"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              style={inputStyle}
            />

            <h4>Delivery Address</h4>

            {Object.keys(address).map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field === "fullName" ? "Full Name" : field}
                value={address[field]}
                onChange={handleAddressChange}
                required={!["notes"].includes(field)}
                style={inputStyle}
              />
            ))}

            <button disabled={loading} style={buttonStyle}>
              {loading ? "Placing order..." : "Place Test Order"}
            </button>
          </form>
        </>
      )}

      {result && (
        <div style={{ marginTop: 25 }}>
          <h3>API Response</h3>
          <pre
            style={{
              background: "#eee",
              padding: 15,
              overflowX: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: 12,
  marginBottom: 12,
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "12px 20px",
  cursor: "pointer",
};
