import React, { useEffect } from 'react'
import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null)
const AuthProvider = ({children}) => {
    const [user, setUser]=useState(null)
    const [role, setRole]=useState(null)
    const [loading, setLoading]=useState(false)

    const navigate=useNavigate()
    const url=import.meta.env.VITE_SERVER_URL
   // populate user afyter refresh and check if he's logged in
   useEffect(()=>{
    const checkAuth= async()=>{
        setLoading(true)
      try {
        const response= await axios.get(`${url}/auth/session/me`)

       console.log(response.data)

        setUser(response.data.user)
        setRole(response.data.user.role)

      }catch(error){
        setUser(null)
        // console.log('Not authenticated')
        // toast.error(error.response?.data?.error || 'Session expired. Please login again.')
        //  navigate('/login')
      }finally{
        setLoading(false)
      }
    }

    checkAuth()
   }, [])


    const Login= async(email, password)=>{
    try{
     const response= await axios.post(`${url}/auth/login`,
        {
          email,
         password
        }
    )

     console.log(response)

     const data=response.data

     const userData= data.data

     setUser(userData)
     setRole(userData.role)
     // to be reused in verify-otp
     localStorage.setItem("pendingUser", JSON.stringify(userData));
     localStorage.setItem("token", userData.token)

     navigate('/verifyOtp')

    }catch(error){
        console.log(error.response.data.error)
       toast.error(error.response?.data?.error || "Login failed.Please try again")
     }
    }

    const Logout= async()=>{

        await axios.post(`${url}/auth/logout`, 
            {}, 
            {withCredentials: true})


        setUser(null)
        setRole(null)
        toast.success('Logged out successfully')
        navigate('/login')
    }

  return (
     <AuthContext.Provider value={{ user, role, Logout, Login, loading}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider