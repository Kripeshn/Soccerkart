import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'toastr/build/toastr.min.css';
import toastr from 'toastr';
import $ from 'jquery';  // Ensure jQuery is available globally for Toastr
import { AuthProvider } from './context/auth.jsx';
import { CartProvider } from './context/cart.jsx';
import {SearchProvider} from './context/search.jsx'
import Footers from './Components/Layout/Footer/Footer.jsx';
import Nav from './Components/Layout/Nav.jsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SearchProvider>
      <CartProvider>      
      <BrowserRouter> 
            <App />
            <Footers />
          </BrowserRouter> 
      </CartProvider>
      </SearchProvider>
    </AuthProvider>
  </StrictMode>,
)
