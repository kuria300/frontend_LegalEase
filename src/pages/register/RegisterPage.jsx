import React from 'react'
import Legalease from '../../assets/images/Legalease.png'
import { Mail, LockKeyhole, User2Icon, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import RegisterInput from '../../components/ui/RegisterInput'

const RegisterPage = () => {
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
          <div className="flex p-1 bg-surface-container rounded-xl" id="role-selector">
             <button className="client-btn">
                Client
            </button>
            <button className="lawyer-btn">
                Lawyer
            </button>
          </div>
        </div>
 
       <form className="bg-background p-6 rounded-xl shadow-2xl space-y-4 w-full max-w-md">
         {/* username field */}
          <RegisterInput
            type="text"
            id="username"
            name="username"
            label="Username"
            className='mt-2'
            placeholder="Enter username"
            icon={<User2Icon />}
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
          />
          {/* create button */}
          <Button>
            Create Account
          </Button>


          <div className='mt-2 flex items-center justify-center'>Already have an account? <Link to='/login' className='text-secondary hover:underline transition-all'>Login</Link></div>
        </form>

      </div>
    </div>
      
    </>
  )
}

export default RegisterPage