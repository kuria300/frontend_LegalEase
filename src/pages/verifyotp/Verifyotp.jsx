import React from 'react'
import Legalease from '../../assets/images/Legalease.png'
import Button from '../../components/ui/Button'
import { Link } from 'react-router-dom'

const Verifyotp = () => {
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

            <form className='w-full flex flex-col gap-6'>
              <div className='flex justify-center gap-6 sm:gap-3 mb-8'>
                {Array(6).fill(0).map((_, index)=>(
                 <input 
                  key={index}
                  aria-label={`Digit ${index + 1}`}
                  className='otp-input'
                  maxLength="1"
                  type='text'
                 />

                ))}
              </div>

              <Button className='w-96 mx-auto'>
                Verify & Continue
              </Button>

               <div className='mt-2 flex items-center justify-center cursor-pointer mb-4'>
                Didn't receive the code? <Link to='/signup' className='text-secondary hover:underline transition-all ml-1'>Resend Code</Link>
              </div>
            </form>

        </div>
     </section>
    </>
  )
}

export default Verifyotp