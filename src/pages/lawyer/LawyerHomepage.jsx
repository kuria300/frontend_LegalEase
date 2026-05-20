// src/pages/lawyer/LawyerHomepage.jsx
import { useState } from "react";
import { Users, Clock, TrendingUp, Wallet, CalendarDays, ChevronRight, Circle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../assets/styles/lawyerHomepage.css";

const MOCK_STATS = {
  totalClients: 142,
  pendingRequests: 8,
  activeConsult: 3,
  earnings: 450000,
};

const MOCK_BOOKINGS = [
  {
    id: 1, day: "12", month: "MAY",
    title: "Property Dispute Consultation",
    time: "12:30 AM – 14:00 AM",
    client: "A Client Name",
    status: "new",
  },
  {
    id: 2, day: "12", month: "MAY",
    title: "Contract Review",
    time: "09:00 AM – 12:00 AM",
    client: "A Client Name",
    status: "links",
  },
];

const MOCK_NEW_CLIENTS = [
  { id: 1, name: "Grace Wanjiku", initials: "GW", date: "Today, 9:00 AM"  },
  { id: 2, name: "Peter Otieno",  initials: "PO", date: "Today, 11:30 AM" },
  { id: 3, name: "Mary Kamau",    initials: "MK", date: "Yesterday"        },
];

const MOCK_REQUESTS = [
  {
    id: 1,
    title: "Family Law Query",
    desc: "A client is asking about custody arrangements following a separation agreement.",
    tags: ["In-text", "Follow-up"],
  },
  {
    id: 2,
    title: "Buy/Sell Property",
    desc: "Client needs assistance with registering a new land acquisition form.",
    tags: ["In-text", "Follow-up"],
  },
];

export default function LawyerHomepage() {
  const { user } = useAuth();
  const [stats]    = useState(MOCK_STATS);
  const [bookings] = useState(MOCK_BOOKINGS);
  const [clients]  = useState(MOCK_NEW_CLIENTS);
  const [requests] = useState(MOCK_REQUESTS);

  const advocateName = user?.name || "Advocate Maina";

  return (
    <div className="lh-page">

      {/* Welcome */}
      <div className="lh-welcome">
        <h1 className="lh-welcome-title">Welcome back, {advocateName}</h1>
        <p className="lh-welcome-sub">Here is an overview of your practice today</p>
      </div>

      {/* Top row: 3 mini stats + earnings card */}
      <div className="lh-top-row">
        <div className="lh-mini-stats">
          <MiniStat icon={<Users size={18} color="#3b5bdb" />}    label="Total Clients"    value={stats.totalClients}    bg="#eef2ff" />
          <MiniStat icon={<Clock size={18} color="#f59e0b" />}    label="Pending Requests" value={stats.pendingRequests} bg="#fffbeb" />
          <MiniStat icon={<TrendingUp size={18} color="#12b76a"/>} label="Active Consults"  value={stats.activeConsult}   bg="#ecfdf5" />
        </div>

        <div className="lh-earnings-card">
          <div className="lh-earnings-header">
            <span className="lh-earnings-label">Earnings (KSh)</span>
            <div className="lh-earnings-icon"><Wallet size={16} /></div>
          </div>
          <p className="lh-earnings-amount">
            {stats.earnings.toLocaleString()}
            <span className="lh-earnings-decimal">.00</span>
          </p>
          <p className="lh-earnings-sub">Expected Earnings in 3 Days</p>
        </div>
      </div>

      {/* Bottom 3 columns */}
      <div className="lh-bottom-row">

        {/* Upcoming Bookings */}
        <div className="lh-card">
          <div className="lh-card-header">
            <CalendarDays size={16} className="lh-card-header-icon" />
            <h3 className="lh-card-title">Upcoming Bookings</h3>
          </div>
          <div className="lh-bookings-list">
            {bookings.map((b) => (
              <div key={b.id} className="lh-booking-item">
                <div className="lh-booking-date">
                  <span className="lh-booking-day">{b.day}</span>
                  <span className="lh-booking-month">{b.month}</span>
                </div>
                <div className="lh-booking-info">
                  <p className="lh-booking-title">{b.title}</p>
                  <p className="lh-booking-time">{b.time}</p>
                  <p className="lh-booking-client">{b.client}</p>
                </div>
                <div className="lh-booking-actions">
                  <span className={`lh-badge ${b.status}`}>
                    {b.status === "new" ? "New Client" : "Links"}
                  </span>
                  <button className="lh-booking-more">···</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Clients */}
        <div className="lh-card">
          <div className="lh-card-header">
            <Users size={16} className="lh-card-header-icon" />
            <h3 className="lh-card-title">New Clients</h3>
          </div>
          <div className="lh-clients-list">
            {clients.map((c) => (
              <div key={c.id} className="lh-client-item">
                <div className="lh-client-avatar">{c.initials}</div>
                <div className="lh-client-info">
                  <p className="lh-client-name">{c.name}</p>
                  <p className="lh-client-date">{c.date}</p>
                </div>
                <button className="lh-client-arrow"><ChevronRight size={16} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Requests */}
        <div className="lh-card">
          <div className="lh-card-header">
            <Circle size={16} className="lh-card-header-icon" />
            <h3 className="lh-card-title">Recent Requests</h3>
          </div>
          <div className="lh-requests-list">
            {requests.map((r) => (
              <div key={r.id} className="lh-request-item">
                <p className="lh-request-title">{r.title}</p>
                <p className="lh-request-desc">{r.desc}</p>
                <div className="lh-request-tags">
                  {r.tags.map((t) => <span key={t} className="lh-tag">{t}</span>)}
                </div>
              </div>
            ))}
            <button className="lh-view-all-btn">View All Requests</button>
          </div>
        </div>

      </div>
    </div>
  );
}

function MiniStat({ icon, label, value, bg }) {
  return (
    <div className="lh-mini-stat">
      <div className="lh-mini-stat-icon" style={{ background: bg }}>{icon}</div>
      <div>
        <p className="lh-mini-stat-label">{label}</p>
        <p className="lh-mini-stat-value">{value}</p>
      </div>
    </div>
  );
}