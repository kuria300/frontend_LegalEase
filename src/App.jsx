import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import RegisterPage from "./pages/register/RegisterPage"
import LoginPage from "./pages/login/LoginPage"
import Chatbot from "./components/chat/Chatbot"
import TypingIndicator from "./components/chat/TypingIndicator"
import ChatBubble from "./components/chat/ChatBubble"
import CategorySelection from "./components/chat/CategorySelection"
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
       <Route path="/" element={<HomePage />}/>
       <Route path='/signup' element={<RegisterPage />}/>
       <Route path='/login' element={<LoginPage />}/>
       <Route path="/find-lawyers" element={<LawyerMarketplace/>}/>
       <Route path='/verifyOtp' element={<Verifyotp />}/>
       <Route path="/typing" element={<TypingIndicator />} />
       <Route path="/chatbubble" element={<ChatBubble />} />
       <Route path="/category" element={<CategorySelection />} />
       <Route path="/subcategory" element={<SubcategorySelection />} />
       <Route path="/chatbot" element={<Chatbot />} />
     </Routes>
    </>
  )
}

export default App
