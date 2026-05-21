// src/components/layout/LawyerDashboardLayout.jsx
import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

const TOP_NAV = [
  { to: "/lawyer",               icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/lawyer/consultations", icon: CalendarDays,    label: "Bookings"             },
  { to: "/lawyer/profile",       icon: User,            label: "Profile"              },
];

const BOTTOM_NAV = [
  { to: "/lawyer/settings", icon: Settings,   label: "Settings" },
  { to: "/lawyer/support",  icon: HelpCircle, label: "Support"  },
];

// TODO: replace with real auth when teammate integrates AuthContext
const MOCK_USER = { name: "Advocate Maina" };

export default function LawyerDashboardLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = "AM";
  const handleLogout = () => navigate("/login");

  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/45 z-[99] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-[200px]
        bg-white border-r border-[#e4e7ec]
        flex flex-col z-[100] pb-4
        transition-transform duration-250
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}>

        {/* Logo */}
        <div className="flex items-center px-4 py-4 border-b border-[#e4e7ec] min-h-[60px]">
          <img
            src="/src/assets/images/Legalease.png"
            alt="LegalEase"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Profile block */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e4e7ec]">
          <div className="w-[38px] h-[38px] rounded-full border-2 border-[#3b5bdb] p-[2px] shrink-0">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#3b5bdb] to-[#6e8efb] flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-[0.8rem] font-semibold text-[#101828] truncate">{MOCK_USER.name}</p>
            <p className="text-[0.7rem] text-[#667085] mt-[1px]">Legal Practitioner</p>
          </div>
        </div>

        {/* Top nav */}
        <nav className="flex flex-col gap-[2px] px-[10px] py-2">
          {TOP_NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-[10px] px-[10px] py-[9px] rounded-md text-[0.83rem] font-medium no-underline transition-colors
                ${isActive
                  ? "bg-[#f0f4ff] text-[#3b5bdb] font-semibold border-l-[3px] border-[#3b5bdb]"
                  : "text-[#344054] hover:bg-[#f5f7ff] hover:text-[#3b5bdb]"
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom nav */}
        <nav className="flex flex-col gap-[2px] px-[10px] py-2">
          {BOTTOM_NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-[10px] px-[10px] py-[9px] rounded-md text-[0.83rem] font-medium no-underline transition-colors
                ${isActive
                  ? "bg-[#f0f4ff] text-[#3b5bdb] font-semibold"
                  : "text-[#344054] hover:bg-[#f5f7ff] hover:text-[#3b5bdb]"
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}

          {/* Sign out */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-[10px] px-[10px] py-[9px] rounded-md text-[0.83rem] font-medium text-[#344054] hover:bg-red-50 hover:text-red-500 transition-colors w-full text-left border-none bg-transparent cursor-pointer"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </nav>

      </aside>

      {/* MAIN */}
      <div className="flex-1 ml-0 md:ml-[200px] flex flex-col min-h-screen">

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center px-4 py-3 bg-white border-b border-[#e4e7ec]">
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="p-2 rounded-md text-[#344054] hover:bg-[#f0f2f5] border-none bg-transparent cursor-pointer"
          >
            <span className="text-xl">☰</span>
          </button>
        </div>

        <main className="flex-1 p-7">
          <Outlet />
        </main>
      </div>

    </div>
  );
}