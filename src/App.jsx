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
import LawyerMarketplace from "./pages/marketplace/LawyerMarketplace"
import Verifyotp from "./pages/verifyotp/Verifyotp"
import BookingPage from "./pages/booking/BookingPage"
import ClientDashboard from "./pages/client/ClientDashboard"
import LawyerProfileModal from "./pages/marketplace/LawyerProfileModal"
import Emailotp from "./pages/forgot-password/Emailotp"
import ClientProfile from "./pages/client/ClientProfile"
import ProtectedRoute from "./ProtectedRoute"
import ClientChat from "./pages/chat/ClientChat"
import ClientConsult from "./pages/client/ClientConsult"


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/signup' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/verifyOtp' element={<Verifyotp />} />
        <Route path='/application-pending' element={<ApplicationPending />}/>
        <Route path="/email-otp" element={<Emailotp />} />
        <Route path='/apply' element={<LawyerApplication />}/>
     
    
        <Route element={<ProtectedRoute allRoles={['CLIENT']} />}>
           <Route path='/client-dashboard' element={<ClientDashboard />}/>
           <Route path="/client/profile" element={<ClientProfile />} />
           <Route path="/chat" element={<ClientChat />} />
           <Route path="/find-lawyers" element ={<LawyerMarketplace/>}/>
           <Route path='/lawyer-modal/:id' element={<LawyerProfileModal/>}/>
           <Route path="/booking/checkout" element={<BookingPage />} />
           <Route path="/client/consult" element={<ClientConsult />} />
        </Route>
        <Route element={<ProtectedRoute allRoles={['LAWYER']} />}>
          <Route path="/lawyer" element={<LawyerDashboardLayout />}/>
          <Route path="/lawyer/dashboard"element={<LawyerHomepage />} />
          <Route path="/lawyer/profile" element={<LawyerProfile />} />
          <Route path="/lawyer/bookings" element={<ConsultationList />} />
        </Route>
       <Route element={<ProtectedRoute allRoles={['ADMIN', 'SUPERADMIN']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      

      
      </Routes>

    </>
  )
}

export default App
