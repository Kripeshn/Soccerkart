import Nav from '../../Components/Layout/Nav'
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth'
import axios from 'axios';
import {Checkbox, Radio} from 'antd'
import { Prices } from '../../Components/Prices';
import { useCart } from '../../context/cart';
import toastr from 'toastr';
import Hero from '../../Components/Header/Hero';
import './index.css';
import cartimg from '../../assets/cart.svg'


export default function Index() {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [auth, setAuth] = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

     //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:8080/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

 //get all cat
 const getAllCategory = async () => {
  try {
    const { data } = await axios.get("http://localhost:8080/api/v1/category/get-category");
    if (data?.success) {
      setCategories(data?.category);
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  getAllCategory();
  getTotal();
}, []);

   //get products
   const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:8080/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
 
  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);


  // get filtered product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("http://localhost:8080/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if(checked.length || radio.length) filterProduct()
  }, [checked, radio]);
  
  return (
    <div>
        <Nav />
        <Hero />
        <div className="container">
          <div className="filter">            
            <div className="categories">
            <h1>
              Filter by Category
            </h1>
            {categories?.map( c =>(
              <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                {c.name}
              </Checkbox>
            ))}
            </div>           
            <div className="prices">     
            <h1 >
              Filter By Price
            </h1>     
              <Radio.Group className='radio' onChange={e => setRadio(e.target.value)}>
                {Prices?.map(p =>  (
                  <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
            <div className="reset">          
              <button className="reset-button" onClick = {() => window.location.reload()}>Reset Filter</button>
            </div>
          </div>
          <div className="display-products">           
            <h2 className="display-heading">Our Products</h2>
            <div className="display-list">
            {products?.map((p) => (              
                <div key={p._id} className="products">
                  <div className="product-image-container">                  
                  <img
                    src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
                    className="product-image"
                    alt={p.name}
                    />
                    <div className="add" onClick={() => {
                    setCart([...cart, p]);
                    localStorage.setItem('cart', JSON.stringify([...cart, p]));
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
                      <button className="more-info" onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                      </div>
                    <h5 className="product-description">{p.description.substring(0,20)}...</h5>
                    <p className="product-price">Rs. {p.price}</p>
                    <p className="ogprice">Rs. {p.price+50/100*p.price}</p>
                   
                  
                  </div>
                </div>             
            ))}
            </div>
            <div>
              <div className="m-2 p-3">
                {products && products.length < total && (
                  <button className='btn btn-warning' onClick={(e) => {
                    e.preventDefault();
                    setPage(page+1);
                  }}>
                    {loading ? "Loading..." : "Load More"}
                    </button>
                )}
              </div>
            </div>
          </div>
        </div>
    
    </div>
  )
}
