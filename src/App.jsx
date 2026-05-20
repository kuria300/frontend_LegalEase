import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import RegisterPage from "./pages/register/RegisterPage"
import LoginPage from "./pages/login/LoginPage"
import { Icon } from "lucide-react"
import FloatingChatButton from "./components/ui/Chat/FloatingChatButton";
import LawyerMarketplace from "./pages/marketplace/LawyerMarketplace"
import LawyerCard from "./components/LawyerCard"
import Verifyotp from "./pages/verifyotp/Verifyotp"

function App() {

  return (
    <>
    {/* routes */}
     <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/signup' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/verifyOtp' element={<Verifyotp />} />
        <Route path="/find-lawyers" element = {<LawyerMarketplace/>}/>
      </Routes>

      <FloatingChatButton />
    </>
  )
}

export default App