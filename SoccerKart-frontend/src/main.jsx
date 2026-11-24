import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import 'toastr/build/toastr.min.css'
import $ from 'jquery' // Ensure jQuery is available globally for Toastr
import { AuthProvider } from './context/auth.jsx'
import { CartProvider } from './context/cart.jsx'
import { SearchProvider } from './context/search.jsx'

// Design tokens + base styles. Imported after App so they load after
// bootstrap (imported inside App.jsx) and can override it.
import './styles/tokens.css'
import './styles/base.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SearchProvider>
        <CartProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CartProvider>
      </SearchProvider>
    </AuthProvider>
  </StrictMode>,
)
