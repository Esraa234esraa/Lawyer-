import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App'
import './index.css'

// Set RTL on document element
document.documentElement.dir = 'rtl'
document.documentElement.lang = 'ar'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-left" richColors />
    </BrowserRouter>
  </React.StrictMode>
)