import React, { useState } from 'react'
import { Mail, LoaderCircle, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import Legalease from '../../assets/images/Legalease.png'
import Button from '../../components/ui/Button'
import LoginInput from '../../components/ui/LoginInput'

const LoginPage = () => {
  const [email, setEmail]=useState('')
  const [password, setPassword]=useState('')
  const [loading, setLoading]=useState(false)
  const [errors, setErrors]=useState('')

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

      <form className="bg-background p-8 rounded-xl shadow-2xl space-y-4 w-full max-w-md">
         {/* email */}
         <LoginInput 
          placeholder="example@gmail.com"
          name="email"
          id="email"
          type='email'
          icon={<Mail />}
         />
        {/* password */}
         <LoginInput 
          placeholder="enter password"
          name="password"
          id="password"
          type='password'
          icon={<LockKeyhole />}
         />
         
          {/* forgot password */}
          <div class="flex justify-end">
             <a class="text-secondary font-medium hover:underline transition-all" href="#">Forgot Password?</a>
          </div>
           {/* login button */}
          <Button>
            Login
          </Button>
        
        
      </form>

      <div className='mt-8'>Do not have an account? <Link to='/signup' className='text-secondary hover:underline transition-all'>Signup</Link></div>
    </div>
    
    </>
  )
}

export default LoginPage