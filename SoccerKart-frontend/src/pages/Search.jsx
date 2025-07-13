import React, { useState } from 'react'
import Nav from '../Components/Layout/Nav'
import { useSearch } from "../context/search";
import { useCart } from '../context/cart';
import './Home/index.css'
import cartimg from  '../assets/cart.svg'
import toastr from 'toastr';
import { useNavigate } from 'react-router-dom';


const Search = () => {
    const [values, setValues] = useSearch(); 
    const [cart, setCart] = useCart();
    const navigate = useNavigate();
  return (
    <div>
      <Nav />
      <div className="text-center pt-4">
          <h1>Search Results</h1>
          <h6>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h6>
          <div className="display-list">
            {values?.results.map((p) => (              
                <div key={p._id} onClick={() => navigate(`/product/${p.slug}`)} className="products" >
                  <div className="product-image-container">                  
                  <img
                    src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
                    className="product-image"
                    alt={p.name}
                    />
                    <div className="add" onClick={() => {
                    setCart([...cart, p]);
                    toastr.success("Item added to cart")
                    }}>
                    <img src={cartimg} alt="" />
                    </div>

                    </div>
                  <div className="product-info">
                    <div className="product-name">
                      <h5>
                        {p.name}
                      </h5>
                      {/* <button className="more-info">More Details</button> */}
                      </div>
                    <h5 className="product-description">{p.description.substring(0,20)}...</h5>
                    <p className="product-price">Rs. {p.price}</p>                
                  </div>
                </div>             
            ))}
            </div>
        </div>
    </div>
  )
}

export default Search
