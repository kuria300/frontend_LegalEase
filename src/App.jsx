import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import RegisterPage from "./pages/register/RegisterPage"
import LoginPage from "./pages/login/LoginPage"
import FloatingChatButton from "./components/ui/Chat/FloatingChatButton"
import LawyerMarketplace from "./pages/marketplace/LawyerMarketplace"
import Verifyotp from "./pages/verifyotp/Verifyotp"
import Dashboard from "./pages/dashboard/Dashboard"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verifyotp" element={<Verifyotp />} />
        <Route path="/find-lawyers" element={<LawyerMarketplace />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <FloatingChatButton />
    </>
  )
}

export default App