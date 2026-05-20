import React from 'react';

const RegisterInput = ({
  type = "text",
  name,
  placeholder,
  id,
  label,
  icon,
  className = "",
  value,
  onChange,
  ...props
}) => {
  return (
    <div className='space-y-2'>
      
        <label className="text-on-surface-variant ml-1" htmlFor={id} >{label} </label>

      <div className='relative'>
        
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center text-outline'>
          {icon}
        </div>
        <input
          type={type}
          className={`input pl-10 ${className}`}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}          
          onChange={onChange}    
          {...props}
        />
      </div>

    </div>
  );
};

export default RegisterInput;

{/* <div className='space-y-4'>
            <label className="text-on-surface-variant ml-1" for="username"> Username</label>
             <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-outline">
              <User2Icon />
            </div>
            <input type="text"  
                className="input mt-2" 
                id="username" 
                name="username" 
                placeholder="Enter username" 
                />
          </div>
          </div> */}