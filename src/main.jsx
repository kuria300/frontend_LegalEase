import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter } from 'react-router-dom'
import './assets/styles/global.css'
import AuthProvider from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer theme='colored' autoClose={3000} position='top-right' hideProgressBar={true} />
    <BrowserRouter>
     <AuthProvider>
       <App />
     </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
