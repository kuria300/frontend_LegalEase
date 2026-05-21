// src/pages/lawyer/LawyerCalendarPage.jsx
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { X } from "lucide-react";

const MOCK_BOOKINGS = [
  {
    id: "1",
    title: "Alice Wanjiku – Contract Review",
    start: "2025-05-20T10:00:00",
    end:   "2025-05-20T11:00:00",
    extendedProps: { client: "Alice Wanjiku", type: "Contract Review", duration: 60, status: "upcoming" },
    backgroundColor: "#3b5bdb",
    borderColor:     "#3b5bdb",
  },
  {
    id: "2",
    title: "Brian Omondi – Employment Dispute",
    start: "2025-05-20T13:30:00",
    end:   "2025-05-20T14:15:00",
    extendedProps: { client: "Brian Omondi", type: "Employment Dispute", duration: 45, status: "upcoming" },
    backgroundColor: "#3b5bdb",
    borderColor:     "#3b5bdb",
  },
  {
    id: "3",
    title: "Carol Muthoni – Family Law",
    start: "2025-05-21T16:00:00",
    end:   "2025-05-21T17:00:00",
    extendedProps: { client: "Carol Muthoni", type: "Family Law", duration: 60, status: "upcoming" },
    backgroundColor: "#3b5bdb",
    borderColor:     "#3b5bdb",
  },
  {
    id: "4",
    title: "David Kamau – Property Dispute",
    start: "2025-05-15T11:00:00",
    end:   "2025-05-15T12:30:00",
    extendedProps: { client: "David Kamau", type: "Property Dispute", duration: 90, status: "completed" },
    backgroundColor: "#12b76a",
    borderColor:     "#12b76a",
  },
  {
    id: "5",
    title: "Eva Njeri – Immigration",
    start: "2025-05-14T14:00:00",
    end:   "2025-05-14T15:00:00",
    extendedProps: { client: "Eva Njeri", type: "Immigration", duration: 60, status: "completed" },
    backgroundColor: "#12b76a",
    borderColor:     "#12b76a",
  },
  {
    id: "6",
    title: "Frank Kipchoge – Criminal Defense",
    start: "2025-05-13T09:00:00",
    end:   "2025-05-13T09:45:00",
    extendedProps: { client: "Frank Kipchoge", type: "Criminal Defense", duration: 45, status: "cancelled" },
    backgroundColor: "#f04438",
    borderColor:     "#f04438",
  },
  {
    id: "7",
    title: "Grace Achieng – Contract Review",
    start: "2025-05-22T15:00:00",
    end:   "2025-05-22T15:30:00",
    extendedProps: { client: "Grace Achieng", type: "Contract Review", duration: 30, status: "upcoming" },
    backgroundColor: "#3b5bdb",
    borderColor:     "#3b5bdb",
  },
  {
    id: "8",
    title: "Irene Wambua – Family Law",
    start: "2025-05-23T11:00:00",
    end:   "2025-05-23T11:45:00",
    extendedProps: { client: "Irene Wambua", type: "Family Law", duration: 45, status: "upcoming" },
    backgroundColor: "#3b5bdb",
    borderColor:     "#3b5bdb",
  },
];

const STATUS_CONFIG = {
  upcoming:  { label: "Upcoming",  className: "bg-blue-50 text-blue-700"        },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700"  },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-600"          },
};

export default function LawyerCalendarPage() {
  const [selected, setSelected] = useState(null);

  const handleEventClick = (info) => {
    const { extendedProps, title, startStr, endStr } = info.event;
    setSelected({ title, start: startStr, end: endStr, ...extendedProps });
  };

  return (
    <div className="max-w-5xl">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#101828]">My Calendar</h1>
        <p className="text-sm text-[#667085] mt-1">View and manage your scheduled consultations</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#3b5bdb]" />
          <span className="text-xs text-[#667085]">Upcoming</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#12b76a]" />
          <span className="text-xs text-[#667085]">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#f04438]" />
          <span className="text-xs text-[#667085]">Cancelled</span>
        </div>
      </div>

      {/* Calendar card */}
      <div className="bg-white border border-[#e4e7ec] rounded-[14px] overflow-hidden shadow-sm p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left:   "prev,next today",
            center: "title",
            right:  "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={MOCK_BOOKINGS}
          eventClick={handleEventClick}
          height="auto"
          eventDisplay="block"
          dayMaxEvents={3}
          buttonText={{
            today: "Today",
            month: "Month",
            week:  "Week",
            day:   "Day",
          }}
        />
      </div>

      {/* Event detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/35 z-[200] flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-[16px] w-full max-w-md shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e7ec]">
              <h3 className="text-base font-bold text-[#101828]">Consultation Details</h3>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-md flex items-center justify-center text-[#667085] hover:bg-[#f0f2f5] transition-colors border-none bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-6 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3b5bdb] to-[#6e8efb] text-white text-xl font-bold flex items-center justify-center">
                {selected.client?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <p className="text-lg font-bold text-[#101828]">{selected.client}</p>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_CONFIG[selected.status]?.className}`}>
                {STATUS_CONFIG[selected.status]?.label}
              </span>

              <div className="grid grid-cols-2 gap-3 w-full mt-2">
                {[
                  { label: "Date",     value: new Date(selected.start).toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Time",     value: new Date(selected.start).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" }) },
                  { label: "Type",     value: selected.type     },
                  { label: "Duration", value: `${selected.duration} minutes` },
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