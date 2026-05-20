import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import RegisterPage from "./pages/register/RegisterPage"
import LoginPage from "./pages/login/LoginPage"
import { Icon } from "lucide-react"
import LawyerApplication from "./pages/lawyerForm/LawyerApplication"
import ApplicationPending from "./pages/application/ApplicationPending"
import AdminDashboard from "./pages/admin/AdminDashboard"

function App() {

  return (
    <>
    {/* routes */}
     <Routes>
       <Route path="/" element={<HomePage />}/>
       <Route path='/signup' element={<RegisterPage />}/>
       <Route path='/login' element={<LoginPage />}/>
       <Route path='/apply' element={<LawyerApplication />}/>
       <Route path='/application-pending' element={<ApplicationPending />}/>
       <Route path='/admin' element={<AdminDashboard />}/>
     </Routes>
    </>
  )
}

export default App
