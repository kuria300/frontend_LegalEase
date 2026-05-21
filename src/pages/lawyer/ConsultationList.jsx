// src/pages/lawyer/ConsultationList.jsx
import { useState, useMemo } from "react";
import { Search, Calendar, Clock, Eye, X } from "lucide-react";

const MOCK_CONSULTATIONS = [
  { id: 1,  client: "Alice Wanjiku",  initials: "AW", date: "2025-05-20", time: "10:00 AM", type: "Contract Review",    status: "upcoming",  duration: 60 },
  { id: 2,  client: "Brian Omondi",   initials: "BO", date: "2025-05-20", time: "01:30 PM", type: "Employment Dispute", status: "upcoming",  duration: 45 },
  { id: 3,  client: "Carol Muthoni",  initials: "CM", date: "2025-05-21", time: "04:00 PM", type: "Family Law",         status: "upcoming",  duration: 60 },
  { id: 4,  client: "David Kamau",    initials: "DK", date: "2025-05-15", time: "11:00 AM", type: "Property Dispute",   status: "completed", duration: 90 },
  { id: 5,  client: "Eva Njeri",      initials: "EN", date: "2025-05-14", time: "02:00 PM", type: "Immigration",        status: "completed", duration: 60 },
  { id: 6,  client: "Frank Kipchoge", initials: "FK", date: "2025-05-13", time: "09:00 AM", type: "Criminal Defense",   status: "cancelled", duration: 45 },
  { id: 7,  client: "Grace Achieng",  initials: "GA", date: "2025-05-22", time: "03:00 PM", type: "Contract Review",    status: "upcoming",  duration: 30 },
  { id: 8,  client: "Henry Mwangi",   initials: "HM", date: "2025-05-12", time: "10:30 AM", type: "Land Dispute",       status: "completed", duration: 60 },
  { id: 9,  client: "Irene Wambua",   initials: "IW", date: "2025-05-23", time: "11:00 AM", type: "Family Law",         status: "upcoming",  duration: 45 },
  { id: 10, client: "James Otieno",   initials: "JO", date: "2025-05-11", time: "08:00 AM", type: "Employment Dispute", status: "cancelled", duration: 60 },
];

const TABS = ["all", "upcoming", "completed", "cancelled"];

const STATUS_CONFIG = {
  upcoming:  { label: "Upcoming",  className: "bg-blue-50 text-blue-700"   },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700" },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-600"     },
};

export default function ConsultationList() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState(null);

  const filtered = useMemo(() => {
    return MOCK_CONSULTATIONS.filter((c) => {
      const matchTab    = activeTab === "all" || c.status === activeTab;
      const matchSearch = c.client.toLowerCase().includes(search.toLowerCase()) ||
                          c.type.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [activeTab, search]);

  const counts = useMemo(() => ({
    all:       MOCK_CONSULTATIONS.length,
    upcoming:  MOCK_CONSULTATIONS.filter((c) => c.status === "upcoming").length,
    completed: MOCK_CONSULTATIONS.filter((c) => c.status === "completed").length,
    cancelled: MOCK_CONSULTATIONS.filter((c) => c.status === "cancelled").length,
  }), []);

  return (
    <div className="max-w-5xl">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#101828]">Consultations</h1>
        <p className="text-sm text-[#667085] mt-1">Manage all your client consultations</p>
      </div>

      {/* Card */}
      <div className="bg-white border border-[#e4e7ec] rounded-[14px] overflow-hidden shadow-sm">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e7ec] gap-4 flex-wrap">

          {/* Tabs */}
          <div className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border-none cursor-pointer
                  ${activeTab === tab
                    ? "bg-[#eef2ff] text-[#3b5bdb] font-semibold"
                    : "bg-transparent text-[#667085] hover:bg-[#f5f7ff] hover:text-[#3b5bdb]"
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                  ${activeTab === tab ? "bg-[#c7d2fe] text-[#3b5bdb]" : "bg-[#e4e7ec] text-[#667085]"}`}
                >
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3 text-[#667085] pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search client or type..."
              className="pl-9 pr-4 py-2 border border-[#e4e7ec] rounded-lg text-xs text-[#101828] bg-[#f8f9fc] outline-none focus:border-[#3b5bdb] w-52 transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#f8f9fc] border-b border-[#e4e7ec]">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#667085] uppercase tracking-wider">Client</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#667085] uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#667085] uppercase tracking-wider">Time</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#667085] uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#667085] uppercase tracking-wider">Duration</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#667085] uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#667085] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-[#667085] py-12 text-sm">
                    No consultations found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="border-b border-[#e4e7ec] last:border-0 hover:bg-[#fafbff] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3b5bdb] to-[#6e8efb] text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {c.initials}
                        </div>
                        <span className="font-semibold text-[#101828] text-sm">{c.client}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[#344054] text-xs">
                        <Calendar size={13} className="text-[#667085]" />
                        {new Date(c.date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[#344054] text-xs">
                        <Clock size={13} className="text-[#667085]" />
                        {c.time}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#667085]">{c.type}</td>
                    <td className="px-4 py-3 text-xs text-[#667085]">{c.duration} min</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_CONFIG[c.status].className}`}>
                        {STATUS_CONFIG[c.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(c)}
                        className="w-8 h-8 rounded-lg border border-[#e4e7ec] flex items-center justify-center text-[#667085] hover:bg-[#eef2ff] hover:text-[#3b5bdb] hover:border-[#c7d2fe] transition-colors bg-transparent cursor-pointer"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#e4e7ec] bg-[#f8f9fc] text-xs text-[#667085]">
          Showing {filtered.length} of {MOCK_CONSULTATIONS.length} consultations
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/35 z-[200] flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-[16px] w-full max-w-md shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e7ec]">
              <h3 className="text-base font-bold text-[#101828]">Consultation Details</h3>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-md flex items-center justify-center text-[#667085] hover:bg-[#f0f2f5] transition-colors border-none bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-6 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3b5bdb] to-[#6e8efb] text-white text-xl font-bold flex items-center justify-center">
                {selected.initials}
              </div>
              <p className="text-lg font-bold text-[#101828]">{selected.client}</p>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_CONFIG[selected.status].className}`}>
                {STATUS_CONFIG[selected.status].label}
              </span>
              <div className="grid grid-cols-2 gap-3 w-full mt-2">
                {[
                  { label: "Date", value: new Date(selected.date).toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Time", value: selected.time },
                  { label: "Type", value: selected.type },
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