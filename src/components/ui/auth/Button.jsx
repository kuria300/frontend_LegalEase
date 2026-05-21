import React from 'react'

const Button = ({children, type="button", className="", ...props}) => {
  return (
   <>
   <button 
   type={type}
   className={`bg-primary text-white px-6 py-3 hover:bg-primary-container transition-all cursor-pointer ${className}`}
   {...props}
   >
    {children}
   </button>
   
   </>
  )
}

export default Button