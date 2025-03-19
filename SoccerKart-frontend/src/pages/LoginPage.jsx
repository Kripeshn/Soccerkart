import React from 'react'
import Nav from '../Components/Layout/Nav'

import "./Login.css"
import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import 'toastr/build/toastr.min.css';
import toastr from 'toastr';
import logo from '../assets/logo1.png'
import { useAuth } from '../context/auth'
toastr.options = {
  "closeButton": true,
  "progressBar": true,
  "positionClass": "toast-top-right",
  
};



export default function LoginPage() {
  const [email, setEmail ] = useState();
  const [password, setPassword ] = useState();
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  

  const handleSubmit = async  (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/login', {email, password})
     .then(result => {
      if(result.status === 200 && result.data.token){       
        localStorage.setItem('authToken', result.data.token);
          if(result.data.user.role === 0)
          {
            toastr.success(`Login successful, welcome ${result.data.user.name}.`);
            setAuth({
              ...auth,
              user: result.data.user,
              token: result.data.token,
            });
            localStorage.setItem('auth', JSON.stringify(result.data));
            navigate(location.state || "/");

          }else if(result.data.user.role === 1){
            
            toastr.success(`Login successful, welcome ${result.data.user.name}.`);
            setAuth({
              ...auth,
              user: result.data.user,
              token: result.data.token,
            });
            localStorage.setItem('auth', JSON.stringify(result.data));
            navigate(location.state || "/");
          }
        
      }else if(result.data === "The password is incorrect"){
        toastr.error('Your password is incorrect. Please try again.');
      }else{
        toastr.error('Login failed. Please try again.');
      }
   })
     .catch(err => console.log(err));
}

  return (
    <div>
        {/* <Nav className="navbar"/> */}
        <div className="login-container">
        <div className="intro">
          <div className="logo">
            <img src={logo} alt="" />
          </div>
          <div className="desc">
            Get all your football gears and accessories you want  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente fugiat dolorem acc 
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
                <h2> Log In </h2>
                <div className="form-group">
                    {/* <label htmlFor="email">Email</label> */}
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)} 
                        required />
                </div>
                <div className="form-group">
                    {/* <label htmlFor="password">Password</label> */}
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)} 
                        required />
                <div className='pas-sig'>
                  <NavLink className='forgot' to="/forgot-password">Forgot your password?</NavLink>
                  <NavLink className='sign' to= "/signup">Signup</NavLink>
                  </div>
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
        {/* <h1>Login</h1> */}
        </div>
    </div>
  )
}
