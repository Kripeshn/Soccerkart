import React from 'react'
import Nav from '../../Components/Layout/Nav'
import { useCart } from '../../context/cart'
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';
import './Cart.css'
const Cart = () => {
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };
  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Nav />
  
        <div className="cart">
          <div className="cart-items">
            <div className='cart-items-title'>
              <p>Items</p>
              <p>Title</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Remove</p>
            </div>
            <br />
            <hr />
            {Object.entries(
              cart.reduce((acc, item) => {
              acc[item._id] = acc[item._id] || { ...item, quantity: 0 };
              acc[item._id].quantity += 1;
              return acc;
                }, {})
              ).map(([id, p]) => (
                <div key={id}>
                  <div className="cart-items-title cart-items-item">
                    <img
                      src={`http://localhost:8080/api/v1/product/product-photo/${id}`}
                      className="card-img-top"
                      alt={p.name}
                      width="100px"
                      height="100px"
                    />
                    <p>{p.name}</p>
                    <p>Rs. {p.price}</p>
                    <p>{p.quantity}</p>
                    <p>Rs. {p.price * p.quantity}</p>
                    <button className="remove" onClick={() => removeCartItem(id)}>
                      X
                    </button>
                  </div>
                  <hr />
                </div>
              ))}

          </div>
          {/* <div className="col-md-4 text-center">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total : {totalPrice()} </h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() =>
                      navigate("/login", {
                        state: "/cart",
                      })
                    }
                  >
                    Plase Login to checkout
                  </button>
                )}
              </div>
            )}
          </div> */}
        </div>
      </div>
   
  )
}

export default Cart
