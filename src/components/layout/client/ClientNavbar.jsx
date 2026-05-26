import React, { useState } from "react";
import Legalease from "../../../assets/images/Legalease.png";
import { Link } from "react-router-dom";
import { Menu, X, Home, MessageSquare, Scale, User, LogOut } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";

const ClientNavbar = () => {
  const {Logout}=useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative w-full h-20 bg-surface-container-lowest border-b border-outline-variant/40 px-14 flex items-center">
      
      <div className="flex items-center w-full">

        {/* Logo */}
        <img
          src={Legalease}
          alt="Logo"
          className="size-28 object-contain rounded-2xl"
        />

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex items-center gap-8 text-sm font-medium text-on-surface-variant">
            
            <li>
              <Link
                to="/client-dashboard"
                className="hover:text-primary transition"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/chat"
                className="hover:text-primary transition"
              >
                Chat
              </Link>
            </li>

            <li>
              <Link
                to="/find-lawyers"
                className="hover:text-primary transition"
              >
                Lawyers
              </Link>
            </li>

            <li>
              <Link
                to="/client/profile"
                className="hover:text-primary transition"
              >
                Profile
              </Link>
            </li>
          </ul>
        </nav>

        {/* Desktop Actions */}
        <Link to="/client/profile" className="hidden md:flex ml-auto">
          <button className="flex items-center justify-center w-10 h-10 rounded-full border border-outline-variant/80 bg-surface text-on-surface cursor-pointer hover:bg-surface-variant/20 transition-all shrink-0">
            <User size={16} />
          </button>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden ml-auto"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-on-surface" />
          ) : (
            <Menu className="w-6 h-6 text-on-surface" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <nav className="md:hidden absolute top-20 left-0 w-full bg-primary-container border-2 border-outline-variant/40 p-6 z-40 backdrop-blur-sm">
          
          <ul className="flex flex-col gap-6 text-white text-base font-medium">
            
            <li>
              <Link
                to="/client-dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <Home size={18} /> Home
              </Link>
            </li>

            <li>
              <Link
                to="/chat"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <MessageSquare size={18} /> Chat
              </Link>
            </li>

            <li>
              <Link
                to="/find-lawyers"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <Scale size={18} /> Lawyers
              </Link>
            </li>

            <li>
              <Link
                to="/client/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <User size={18} /> Profile
              </Link>
            </li>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <button onClick={Logout} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">
                <LogOut size={16} /> Sign Out
              </button>
            </div>

          </ul>
        </nav>
      )}
    </header>
  );
};

export default ClientNavbar;