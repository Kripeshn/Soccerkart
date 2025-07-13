import React from "react";
import axios from "axios";
import Nav from "../Components/Layout/Nav";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./productdetails.css";
import { useCart } from "../context/cart";
import toastr from "toastr";

export default function Product() {
  const params = useParams();

  const navigate = useNavigate();
  const [cart, setCart] = useCart();

  const [product, setProduct] = useState({});
  // const [relatedProducts, setRelatedProducts] = useState([]);

  //initalp details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);
  //getProduct
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Nav/>
      <p className="locate">Soccerkart/Home/{product.name}</p>
      <h1 className="text-center">Product Details</h1>
      <div className="product">
        <div className="product-container">
          <div className="product-img">
            {/* {JSON.stringify(product, null, 4)}    -  */}
            <img
              src={`http://localhost:8080/api/v1/product/product-photo/${product?._id}`}
              className="card-img-top"
              alt={product.name}
              height="300"
              width={"350px"}
            />
          </div>
          <div className="product-details">
            <h2>{product.name}</h2>
            <p className="description">{product.description}</p>
            <hr />
            <p className="price">Rs. {product.price}</p>
            <p className="ogprice">
              Rs. {product.price + (50 / 100) * product.price}
            </p>
            <hr />
            {product.quantity >= 2 ? (
              <p className="instock">In Stock</p>
            ) : (
              <p className="outstock">Out of stock</p>
            )}
            <hr />
            <button
              className=""
              onClick={() => {
                setCart([...cart, product]);
                toastr.success("Item added to cart");
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
