// src/pages/lawyer/LawyerCalendarPage.jsx
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { X, Loader2, AlertCircle } from "lucide-react";
import { getAllBookings } from "../../services/lawyerService.jsx";

const STATUS_COLORS = {
  upcoming:  { bg: "#000f26", border: "#000f26" },
  completed: { bg: "#12b76a", border: "#12b76a" },
  cancelled: { bg: "#f04438", border: "#f04438" },
};

const STATUS_CONFIG = {
  upcoming:  { label: "Upcoming",  className: "bg-blue-50 text-blue-700"       },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700" },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-600"         },
};

export default function LawyerCalendarPage() {
  const [events,   setEvents]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const lawyerId = localStorage.getItem("legalease_lawyer_id") 
          || "e4d02eba-f313-421a-85b0-1ed07298ef9c";

        const apiResponse = await getAllBookings(lawyerId);
        
        // Match your backend's exact nested structure: response.data.upcoming_bookings
        const upcoming = apiResponse?.data?.upcoming_bookings || [];
        const completed = apiResponse?.data?.recent_completed_bookings || [];
        const allBookings = [...upcoming, ...completed];
        
        const mapped = allBookings.map((b) => {
          // Normalize API status fields to match your UI configuration keys
          const status = b.booking_status === "CONFIRMED" || b.booking_status === "PENDING" ? "upcoming"
                       : b.booking_status === "COMPLETED" ? "completed"
                       : b.booking_status === "CANCELLED" ? "cancelled"
                       : "upcoming";
                       
          const colors = STATUS_COLORS[status];

          // Safely merge date string (YYYY-MM-DD) with time string (HH:MM:SS)
          let eventStart = b.booking_date;
          if (b.booking_date && b.booking_time) {
            const datePart = b.booking_date.split("T")[0]; // "2026-05-22"
            const timePart = b.booking_time.split("T")[1] || b.booking_time; // "14:00:00.000Z" or similar
            eventStart = `${datePart}T${timePart}`;
          }
          
          return {
            id:    String(b.id),
            title: `Client Consultation – ${b.notes || "No notes"}`,
            start: eventStart,
            extendedProps: {
              client:   b.user_id ? `Client (${b.user_id.substring(0,8)})` : "Client",
              type:     b.notes || "General Consultation",
              duration: b.duration || 60,
              status,
              meetingType: b.meeting_type || "N/A",
              paymentStatus: b.payment_status || "PENDING"
            },
            backgroundColor: colors.bg,
            borderColor:     colors.border,
          };
        });
        
        setEvents(mapped);
      } catch (err) {
        console.error("Failed to fetch bookings for calendar:", err);
        setError(err.message || "Could not retrieve calendar items.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);

  const handleEventClick = (info) => {
    const { extendedProps, start } = info.event;
    setSelected({ ...extendedProps, start: start.toISOString() });
  };

  return (
    <div className="max-w-5xl">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#101828]">My Calendar</h1>
        <p className="text-sm text-[#667085] mt-1">View and manage your scheduled consultations</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        {Object.entries(STATUS_CONFIG).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: STATUS_COLORS[key].bg }} />
            <span className="text-xs text-[#667085]">{val.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white border border-[#e4e7ec] rounded-[14px] overflow-hidden shadow-sm p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2">
            <Loader2 className="w-8 h-8 text-[#000f26] animate-spin" />
            <p className="text-sm text-[#667085]">Fetching schedule...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm font-semibold text-[#101828]">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 text-xs font-semibold text-[#000f26] hover:underline"
            >
              Reload Calendar
            </button>
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left:   "prev,next today",
              center: "title",
              right:  "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            eventClick={handleEventClick}
            height="auto"
            eventDisplay="block"
            dayMaxEvents={3}
            buttonText={{ today: "Today", month: "Month", week: "Week", day: "Day" }}
          />
        )}
      </div>

      {/* Event detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/35 z-[200] flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-[16px] w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e7ec]">
              <h3 className="text-base font-bold text-[#101828]">Consultation Details</h3>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-md flex items-center justify-center text-[#667085] hover:bg-[#f0f2f5] transition-colors border-none bg-transparent cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-6 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#000f26] text-white text-xl font-bold flex items-center justify-center">
                CL
              </div>
              <p className="text-sm font-mono text-[#667085] truncate max-w-xs">{selected.client}</p>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_CONFIG[selected.status]?.className}`}>
                {STATUS_CONFIG[selected.status]?.label}
              </span>
              <div className="grid grid-cols-2 gap-3 w-full mt-2">
                {[
                  { label: "Date",           value: new Date(selected.start).toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Time",           value: new Date(selected.start).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" }) },
                  { label: "Topic / Notes",  value: selected.type },
                  { label: "Channel",        value: selected.meetingType },
                  { label: "Payment Status", value: selected.paymentStatus },
                  { label: "Est. Duration",  value: `${selected.duration} minutes` },
                ].map((item) => (
                  <div key={item.label} className="bg-[#f8f9fc] border border-[#e4e7ec] rounded-lg p-3">
                    <p className="text-[10px] font-semibold text-[#667085] uppercase tracking-wide mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-[#101828]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
