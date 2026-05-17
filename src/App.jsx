import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
function App() {

  return (
    <>
    {/* routes */}
     <Routes>
       <Route path="/" element={<HomePage />}/>
     </Routes>
    </>
  )
}

export default App
