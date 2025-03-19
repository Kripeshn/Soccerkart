import React from 'react'
import logo from '../../../assets/logo1.png'
import './footer.css'
import fb from '../../../assets/fb.svg'
import insta from '../../../assets/insta.svg'
import x from '../../../assets/twitter.svg'
import { NavLink } from 'react-router-dom'

const Footers = () => {
  return (
    <div className='footer'>
        <div className="footer-content">
            <div className="content-left">
                <img src={logo} alt="" />
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequuntur provident ut beatae, earum praesentium fuga obcaecati, officia itaque excepturi minima ullam maxime, eligendi et explicabo dignissimos voluptatum! Quibusdam, ut eligendi.</p>
                <div className="social-icons">
                    <img src={fb} alt="" />
                    <img src={x} alt="" />
                    <img src={insta} alt="" />
                </div>
            </div>
            <div className="content-center">
                <h2>Company</h2>
                <ul>
                    <li>
                       <NavLink className='navlink' to='/'>Home</NavLink>
                    </li>
                    <li>
                       <NavLink className='navlink' to='/about'>About Us</NavLink>
                    </li>
                    <li>
                       <NavLink className='navlink' to='/'>Delivery</NavLink>
                    </li>
                    <li>
                       <NavLink className='navlink' to='/privacy'>Privacy Policy</NavLink>
                    </li>
                   
                </ul>
            </div>
            <div className="content-right">
                <h2>Get in touch</h2>
                <ul>
                    <li>+977-9876543210</li>
                    <li>contact@sokkerkart.com</li>
                </ul>
            </div>
        </div>
        <hr />
        <p className='copyright'>Copyright 2024 &copy; soccerkart.com - All Right Reserved.</p>    
    </div>
  )
}

export default Footers
