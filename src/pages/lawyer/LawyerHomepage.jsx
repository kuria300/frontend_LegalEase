import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Clock,
  TrendingUp,
  Wallet,
  Calendar,
  ChevronRight,
  X,
} from "lucide-react";
import LawyerSidebar from "../../components/layout/lawyers/LawyerSidebar.jsx";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { formatTime } from "../../utils/displayTime.js";
import Legalease from "../../assets/images/Legalease.png";
import { toast } from "react-toastify";
import { baseUrl } from "../../config/Baseurl.js";


const VALID_SLOTS = [
  "08:00", "08:30",
  "09:00", "09:30",
  "10:00", "10:30",
  "11:00", "11:30",
  "12:00", "12:30",
  "13:00", "13:30",
  "14:00", "14:30",
  "15:00", "15:30",
  "16:00", "16:30",
];

function MiniStat({ icon, label, value, bg }) {
  return (
    <div className="bg-white border border-[#e4e7ec] rounded-[14px] p-5 shadow-sm flex items-center w-full h-20">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-[#101828] mt-0.5 tracking-tight leading-none">{value}</p>
        </div>
      </div>
    </div>
  );
}

//Reschedule Modal

function LawyerReschedule({ isOpen, onClose, currentBooking, onUpdate }) {
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentBooking) {
      setBookingDate(
        currentBooking.booking_date
          ? new Date(currentBooking.booking_date).toISOString().split("T")[0]
          : ""
      );
      setBookingTime(currentBooking.booking_time || "");
    }
  }, [currentBooking]);

  if (!isOpen || !currentBooking) return null;

  //(no past dates)
  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!bookingDate || !bookingTime) {
      toast.error("Please select both a date and time.");
      return;
    }
    setIsSubmitting(true);
    await onUpdate({ bookingDate, bookingTime });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-bold text-on-surface mb-1">Reschedule Consultation</h2>
        <p className="text-sm text-on-surface-variant mb-6">
          Select a new date and time for this consultation.
        </p>

        {/* Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-on-surface mb-1.5">
            New Date
          </label>
          <input
            type="date"
            min={todayStr}
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            className="w-full border border-outline-variant rounded-lg px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
          />
        </div>

        {/* Time */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-on-surface mb-1.5">
            New Time
          </label>
          <select
            value={bookingTime}
            onChange={(e) => setBookingTime(e.target.value)}
            className="w-full border border-outline-variant rounded-lg px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition bg-white"
          >
            <option value="">Select a time slot</option>
            {VALID_SLOTS.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-outline-variant text-sm font-medium text-on-surface hover:bg-surface-variant/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Confirm Reschedule"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Component

export default function LawyerHomepage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [allBookings, setAllBookings] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reschedule modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [page] = useState(1);
  const [limit] = useState(50);

  const { url }=baseUrl()

  useEffect(() => {
    if (authLoading) return;

    const fetchBookings = async () => {
      try {
        setDashboardLoading(true);
        setError(null);

        const response = await axios.get(`${url}/api/bookings/lawyer`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: { page, limit },
        });

        const data = response.data.data || [];
        setAllBookings(data);
      } catch (err) {
        console.error("Failed to load lawyer dashboard:", err);
        setError("Could not load bookings. Please refresh.");
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchBookings();
  }, [authLoading, page, limit]);

  // Start of today (midnight) for date comparisons
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const upcomingBookings = allBookings
    .filter((b) => {
      const isActiveStatus =
        b.booking_status === "CONFIRMED" || b.booking_status === "PENDING";
      const bookingDay = new Date(b.booking_date);
      bookingDay.setHours(0, 0, 0, 0);
      return isActiveStatus && bookingDay >= todayMidnight;
    })
    .sort((a, b) => new Date(a.booking_date) - new Date(b.booking_date));

  const confirmedPaidBookings = allBookings.filter(
    (b) =>
      b.booking_status === "CONFIRMED" &&
      b.payment_status === "PAID"
  );

  const earnings = confirmedPaidBookings.reduce((sum, b) => {
    return sum + Number(b.payments?.amount || 0);
  }, 0);


  const recentClients = (() => {
    const seen = new Set();
    return allBookings
      .filter((b) => {
        if (!b.user_id || seen.has(b.user_id)) return false;
        seen.add(b.user_id);
        return true;
      })
      .slice(0, 5);
  })();

  const stats = {
    totalClients: new Set(allBookings.map((b) => b.user_id).filter(Boolean)).size,
    pendingRequests: allBookings.filter((b) => b.booking_status === "PENDING").length,
    activeConsults: allBookings.filter((b) => b.booking_status === "CONFIRMED").length,
    earnings,
  };

  //Helper functions

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-KE", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const getClientFromBooking = (booking) => {
    const client =
      booking.users_bookings_user_idTousers ||
      booking.users_bookings_client_idTousers ||
      null;
    const firstName = client?.first_name || "";
    const lastName = client?.second_name || client?.last_name || "";
    const hasName = firstName || lastName;
    return {
      name: hasName ? `${firstName} ${lastName}`.trim() : "Client",
      initials: hasName
        ? `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()
        : "CL",
      id: client?.id || booking.user_id || booking.id,
    };
  };

  const bookingStatusColors = {
    CONFIRMED: "bg-green-50 text-green-700 border-green-200",
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    CANCELLED: "bg-red-50 text-red-600 border-red-200",
    COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const handleOpenReschedule = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleBookingUpdate = async (updatedData) => {
    try {
      await axios.put(
        `${url}/api/bookings/lawyer/reschedule/${selectedBooking.id}`,
        {
          new_booking_date: updatedData.bookingDate,
          new_booking_time: updatedData.bookingTime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      //update local state
      setAllBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBooking.id
            ? {
                ...b,
                booking_date: updatedData.bookingDate,
                booking_time: updatedData.bookingTime,
              }
            : b
        )
      );

      toast.success("Booking rescheduled successfully!");
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to reschedule:", err);
      toast.error(
        err.response?.data?.error || "Failed to reschedule. Please try again."
      );
    }
  };

  //Loading

  if (authLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <img
          src={Legalease}
          alt="Loading..."
          className="w-24 h-24 object-contain animate-pulse mb-2"
        />
        <p className="text-gray-500 font-medium animate-pulse">
          {authLoading ? "Verifying session..." : "Loading dashboard..."}
        </p>
      </div>
    );
  }

  const advocateName = user
    ? `${user.first_name || ""} ${user.second_name || ""}`.trim() ||
      "Advocate"
    : "Advocate";

  return (
    <div className="min-h-screen bg-surface-container/50 flex flex-col md:flex-row w-full">
      <LawyerSidebar />

      <main className="md:ml-[264px] w-full md:flex-1 transition-all duration-300 min-h-screen">
        <section className="w-full max-w-7xl mx-auto flex flex-col items-start justify-start gap-8 py-8 px-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#101828]">
              Welcome back, {advocateName}
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant mt-1">
              Here is an overview of your work today
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
            <div className="lg:col-span-3 flex flex-col gap-4 w-full">
              <MiniStat
                icon={<Users size={18} className="text-[#3b5bdb]" />}
                label="TOTAL CLIENTS"
                value={stats.totalClients}
                bg="bg-[#f0f4ff]"
              />
              <MiniStat
                icon={<Clock size={18} className="text-amber-500" />}
                label="PENDING REQUESTS"
                value={stats.pendingRequests}
                bg="bg-amber-50"
              />
              <MiniStat
                icon={<TrendingUp size={18} className="text-emerald-500" />}
                label="ACTIVE CONSULTS"
                value={stats.activeConsults}
                bg="bg-emerald-50"
              />
            </div>

            {/* Earnings Card */}
            <div className="bg-primary text-white border border-primary-container rounded-[14px] p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[200px] w-full shrink-0">
              <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full translate-x-4 -translate-y-4" />
              <div className="absolute right-6 top-8 w-16 h-16 bg-white/5 rounded-full translate-x-4" />
              <div className="flex items-center justify-between z-10 w-full">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                  Earnings (KSh)
                </span>
                <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center text-amber-300">
                  <Wallet size={14} />
                </div>
              </div>
              <div className="z-10 mt-auto">
                <p className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-none">
                  KSh {stats.earnings > 0 ? stats.earnings.toLocaleString("en-KE") : "0"}
                </p>
                <p className="text-xs text-slate-300 mt-2">
                  From {confirmedPaidBookings.length} paid consultation
                  {confirmedPaidBookings.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl w-full text-sm font-medium">
              {error}
            </div>
          )}

          {/* Main Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">

            {/* Upcoming Consultations */}
            <div className="lg:col-span-2 w-full bg-white border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-outline-variant/40 flex justify-between items-center bg-surface-container-lowest">
                <div className="flex items-center gap-2 text-on-surface-variant font-semibold text-sm">
                  <Calendar size={18} className="text-[#3b5bdb]" />
                  Upcoming Consultations
                </div>
                <button
                  onClick={() => navigate("/lawyer/bookings?tab=upcoming")}
                  className="text-sm text-[#3b5bdb] font-medium hover:underline transition-all"
                >
                  View All
                </button>
              </div>

              <div className="p-3">
                {upcomingBookings.length === 0 ? (
                  <p className="text-xs text-on-surface-variant text-center py-8">
                    No upcoming consultations scheduled.
                  </p>
                ) : (
                  upcomingBookings.slice(0, 5).map((booking) => {
                    const client = getClientFromBooking(booking);
                    const statusStyle =
                      bookingStatusColors[booking.booking_status] ||
                      "bg-gray-100 text-gray-600 border-gray-200";

                    return (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 border-b border-outline-variant/30 last:border-0 hover:bg-slate-50/50 rounded-lg transition-colors gap-4"
                      >
                        {/* Left */}
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-11 h-11 rounded-full bg-[#f0f4ff] text-[#3b5bdb] flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                            {client.initials}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm text-on-surface truncate">
                              {client.name}
                            </h4>
                            <p className="text-xs text-on-surface-variant capitalize mt-0.5">
                              {booking.meeting_type?.replace(/_/g, " ")}
                            </p>
                            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-[#667085]">
                              <Clock size={12} className="text-[#3b5bdb]" />
                              <span>
                                {formatDate(booking.booking_date)} at{" "}
                                {formatTime(booking.booking_time)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full ${statusStyle}`}
                          >
                            {booking.booking_status}
                          </span>
                          <button
                            onClick={() => handleOpenReschedule(booking)}
                            className="text-xs border border-outline px-3 py-1.5 rounded-full font-medium hover:bg-surface-variant/20 transition-colors"
                          >
                            Reschedule
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Recent Clients */}
            <div className="w-full bg-white border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-outline-variant/40 flex justify-between items-center bg-surface-container-lowest">
                <div className="flex items-center gap-2 text-on-surface-variant font-semibold text-sm">
                  <Users size={18} className="text-[#3b5bdb]" />
                  Recent Clients
                </div>
                <button
                  onClick={() => navigate("/lawyer/bookings?tab=upcoming")}
                  className="text-sm text-[#3b5bdb] font-medium hover:underline transition-all"
                >
                  View All
                </button>
              </div>

              <div className="p-3 flex flex-col gap-1">
                {recentClients.length === 0 ? (
                  <p className="text-xs text-center py-8 text-[#667085]">
                    No recent clients to display.
                  </p>
                ) : (
                  recentClients.map((booking) => {
                    const client = getClientFromBooking(booking);
                    return (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 border-b border-outline-variant/30 last:border-0 hover:bg-slate-50/50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-[#f0f4ff] text-[#3b5bdb] flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                            {client.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#101828] truncate">
                              {client.name}
                            </p>
                            <p className="text-xs text-[#667085] mt-0.5">
                              {formatDate(booking.booking_date)}
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-[#667085] shrink-0" />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Reschedule Modal */}
      <LawyerReschedule
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentBooking={selectedBooking}
        onUpdate={handleBookingUpdate}
      />
    </div>
  );
}