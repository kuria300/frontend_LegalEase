import { useState, useMemo } from "react";
import { Search, Calendar, Clock, MoreHorizontal, Eye, X } from "lucide-react";

const MOCK_CONSULTATIONS = [
  {
    id: 1,
    client: "Nick Lemeria",
    initials: "NL",
    date: "2025-05-20",
    time: "10:00 AM",
    type: "Contract Review",
    status: "upcoming",
    duration: 60,
  },
  {
    id: 2,
    client: "Brian Omondi",
    initials: "BO",
    date: "2025-05-20",
    time: "01:30 PM",
    type: "Employment Dispute",
    status: "upcoming",
    duration: 45,
  },
  {
    id: 3,
    client: "Carol Muthoni",
    initials: "CM",
    date: "2025-05-21",
    time: "04:00 PM",
    type: "Family Law",
    status: "upcoming",
    duration: 60,
  },
  {
    id: 4,
    client: "David Kamau",
    initials: "DK",
    date: "2025-05-15",
    time: "11:00 AM",
    type: "Property Dispute",
    status: "completed",
    duration: 90,
  },
  {
    id: 5,
    client: "Eva Njeri",
    initials: "EN",
    date: "2025-05-14",
    time: "02:00 PM",
    type: "Immigration",
    status: "completed",
    duration: 60,
  },
  {
    id: 6,
    client: "Frank Kipchoge",
    initials: "FK",
    date: "2025-05-13",
    time: "09:00 AM",
    type: "Criminal Defense",
    status: "cancelled",
    duration: 45,
  },
  {
    id: 7,
    client: "Grace Achieng",
    initials: "GA",
    date: "2025-05-22",
    time: "03:00 PM",
    type: "Contract Review",
    status: "upcoming",
    duration: 30,
  },
  {
    id: 8,
    client: "Henry Mwangi",
    initials: "HM",
    date: "2025-05-12",
    time: "10:30 AM",
    type: "Land Dispute",
    status: "completed",
    duration: 60,
  },
  {
    id: 9,
    client: "Halima Abdullahi",
    initials: "HA",
    date: "2025-05-23",
    time: "11:00 AM",
    type: "Family Law",
    status: "upcoming",
    duration: 45,
  },
  {
    id: 10,
    client: "James Otieno",
    initials: "JO",
    date: "2025-05-11",
    time: "08:00 AM",
    type: "Employment Dispute",
    status: "cancelled",
    duration: 60,
  },
];

const TABS = ["all", "upcoming", "completed", "cancelled"];

const STATUS_CONFIG = {
  upcoming: { label: "Upcoming", className: "status-upcoming" },
  completed: { label: "Completed", className: "status-completed" },
  cancelled: { label: "Cancelled", className: "status-cancelled" },
};

export default function ConsultationList() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return MOCK_CONSULTATIONS.filter((c) => {
      const matchTab = activeTab === "all" || c.status === activeTab;
      const matchSearch =
        c.client.toLowerCase().includes(search.toLowerCase()) ||
        c.type.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [activeTab, search]);

  const counts = useMemo(
    () => ({
      all: MOCK_CONSULTATIONS.length,
      upcoming: MOCK_CONSULTATIONS.filter((c) => c.status === "upcoming")
        .length,
      completed: MOCK_CONSULTATIONS.filter((c) => c.status === "completed")
        .length,
      cancelled: MOCK_CONSULTATIONS.filter((c) => c.status === "cancelled")
        .length,
    }),
    [],
  );

  return (
    <div className="cl-page">
      {/* Page header */}
      <div className="cl-page-header">
        <div>
          <h1 className="cl-title">Consultations</h1>
          <p className="cl-subtitle">Manage all your client consultations</p>
        </div>
      </div>

      {/* Card */}
      <div className="cl-card">
        {/* Toolbar */}
        <div className="cl-toolbar">
          {/* Tabs */}
          <div className="cl-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`cl-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="cl-tab-count">{counts[tab]}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="cl-search-wrap">
            <Search size={16} className="cl-search-icon" />
            <input
              className="cl-search"
              placeholder="Search client or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="cl-table-wrap">
          <table className="cl-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="cl-empty">
                    No consultations found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="cl-row">
                    {/* Client */}
                    <td>
                      <div className="cl-client">
                        <div className="cl-client-avatar">{c.initials}</div>
                        <span className="cl-client-name">{c.client}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td>
                      <div className="cl-cell-with-icon">
                        <Calendar size={14} className="cl-cell-icon" />
                        {new Date(c.date).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>

                    {/* Time */}
                    <td>
                      <div className="cl-cell-with-icon">
                        <Clock size={14} className="cl-cell-icon" />
                        {c.time}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="cl-type">{c.type}</td>

                    {/* Duration */}
                    <td className="cl-duration">{c.duration} min</td>

                    {/* Status */}
                    <td>
                      <span
                        className={`cl-status ${STATUS_CONFIG[c.status].className}`}
                      >
                        {STATUS_CONFIG[c.status].label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="cl-actions">
                        <button
                          className="cl-action-btn view"
                          title="View details"
                          onClick={() => setSelected(c)}
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        <div className="cl-footer">
          Showing {filtered.length} of {MOCK_CONSULTATIONS.length} consultations
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="cl-modal-overlay" onClick={() => setSelected(null)}>
          <div className="cl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cl-modal-header">
              <h3 className="cl-modal-title">Consultation Details</h3>
              <button
                className="cl-modal-close"
                onClick={() => setSelected(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="cl-modal-body">
              <div className="cl-modal-avatar">{selected.initials}</div>
              <p className="cl-modal-name">{selected.client}</p>
              <span
                className={`cl-status ${STATUS_CONFIG[selected.status].className}`}
              >
                {STATUS_CONFIG[selected.status].label}
              </span>
              <div className="cl-modal-grid">
                <div className="cl-modal-item">
                  <p className="cl-modal-item-label">Date</p>
                  <p className="cl-modal-item-value">
                    {new Date(selected.date).toLocaleDateString("en-KE", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="cl-modal-item">
                  <p className="cl-modal-item-label">Time</p>
                  <p className="cl-modal-item-value">{selected.time}</p>
                </div>
                <div className="cl-modal-item">
                  <p className="cl-modal-item-label">Type</p>
                  <p className="cl-modal-item-value">{selected.type}</p>
                </div>
                <div className="cl-modal-item">
                  <p className="cl-modal-item-label">Duration</p>
                  <p className="cl-modal-item-value">
                    {selected.duration} minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
