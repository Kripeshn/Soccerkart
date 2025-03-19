import React, { useState } from 'react'
import Nav from '../Components/Layout/Nav'
import "./Signup.css"
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios';
import toastr from 'toastr';




export default function SignupPage() {
    const [name, setName] = useState();
    const [email, setEmail ] = useState();
    const [password, setPassword ] = useState();
    const [answer, setAnswer ] = useState();
    const navigate = useNavigate();
    toastr.options = {
        // "closeButton": true,
        "progressBar": true,
        // "positionClass": "toast-top-right",
      }
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/register', { name, email, password, answer })
            .then((response) => {
                if (response.status === 201) {
                    console.log(response);
                    toastr.success("User Registered Successfully.");
                    setTimeout(() => navigate('/login'), 2000); // Navigate after a delay
                }  else {
                    toastr.error("An unexpected error occurred.");
                }
            })
            .catch((error) => {
                if (error.response) {
                    // Check for existing user (401 Unauthorized)
                    if (error.response.status === 400) {
                        toastr.error("User already exists.");
                    } else {
                        toastr.error(error.response.data.message || 'Internal Server Error');
                    }
                } else {
                    // Handle other errors like network issues
                    toastr.error('Network Error or Invalid URL');
                }
                console.error(error);
            });
    };
         
    
  return (
    <div>
      <Nav />
      <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit} method='post' action=''>
                <h2>Signup</h2>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text"
                        id="username" 
                        name="username"
                        onChange={(e) => setName(e.target.value)} 
                        required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        onChange={(e) => setEmail(e.target.value)} 
                        required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        required />
                </div>
                <div className="form-group">
                    {/* <label htmlFor="password">Password</label> */}
                    <input 
                        type="text" 
                        id="answer" 
                        
                        name="password" 
                        onChange={(e) => setAnswer(e.target.value)} 
                        placeholder='What is your favourite sports'
                        required />
                </div>
                {/* <div className="form-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input type="password" id="confirm-password" name="confirm-password" required />
                </div> */}
                <button type="submit" className="signup-button">Signup</button>
                <span>Have an existing account? </span><NavLink to = "../login">Login</NavLink>
            </form>
        </div>
    </div>
  )
}
