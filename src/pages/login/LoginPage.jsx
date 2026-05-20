import React, { useState } from 'react'
import { Mail, LoaderCircle, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import Legalease from '../../assets/images/Legalease.png'
import Button from '../../components/ui/auth/Button'
import LoginInput from '../../components/ui/auth/LoginInput'
import { useAuth } from '../../hooks/useAuth'

const LoginPage = () => {

  const[email, setEmail]=useState("")
  const [password, setPassword]=useState("")
  const [errors, setErrors]=useState('')
  const [loading, setLaoding]=useState(false)

  const { Login }= useAuth()

  const handleLogin = async(e)=>{
    e.preventDefault()

    setErrors('')

    function validateEmail(email){
        let regex= /^[a-zA-Z0-9.+_%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return regex.test(email)
      }

    if(email.trim() === '' || password.trim() === ''){
      setErrors('All fields are required!')
      return
    }

    if(!validateEmail(email)){
      setErrors('Invalid email credential!')
      return
    }

    if(password.length < 2){
      setErrors('Password must be atleast 2 characters long!')
      return
    }

    try{
      setLaoding(true)

      await Login(email, password)

      console.log('Success')
    }catch(error){
     console.error('Login Error', error)
     setErrors(error.response?.data?.message || "something went Wrong.please try again")
    }finally{
      setLaoding(false)
    }

  }


  return (
    <>
    <div className="login-container">

      <div className="mb-6 flex flex-col items-center">
        <div className="flex items-center gap-2">
           <img src={Legalease} alt='Logo' className='w-28 object-contain' />
        </div>
        <div className="text-center">
          <h1 className="text-[28px] font-bold text-on-surface mb-2">Welcome Back</h1>
          <p className=" text-on-surface-variant">Login to access your account</p>
        </div>
      </div>

      <form onSubmit={handleLogin} className="bg-background p-8 rounded-xl shadow-2xl space-y-4 w-full max-w-md">
         {/* email */}
         <LoginInput 
          placeholder="example@gmail.com"
          name="email"
          id="email"
          type='email'
          icon={<Mail />}
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
         />
        {/* password */}
         <LoginInput 
          placeholder="enter password"
          name="password"
          id="password"
          type='password'
          icon={<LockKeyhole />}
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
         />

          {errors && (<p className="text-on-error-container text-sm">{errors}</p>)}
            
          {/* forgot password */}
          <div className="flex justify-end">
             <a className="text-secondary font-medium hover:underline transition-all" href="#">Forgot Password?</a>
          </div>
           {/* login button */}
          <Button type="submit" disabled={loading} className='w-full'>
            {loading ? <LoaderCircle className='animate-spin mx-auto' />: "Login"}
          </Button>
        
        
      </form>

      <div className='mt-8'>Do not have an account? <Link to='/signup' className='text-secondary hover:underline transition-all'>Signup</Link></div>
    </div>
    
    </>
  )
}

export default LoginPage