import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { initializeDarkMode } from './lib/utils'
import { ProductProvider } from './contexts/ProductContext.jsx'

// Initialize dark mode before rendering
initializeDarkMode()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <ProductProvider>
      <App />
      </ProductProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
