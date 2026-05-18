import React from 'react'
import Legalease from '../../assets/images/Legalease.png'
import { Link } from 'react-router-dom'

const HomeNavbar = () => {
  return (
  <header className='home-navbar'>
    <div className="relative flex flex-row items-center w-full h-full">

      <img src={Legalease} alt='Logo' className='size-28 object-contain rounded-3xl' />

      <nav className="hidden sm:flex flex-1 justify-center">
        <ul className="flex flex-row gap-8 items-center">
        <Link to="/find-lawyer">
           <button className="btn-login">Find Lawyers</button>
        </Link>
          <Link to="/about">
           <button className="btn-login">About Us</button>
        </Link>
        </ul>
      </nav>

      <div className='ml-auto flex gap-6 justify-center items-center'>
        <Link to="/Login">
          <button className="btn-login">Login</button>
        </Link>
        <Link to="/signup">
          <button className="btn-sign">Get Started</button>
        </Link>
      </div>

    </div>
    </header>
  )
}

export default HomeNavbar