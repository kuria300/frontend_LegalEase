import React, { useState } from 'react'
import Legalease from '../../assets/images/Legalease.png'
import { Mail, LockKeyhole, User2Icon, UserIcon, Shield, Calendar, LoaderCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../../components/layout/auth/Button'
import RegisterInput from '../../components/layout/auth/RegisterInput'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const RegisterPage = () => {
  const [email, setEmail]=useState("")
  const [password, setPassword]=useState("")
  const [confirmPassword, setConfirmPassword]=useState("")
  const [firstName, setFirstName]=useState("")
  const [secondName, setSecondName]=useState("")
  const [dob ,setDob]=useState("")
  const [errors, setErrors]=useState('')
  const [role, setRole]=useState("CLIENT")
  const [loading, setLoading]=useState(false)

  const url=import.meta.env.VITE_SERVER_URL

  const navigate= useNavigate()

  const handleRegister = async(e)=>{
    e.preventDefault()

    setErrors('')

    try{
      setLoading(true)

       function validateEmail(email){
        let regex= /^[a-zA-Z0-9.+_%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return regex.test(email)
      }

      if(firstName.trim() === '' || secondName.trim() === '' || email.trim() === '' 
         || password.trim() === '' || confirmPassword.trim() === '' || dob.trim() === ''){
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

      if(password !== confirmPassword){
        setErrors('Passwords do not match!')
        return
      }

      const response= await axios.post(`${url}/auth/register`,
        {
          first_name: firstName,
          second_name: secondName,
          email,
          password,
          dob,
          role
        }
    )
     console.log(response)
     localStorage.setItem('pendingUser', JSON.stringify(response.data.userId))
     setEmail('')
     setPassword('')
     setConfirmPassword('')
     setFirstName('')
     setSecondName('')
     setDob('')

     if(role === 'CLIENT'){
       navigate('/login')
       toast.success(response.data.message || 'Registration successful! Please login.')
       
     } else {
       navigate('/apply')
       toast.success('Registration successful! Please complete your lawyer application.')
     }

    }catch(error){
     if(error.response){
      console.error('Registration Error', error.response.data)
      setErrors(error.response.data.error || "Registration failed. Please try again.")
     }
    }finally{
      setLoading(false)
    }
  }

  return (
    <>
    <div className='w-full max-w-md mx-auto m-20'>
      <div className='border border-surface-container-highest rounded-2xl shadow-2xl'>
       {/* logo  */}
        <div className='flex flex-col items-center pt-6 pb-6 px-8'>
           <div className="flex items-center gap-2">
             <img src={Legalease} alt='Logo' className='w-28 object-contain' />
           </div>
           <div className="text-center">
            <h1 className="text-[28px] font-bold text-on-surface mb-2">Create Your Account</h1>
            <p className=" text-on-surface-variant">Join Legalease to access legal guidance</p>
          </div>
        </div>
      {/* role selection */}
        <div className='px-3'>
          <div className="flex p-1 bg-surface-container rounded-xl">
            {/* CLIENT BUTTON */}
             <button
              type="button"
              onClick={() => setRole("CLIENT")}
              className={`flex-1 py-2 rounded-lg transition-all ${
                  role === "CLIENT"
                    ? "bg-primary text-white"
                    : "bg-transparent text-on-surface" }`}> Client </button>

            {/* LAWYER BUTTON */}
            <button
              type="button"
              onClick={() => setRole("LAWYER")}
              className={`flex-1 py-2 rounded-lg transition-all ${
                  role === "LAWYER"
                    ? "bg-primary text-white"
                    : "bg-transparent text-on-surface"}`}>Lawyer </button>
          </div>
        </div>
 
       <form onSubmit={handleRegister} className="bg-background p-6 rounded-xl shadow-2xl space-y-4 w-full max-w-md">
         {errors && <div className='text-on-error-container'>{errors}</div>}
         {/* username field */}
          <RegisterInput
            type="text"
            id="first_name"
            name="first_name"
            label="First Name"
            className='mt-2'
            placeholder="Enter first name"
            icon={<User2Icon />}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
           <RegisterInput
            type="text"
            id="second_name"
            name="second_name"
            label="second_name"
            className='mt-2'
            placeholder="Enter second_name"
            icon={<UserIcon />}
            value={secondName}
            onChange={(e) => setSecondName(e.target.value)}
          />
          {/* email field */}
          <RegisterInput
            type="email"
            id="email"
            name="email"
            label="email"
             className='mt-2'
            placeholder="Enter email"
            icon={<Mail />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
         {/* password field */}
        <RegisterInput
          type="password"
          id="password"
          name="password"
          label="password"
          className='mt-2'
          placeholder="Create password"
          icon={<LockKeyhole />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
         {/* confirm pasword field */}
         <RegisterInput
            type="password"
            id="confirm-password"
            name="confirm-password"
            label="confirm password"
            className='mt-2'
            placeholder="Confirm password"
            icon={<Shield />}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <RegisterInput
            type="date"
            id="date-of-birth"
            name="date-of-birth"
            label="Date of Birth"
            className='mt-2'
            placeholder="Enter date of birth"
            icon={<Calendar />}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          
          {/* create button */}
          <Button type="submit" className='w-full rounded-lg ' disabled={loading}>
            {loading ? <LoaderCircle className='animate-spin mx-auto'/> : "Create Account"}
          </Button>


          <div className='mt-2 flex items-center justify-center'>Already have an account? <Link to='/login' className='text-secondary hover:underline transition-all ml-1'>Login</Link></div>
        </form>

      </div>
    </div>
      
    </>
  )
}

export default RegisterPage