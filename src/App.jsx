import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import RegisterPage from "./pages/register/RegisterPage"
import LoginPage from "./pages/login/LoginPage"
import { Icon } from "lucide-react"
import LawyerApplication from "./pages/lawyerForm/LawyerApplication"
import ApplicationPending from "./pages/application/ApplicationPending"
import AdminDashboard from "./pages/admin/AdminDashboard"

import FloatingChatButton from "./components/ui/Chat/FloatingChatButton"
import LawyerMarketplace from "./pages/marketplace/LawyerMarketplace"
import Verifyotp from "./pages/verifyotp/Verifyotp"
import Dashboard from "./pages/dashboard/Dashboard"
import BookingPage from "./pages/booking/BookingPage"

import Emailotp from "./pages/forgot-password/Emailotp"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/signup' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/verifyOtp' element={<Verifyotp />} />
        <Route path="/find-lawyers" element = {<LawyerMarketplace/>}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/email-otp" element={<Emailotp />} />
        <Route path='/apply' element={<LawyerApplication />}/>
        <Route path='/application-pending' element={<ApplicationPending />}/>
        <Route path='/admin' element={<AdminDashboard />}/>
        <Route path="/booking/checkout" element={<BookingPage />} />

        {/* Chat routes temporarily disabled */}
      </Routes>
      <FloatingChatButton />
    </>
  )
}

export default App
