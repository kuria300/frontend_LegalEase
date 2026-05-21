import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import RegisterPage from "./pages/register/RegisterPage"
import LoginPage from "./pages/login/LoginPage"
import { Icon } from "lucide-react"
import LawyerApplication from "./pages/lawyerForm/LawyerApplication"
import ApplicationPending from "./pages/application/ApplicationPending"
import AdminDashboard from "./pages/admin/AdminDashboard"
import LawyerDashboardLayout from "./components/layout/LawyerDashboardLayout"
import LawyerHomepage from "./pages/lawyer/LawyerHomepage"
import ConsultationList from "./pages/lawyer/ConsultationList"
import LawyerProfile from "./pages/lawyer/LawyerProfile"
import LawyerCalendarPage from "./pages/lawyer/LawyerCalendarPage"
import LawyerSettingsPage from "./pages/lawyer/LawyerSettingsPage"
import LawyerSupportPage from "./pages/lawyer/LawyerSupportPage"
import FloatingChatButton from "./components/ui/Chat/FloatingChatButton"
import LawyerMarketplace from "./pages/marketplace/LawyerMarketplace"
import Verifyotp from "./pages/verifyotp/Verifyotp"
import Dashboard from "./pages/dashboard/Dashboard"
import BookingPage from "./pages/booking/BookingPage"
import ClientDashboard from "./pages/client/ClientDashboard"
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
        <Route path='/apply' element={<LawyerApplication />}/>
        <Route path='/client-dashboard' element={<ClientDashboard />}/>
        <Route path='/application-pending' element={<ApplicationPending />}/>
        <Route path='/admin' element={<AdminDashboard />}/>
        <Route path="/lawyer" element={<LawyerDashboardLayout />}/>
        <Route path="lawyer/dashboard"element={<LawyerHomepage />} />
        <Route path="consultations" element={<ConsultationList />} />
        <Route path="profile" element={<LawyerProfile />} />
        <Route path="calendar" element={<LawyerCalendarPage />} />
        <Route path="settings" element={<LawyerSettingsPage />} />
        <Route path="support" element={<LawyerSupportPage />} />
        <Route path="/booking/checkout" element={<BookingPage />} />

  
      </Routes>
      {/* <FloatingChatButton /> */}
    </>
  )
}

export default App
