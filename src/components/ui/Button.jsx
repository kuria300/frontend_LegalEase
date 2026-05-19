import React from 'react'

const Button = ({children, type="button", className="", ...props}) => {
  return (
   <>
   <button 
   type={type}
   className={`bg-primary text-white w-full px-6 py-3 rounded-lg hover:bg-primary-container ${className}`}
   {...props}
   >
    {children}
   </button>
   
   </>
  )
}

export default Button