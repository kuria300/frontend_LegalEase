import React, { useRef, useState, useEffect } from 'react'
import Legalease from '../../assets/images/Legalease.png'
import Button from '../../components/ui/auth/Button'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Verifyotp = () => {
   const [loading, setLoading]=useState(false)
   const [error, setError]=useState('')
   const [resend, setResend]=useState(false)

   const url =import.meta.env.VITE_SERVER_URL

   const navigate= useNavigate()
    const inputRef = useRef([])
    const location = useLocation()


  //get email from localstorage to verify-otp
   const user= JSON.parse(localStorage.getItem('pendingUser'))
   const emailData= user?.email

   //protect route
   useEffect(() => {
        const token = localStorage.getItem('token')

        if (token) {
          navigate('/dashboard', { replace: true })
          return
        }
        if (!emailData) {
          navigate('/login', { replace: true })
        }
      }, [])
   
  // for verifying otp
   const submitOtp = async(otpString) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await axios.post(`${url}/auth/verify-otp`, 
        {
         email: emailData,
         otp: otpString
        }
      )

      console.log(response.data)

      const data = response.data

      setLoading(false)
 
      navigate('/dashboard', { replace: true })
      localStorage.removeItem('pendingUser')
      localStorage.setItem("token", data.token)
      toast.success('Login successful')
      
    } catch (err) {
      console.log(err.response.data.error)
      toast.error(err.response?.data?.error || 'Invalid verification code. Please try again.')
      setOtp(new Array(6).fill(''))
      inputRef.current[0]?.focus() 
    } finally {
      setLoading(false)
    }
  }

//  for resending otp
  const handleResendCode = async() => {
  if(!emailData){
      toast.error('No email found. Please login again.')
      navigate('/login')
      return
  }

    setResend(true)
    try {
      const response=await axios.post(`${url}/auth/send-otp`, 
        {
         email: emailData,
        }
      )
      toast.success(response.data.message || 'Verification code resent successfully. Kindly check your email')
    } catch (err) {
      console.log(err.response.data.error)
      toast.error(err.response?.data?.error || 'Failed to resend code. Please try again.')
    } finally {
      setResend(false)
    }
  }



  // create an empty array with 6 digits ['', '', '','','','']
  const [otp , setOtp]= useState(new Array(6).fill(''))
  // stores all the 6 otp numbers

  //we use ? due to 0 or 1 times allows only 1 or 0 digit ina box thus  can backspace
   const handleChnge = (value, index) => {
    let regEx = /^[0-9]?$/
    if (!regEx.test(value)) return;

    const newOtp = [...otp]; // make copy of array
    newOtp[index] = value; // replace with fresh number user typed in
    setOtp(newOtp);

    // handles when user adds into input (moves forward)
    if (value && index < 5) {
      inputRef.current[index + 1]?.focus()
    }
  }

  // handles when user goes back using backspace
  const handleKey = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRef.current[index - 1]?.focus()
      }
    }
  }

  const handlePaste = (e) => {
    // Intercept clipboard data
    const pastedText = e.clipboardData.getData("text");
    const pasted = pastedText.slice(0, 6).split("");

    console.log(pasted)

    const newOtp = [...otp]
    pasted.forEach((char, index) => {
      if (index < 6 && /^[0-9]$/.test(char)) {
        newOtp[index] = char;
      }
    })

    setOtp(newOtp)

    // check how many numbers user pasted if 6 or > 6 focus 5 else that number
    const lastIndex = pasted.length >= 6 ? 5 : pasted.length;
    inputRef.current[lastIndex]?.focus();
  }

  // handle onsubmit of code
   const handleOtp = (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");
    if (finalOtp.length === 6) {

      submitOtp(finalOtp)
    } else {
      setError('Please fill out all 6 digits.')
      return
    }

    // console.log("OTP:", finalOtp);
  };
  return (
    <>
     <section className='min-h-screen flex items-center justify-center px-4'>
        <div className='w-full max-w-md border border-surface-container-highest rounded-2xl shadow-2xl'>
            {/* logo  */}
            <div className='flex flex-col items-center pt-6 pb-6 px-8'>
                <div className="flex items-center gap-2">
                    <img src={Legalease} alt='Logo' className='w-28 object-contain' />
                </div>
                <div className="text-center">
                    <h1 className="text-[28px] font-bold text-on-surface mb-2">Verify Your Email</h1>
                    <p className=" text-on-surface-variant mb-6">We've sent a 6-digit verification code to your email. 
                        Please enter it below to activate your account.
                    </p>
                </div>
            </div>

            <form onSubmit={handleOtp} className='w-full flex flex-col gap-6'>
              <div className='flex justify-center gap-6 sm:gap-3 mb-6'>
                {otp.map((Digit, index)=>(
                 <input 
                  key={index}
                  aria-label={`Digit ${index + 1}`}
                  className='otp-input'
                  maxLength="1"
                  type='text'
                  onChange={(e)=>handleChnge(e.target.value, index)}
                  onKeyDown={(e) => handleKey(e, index)}
                  onPaste={handlePaste}
                  //mobile phones keypad
                  inputMode='numeric'
                  value={Digit}
                  ref={(el) => (inputRef.current[index] = el)}
                 />

                ))}
              </div>

              <Button type="submit" disabled={loading || resend} className='w-96 mx-auto'>
                {loading ? <LoaderCircle className='animate-spin mx-auto'/>: "Verify & Continue"}
              </Button>

               <div className='mt-2 flex items-center justify-center cursor-pointer mb-4'>
                Didn't receive the code?
                <button
                  type="button" 
                  disabled={loading || resend}
                  onClick={handleResendCode}
                  className='text-secondary font-semibold hover:underline transition-all ml-1 disabled:opacity-50 disabled:no-underline'
                >
                  {resend ? <LoaderCircle className='animate-spin'/> : 'Resend Code'}
                </button>
              </div>
            </form>

        </div>
     </section>
    </>
  )
}

export default Verifyotp