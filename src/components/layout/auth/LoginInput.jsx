import React from 'react'
import { Mail, LockKeyhole } from 'lucide-react'


const LoginInput = ({type="text",name, placeholder, icon, className="", ...props}) => {
  return (
    <>
     <div className='relative'>

        {icon && (
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center text-outline'>
            {icon}
          </div>
        )}

        <input 
          type={type}
          name={name}
          placeholder={placeholder}
          className={`input ${icon ? 'pl-10' : ''} ${className}`}
          {...props}

        />

     </div>
     
    </>
  )
}

export default LoginInput


{/* <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-outline">
              <LockKeyhole />
            </div>
            <input type="password"  
                className="input" 
                id="password" 
                name="password" 
                placeholder="enter password" 
                required
                />
          </div> */}