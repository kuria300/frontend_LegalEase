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
import { useAuth } from "../../context/AuthContext";
import "../../assets/styles/lawyerDashboard.css";

const TOP_NAV = [
  { to: "/lawyer",               icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/lawyer/consultations", icon: CalendarDays,    label: "Bookings"             },
  { to: "/lawyer/profile",       icon: User,            label: "Profile"              },
];

const BOTTOM_NAV = [
  { to: "/lawyer/settings", icon: Settings,   label: "Settings" },
  { to: "/lawyer/support",  icon: HelpCircle, label: "Support"  },
];

export default function LawyerDashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AM";

  return (
    <div className="ld-shell">
      {mobileOpen && (
        <div className="ld-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`ld-sidebar ${mobileOpen ? "mobile-open" : ""}`}>

        
        {/* Logo */}
<div className="ld-logo">
  <img 
    src="/src/assets/images/Legalease.png" 
    alt="LegalEase" 
    className="ld-logo-img"
  />
</div>


        {/* Profile block */}
        <div className="ld-profile-block">
          <div className="ld-avatar-ring">
            <div className="ld-avatar">{initials}</div>
          </div>
          <div className="ld-profile-info">
            <p className="ld-profile-name">{user?.name || "Advocate Maina"}</p>
            <p className="ld-profile-role">Legal Practitioner</p>
          </div>
        </div>

        {/* Top nav */}
        <nav className="ld-nav top">
          {TOP_NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) => `ld-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="ld-spacer" />

        {/* Bottom nav */}
        <nav className="ld-nav bottom">
          {BOTTOM_NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to} to={to}
              className={({ isActive }) => `ld-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
          <button className="ld-nav-item logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </nav>

      </aside>

      {/* MAIN */}
      <div className="ld-main">
        <main className="ld-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}