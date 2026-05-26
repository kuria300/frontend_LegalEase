 import React, {useState, useEffect} from 'react'
 import Legalease from '../../../assets/images/Legalease.png'
 import { Link } from 'react-router-dom'
 import { User } from 'lucide-react'
 import { useNavigate } from 'react-router-dom'
import { Home, MessageSquare, Scale, LogOut, X, Menu } from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'

const ClientSidebar = () => {
    const navigate = useNavigate();

    const { Logout } = useAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = () => {
      setIsMenuOpen(!isMenuOpen);
    }
    return (
   <aside className="relative w-full md:fixed md:top-0 md:left-0 md:w-64 h-20 md:min-h-screen bg-surface-container-lowest border-b md:border-b-0 md:border-r border-outline-variant/40 p-4 md:p-6 flex md:flex-col justify-between items-center md:items-start gap-4 z-50">

      {/* Top Header Row  */}
      <div className="flex md:flex-col items-center gap-6 w-full flex-1 md:flex-initial justify-between md:justify-start">
        <img src={Legalease} alt="Logo" className="w-20 md:w-28 object-contain" />
        
        {/* Hidden on Mobile */}
        <div className="hidden md:flex w-full justify-start items-center md:px-3">
          <div 
            onClick={() => navigate('/client/profile')}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-outline-variant/40 bg-surface text-on-surface cursor-pointer hover:bg-surface-variant/20 transition-all shrink-0"
          >
            <User size={18} />
          </div>
          <span className="ml-3 text-sm font-medium text-on-surface cursor-pointer" onClick={() => navigate('/client/profile')}>
             My Profile
          </span>
        </div>

        {/* Hidden on Mobile */}
        <nav className="hidden md:flex flex-col w-full">
          <ul className="flex flex-col gap-2 w-full">
            <li className="w-full">
              <Link to="/client-dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-surface-variant/60 text-on-surface-variant hover:text-primary">
                <Home size={20} />
                <span>Home</span>
              </Link>
            </li>
            <li className="w-full">
              <Link to="/chat" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-surface-variant/60 text-on-surface-variant hover:text-primary">
                <MessageSquare size={20} />
                <span>Chat</span>
              </Link>
            </li>
            <li className="w-full">
              <Link to="/find-lawyers" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-surface-variant/60 text-on-surface-variant hover:text-primary">
                <Scale size={20} />
                <span>Lawyers</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Visible on Mobile */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-on-surface hover:bg-surface-variant/20 rounded-xl md:hidden transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Hidden on Mobile */}
      <div className="hidden md:flex w-full flex-col gap-6">
        <div className="border-t border-outline-variant w-full"/>
        <button 
         onClick={Logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-colors"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>

      {/*  Hidden on Desktop */}
      {isMenuOpen && (
        <nav className="md:hidden absolute top-20 left-0 w-full bg-primary-container border-2 border-outline-variant/40 p-6 z-40 backdrop-blur-sm">
          <ul className="flex flex-col gap-6 text-white text-base font-medium">
            <li>
              <Link to="/client-dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                <Home size={18} /> Home
              </Link>
            </li>
            <li>
              <Link to="/chat" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                <MessageSquare size={18} /> Chat
              </Link>
            </li>
            <li>
              <Link to="/find-lawyers" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                <Scale size={18} /> Lawyers
              </Link>
            </li>
            <li>
              <Link to="/client/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                <User size={18} /> Profile
              </Link>
            </li>

            {/* Bottom Actions inside the Mobile Dropdown */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
          
              <button 
               onClick={Logout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </ul>
        </nav>
      )}
      
    </aside>
  );
};

    export default ClientSidebar
