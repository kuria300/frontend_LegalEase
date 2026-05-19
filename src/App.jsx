import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import RegisterPage from "./pages/register/RegisterPage"
import LoginPage from "./pages/login/LoginPage"
import { Icon } from "lucide-react"
import LawyerMarketplace from "./pages/marketplace/LawyerMarketplace"
import LawyerCard from "./components/LawyerCard"
function App() {

  return (
    <>
    {/* routes */}
     <Routes>
       <Route path="/" element={<HomePage />}/>
       <Route path='/signup' element={<RegisterPage />}/>
       <Route path='/login' element={<LoginPage />}/>
       <Route path="/find-lawyers" element={<LawyerMarketplace/>}/>
     </Routes>
    </>
  )
}

export default App
