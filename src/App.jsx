import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import RegisterPage from "./pages/register/RegisterPage"
import LoginPage from "./pages/login/LoginPage"
import FloatingChatButton from "./components/ui/Chat/FloatingChatButton"
import LawyerMarketplace from "./pages/marketplace/LawyerMarketplace"
import Verifyotp from "./pages/verifyotp/Verifyotp"
import Dashboard from "./pages/dashboard/Dashboard"
import LawyerProfileModal from "./pages/marketplace/LawyerProfileModal"

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
        <Route path="/marketplace" element={<LawyerMarketplace/>}/>
        <Route path='/lawyer-modal/:id' element={<LawyerProfileModal/>}/>

        {/* Chat routes temporarily disabled */}
      </Routes>
      <FloatingChatButton />
    </>
  )
}

export default App
