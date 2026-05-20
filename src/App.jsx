import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import RegisterPage from "./pages/register/RegisterPage"
import LoginPage from "./pages/login/LoginPage"
//import Chatbot from "./components/chat/Chatbot"
//import TypingIndicator from "./components/chat/TypingIndicator"
//import ChatBubble from "./components/chat/ChatBubble"
//import CategorySelection from "./components/chat/CategorySelection"
//import SubcategorySelection from "./components/chat/SubcategorySelection"
import { Icon } from "lucide-react"
import LawyerMarketplace from "./pages/marketplace/LawyerMarketplace"
import LawyerCard from "./components/LawyerCard"
import Verifyotp from "./pages/verifyotp/Verifyotp"

// Lawyer Dashboard
import LawyerDashboardLayout from "./components/layout/LawyerDashboardLayout"
import LawyerHomepage from "./pages/lawyer/LawyerHomepage"
import ConsultationList from "./pages/lawyer/ConsultationList"
import LawyerProfile from "./pages/lawyer/LawyerProfile"
const Placeholder = ({ title }) => (
  <div style={{ padding: 20 }}>
    <h2 style={{ fontFamily: "sans-serif", color: "#101828" }}>{title}</h2>
    <p style={{ color: "#667085", marginTop: 8 }}>Coming soon in the next branch.</p>
  </div>
)

function App() {

  return (
    <>
    {/* routes */}
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/signup' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/verifyOtp' element={<Verifyotp />} />

        {/* Chat routes temporarily disabled */}

        {/* <Route path="/typing" element={<TypingIndicator />} /> */}
        {/* <Route path="/chatbubble" element={<ChatBubble />} /> */}
        {/* <Route path="/category" element={<CategorySelection />} /> */}
        {/* <Route path="/subcategory" element={<SubcategorySelection />} /> */}
        {/* <Route path="/chatbot" element={<Chatbot />} /> */}
        
        {/*Lawyer dashboard routes*/}
        <Route path="/lawyer" element={<LawyerDashboardLayout />}>
          <Route index element={<LawyerHomepage />} />
          <Route path="consultations" element={<ConsultationList />} />
          <Route path="profile" element={<LawyerProfile />} />
          <Route path="calendar"      element={<Placeholder title="Calendar" />} />
          <Route path="settings" element={<Placeholder title="Settings Page" />} />
          <Route path="support" element={<Placeholder title="Support Page" />} />
        </Route>

      </Routes>
    </>
  )
}

export default App
