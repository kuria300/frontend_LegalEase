// src/pages/lawyer/LawyerHomepage.jsx
import { useState, useEffect } from "react";
import { Users, Clock, TrendingUp, Wallet, CalendarDays, ChevronRight } from "lucide-react";
import { getLawyerDashboardSummary } from "../../services/lawyerService.jsx";

export default function LawyerHomepage() {
  const [stats,    setStats]    = useState({ totalClients: 0, pendingRequests: 0, activeConsult: 0, earnings: 0 });
  const [bookings, setBookings] = useState([]);
  const [clients,  setClients]  = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // TODO: replace with real name from AuthContext when teammate integrates
  const advocateName = "Advocate Maina";

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        // TODO: replace with real lawyer_id from AuthContext
        const lawyerId = localStorage.getItem("legalease_lawyer_id")
          || "e4d02eba-f313-421a-85b0-1ed07298ef9c";

        const data = await getLawyerDashboardSummary(lawyerId);
        const { upcoming_bookings, recent_completed_bookings, lawyer_profile } = data;

        setStats({
          totalClients:    recent_completed_bookings?.length || 0,
          pendingRequests: upcoming_bookings?.filter((b) => b.booking_status === "PENDING").length   || 0,
          activeConsult:   upcoming_bookings?.filter((b) => b.booking_status === "CONFIRMED").length || 0,
          earnings:        lawyer_profile?.consultation_fee
            ? lawyer_profile.consultation_fee * (recent_completed_bookings?.length || 0)
            : 0,
        });

        if (upcoming_bookings?.length > 0) {
          setBookings(upcoming_bookings.map((b) => ({
            id:     b.id,
            day:    new Date(b.booking_date).getDate().toString().padStart(2, "0"),
            month:  new Date(b.booking_date).toLocaleString("en-KE", { month: "short" }).toUpperCase(),
            title:  b.notes || "Consultation",
            time:   new Date(b.booking_time).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" }),
            client: b.meeting_type || "Google Meet",
            status: b.booking_status === "CONFIRMED" ? "confirmed" : "new",
          })));
        }

        if (recent_completed_bookings?.length > 0) {
          setClients(recent_completed_bookings.slice(0, 5).map((b) => ({
            id:       b.id,
            name:     b.user_id || "Client",
            initials: "CL",
            date:     new Date(b.booking_date).toLocaleDateString("en-KE", {
              day: "numeric", month: "short"
            }),
          })));
        }

      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError("Could not connect to server. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#3b5bdb] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#f0f2f5] text-[#101828] antialiased p-6 md:p-8 flex flex-col">

      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#101828]">
          Welcome back, {advocateName}
        </h1>
        <p className="text-xs md:text-sm text-[#667085] mt-1">
          Here is an overview of your work today
        </p>
        {error && (
          <p className="text-xs text-amber-600 mt-1 bg-amber-50 px-3 py-1 rounded-md inline-block">
            {error}
          </p>
        )}
      </div>

      {/* TOP: 3 mini stats + earnings card */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8 items-start">
        <div className="xl:col-span-3 flex flex-col gap-4 w-full">
          <MiniStat icon={<Users size={18} className="text-[#3b5bdb]" />}       label="TOTAL CLIENTS"    value={stats.totalClients}    bg="bg-[#f0f4ff]" />
          <MiniStat icon={<Clock size={18} className="text-amber-500" />}        label="PENDING REQUESTS" value={stats.pendingRequests} bg="bg-amber-50"   />
          <MiniStat icon={<TrendingUp size={18} className="text-emerald-500" />} label="ACTIVE CONSULTS"  value={stats.activeConsult}   bg="bg-emerald-50" />
        </div>

        <div className="bg-[#0b1b3d] text-white border border-[#162a54] rounded-[14px] p-6 shadow-md relative overflow-hidden flex flex-col justify-between h-[230px] xl:h-full w-full shrink-0">
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full translate-x-4 -translate-y-4" />
          <div className="absolute right-6 top-8 w-16 h-16 bg-white/5 rounded-full translate-x-4" />
          <div className="flex items-center justify-between z-10">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Earnings (KSh)</span>
            <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center text-amber-300">
              <Wallet size={14} />
            </div>
          </div>
          <div className="my-auto z-10">
            <p className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-none">
              {stats.earnings.toLocaleString()}
              <span className="text-xl font-semibold text-slate-400">.00</span>
            </p>
          </div>
          <div className="text-xs text-slate-400 font-medium z-10 pt-2 border-t border-white/5">
            Expected Earnings in 3 Days
          </div>
        </div>
      </div>

      {/* BOTTOM: 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 1. Upcoming Bookings */}
        <div className="bg-white border border-[#e4e7ec] rounded-[14px] p-5 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#e4e7ec]">
            <CalendarDays size={16} className="text-[#667085]" />
            <h3 className="font-bold text-sm text-[#101828]">Upcoming Bookings</h3>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            {bookings.length === 0 ? (
              <p className="text-xs text-[#667085] text-center py-6">No upcoming bookings</p>
            ) : bookings.map((b) => (
              <div key={b.id} className="flex items-start gap-4 p-3 rounded-[10px] border border-[#e4e7ec] bg-white hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col items-center justify-center bg-[#3b5bdb] text-white rounded-lg p-2 min-w-[50px] shrink-0 font-bold">
                  <span className="text-sm leading-none">{b.day}</span>
                  <span className="text-[9px] tracking-wider uppercase text-indigo-100 mt-1">{b.month}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#101828] truncate">{b.title}</p>
                  <p className="text-[11px] text-[#667085] mt-0.5">{b.time}</p>
                  <p className="text-[11px] text-[#667085] mt-1 font-medium">{b.client}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase border shrink-0 ${
                  b.status === "new"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-blue-50 text-blue-600 border-blue-100"
                }`}>
                  {b.status === "new" ? "New" : "Confirmed"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Recent Clients */}
        <div className="bg-white border border-[#e4e7ec] rounded-[14px] p-5 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#e4e7ec]">
            <Users size={16} className="text-[#667085]" />
            <h3 className="font-bold text-sm text-[#101828]">Recent Clients</h3>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            {clients.length === 0 ? (
              <p className="text-xs text-[#667085] text-center py-6">No recent clients</p>
            ) : clients.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-3 px-2 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 rounded-md transition-colors group">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3b5bdb] to-[#6e8efb] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {c.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#101828] truncate group-hover:text-[#3b5bdb] transition-colors">{c.name}</p>
                    <p className="text-[11px] text-[#667085] mt-0.5">{c.date}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Recent Requests */}
        <div className="bg-white border border-[#e4e7ec] rounded-[14px] p-5 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#e4e7ec]">
            <span className="w-3 h-3 rounded-full bg-[#3b5bdb] opacity-80 shrink-0" />
            <h3 className="font-bold text-sm text-[#101828]">Recent Requests</h3>
          </div>
          <div className="flex flex-col gap-4 flex-1 justify-between">
            <div className="flex flex-col gap-4">
              {requests.length === 0 ? (
                <p className="text-xs text-[#667085] text-center py-6">No recent requests</p>
              ) : requests.map((r) => (
                <div key={r.id} className="pb-3 border-b border-slate-100 last:border-0">
                  <p className="text-xs font-bold text-[#101828]">{r.title}</p>
                  <p className="text-[11px] text-[#667085] mt-1 leading-relaxed">{r.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {(r.tags || []).map((t) => (
                      <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#667085] border border-slate-200 uppercase tracking-wide">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-2 py-2.5 px-4 bg-white border border-[#e4e7ec] text-[#3b5bdb] hover:bg-[#f0f4ff] rounded-md text-xs font-semibold transition-colors shadow-sm cursor-pointer">
              View All Requests
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function MiniStat({ icon, label, value, bg }) {
  return (
    <div className="bg-white border border-[#e4e7ec] rounded-[14px] p-5 shadow-sm flex items-center w-full h-20">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
        <div>
          <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-[#101828] mt-0.5 tracking-tight leading-none">{value}</p>
        </div>
      </div>
    </div>
  );
}