import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import RegisterPage from "./pages/register/RegisterPage"
import LoginPage from "./pages/login/LoginPage"

import SubcategorySelection from "./components/chat/SubcategorySelection"
import { Icon } from "lucide-react"
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

        {/* Chat routes temporarily disabled */}

       
        <Route path="/subcategory" element={<SubcategorySelection />} />

      </Routes>
    </>
  )
}

export default App
