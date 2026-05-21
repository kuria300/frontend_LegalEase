import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import RegisterPage from "./pages/register/RegisterPage"
import LoginPage from "./pages/login/LoginPage"
import LawyerMarketplace from "./pages/marketplace/LawyerMarketplace"
import LawyerCard from "./components/LawyerCard"
import Verifyotp from "./pages/verifyotp/Verifyotp"
import LawyerDashboardLayout from "./components/layout/LawyerDashboardLayout"
import LawyerHomepage from "./pages/lawyer/LawyerHomepage"
import ConsultationList from "./pages/lawyer/ConsultationList"
import LawyerProfile from "./pages/lawyer/LawyerProfile"
import LawyerCalendarPage from "./pages/lawyer/LawyerCalendarPage"

const Placeholder = ({ title }) => (
  <div style={{ padding: 20 }}>
    <h2 style={{ fontFamily: "sans-serif", color: "#101828" }}>{title}</h2>
    <p style={{ color: "#667085", marginTop: 8 }}>Coming soon.</p>
  </div>
)

function App() {
  return (
    <>
      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path='/signup'    element={<RegisterPage />} />
        <Route path='/login'     element={<LoginPage />} />
        <Route path='/verifyOtp' element={<Verifyotp />} />

        {/* Lawyer portal */}
        <Route path="/lawyer" element={<LawyerDashboardLayout />}>
          <Route index                element={<LawyerHomepage />} />
          <Route path="consultations" element={<ConsultationList />} />
          <Route path="profile"       element={<LawyerProfile />} />
          <Route path="calendar"      element={<LawyerCalendarPage />} />
          <Route path="settings"      element={<Placeholder title="Settings" />} />
          <Route path="support"       element={<Placeholder title="Support" />} />
        </Route>
      </Routes>
    </>
  )
}

export default App