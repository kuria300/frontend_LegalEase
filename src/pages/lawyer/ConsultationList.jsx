import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import LawyerSidebar from "../../components/layout/lawyers/LawyerSidebar.jsx";
import { formatTime } from "../../utils/displayTime.js";

//Helper functions

function getInitials(first, second) {
  return `${first?.[0] || ""}${second?.[0] || ""}`.toUpperCase() || "CL";
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-KE", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const STATUS_BADGE = {
  CONFIRMED: "bg-green-100 text-green-700",
  PENDING:   "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-600",
};

//Skeleton Card

function SkeletonCard() {
  return (
    <div className="bg-white border-2 border-gray-100 rounded-xl p-4 flex flex-col gap-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="h-2.5 bg-gray-100 rounded w-1/2" />
        </div>
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
      </div>
      <div className="flex gap-4">
        <div className="h-2.5 bg-gray-100 rounded w-20" />
        <div className="h-2.5 bg-gray-100 rounded w-14" />
      </div>
      <hr className="border-gray-100" />
      <div className="h-7 bg-gray-100 rounded-lg w-24" />
    </div>
  );
}

//Appointment Card

function AppointmentCard({ appt, tab }) {
  // The client who booked is under users_bookings_user_idTousers
  const client =
    appt.users_bookings_user_idTousers ||
    appt.users_bookings_client_idTousers;

  const firstName = client?.first_name || "";
  const lastName  = client?.second_name || client?.last_name || "";
  const fullName  = firstName || lastName
    ? `${firstName} ${lastName}`.trim()
    : "Client";

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-col gap-3">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm shrink-0">
          {getInitials(firstName, lastName)}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{fullName}</p>
          <p className="text-xs text-gray-500 truncate capitalize">
            {appt.meeting_type?.replace(/_/g, " ")}
          </p>
        </div>

        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
          STATUS_BADGE[appt.booking_status] || "bg-gray-100 text-gray-600"
        }`}>
          {appt.booking_status}
        </span>
      </div>

      {/* Meta data */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>{formatDate(appt.booking_date)}</span>
        <span>{formatTime(appt.booking_time)}</span>
      </div>

      <hr className="border-gray-100" />

      {/* Actions */}
      <div className="flex gap-2">
        {tab === "upcoming" ? (
          <button className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Reschedule
          </button>
        ) : (
          <button className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            View Details
          </button>
        )}
      </div>
    </div>
  );
}

export default function ConsultationList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = searchParams.get("tab") || "upcoming";
  const [activeTab, setActiveTab]     = useState(initialTab);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);

        const response = await axios.get("/api/bookings/lawyer", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: { page: 1, limit: 100 },
        });

        setAppointments(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching lawyer bookings:", err);
        setError("Failed to load consultations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const safe = Array.isArray(appointments) ? appointments : [];

  // Today midnight for upcoming filter
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const upcoming = safe.filter((a) => {
    const day = new Date(a.booking_date);
    day.setHours(0, 0, 0, 0);
    return (
      (a.booking_status === "CONFIRMED" || a.booking_status === "PENDING") &&
      day >= todayMidnight
    );
  });

  const past = safe.filter(
    (a) =>
      a.booking_status === "COMPLETED" ||
      (a.booking_status === "CONFIRMED" && new Date(a.booking_date) < todayMidnight)
  );

  const filtered = activeTab === "upcoming" ? upcoming : past;

  return (
    <div className="min-h-screen bg-surface-container/45 flex flex-col md:flex-row w-full">
      <LawyerSidebar />

      <main className="md:ml-[264px] w-full flex-1 min-h-screen">
        <section className="max-w-7xl mx-auto py-8 px-6 flex flex-col gap-6">

          {/* Header*/}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Consultations</h1>
            <p className="text-lg text-on-surface-variant mt-1">
              Manage your upcoming and past client consultations.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
            {["upcoming", "past"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setSearchParams({ tab });
                  setActiveTab(tab);
                }}
                className={`px-5 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab} ({loading ? "…" : tab === "upcoming" ? upcoming.length : past.length})
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm py-6 text-center">{error}</p>
          )}

          {/*skeleton while loading, cards show when done */}
          {!error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              ) : filtered.length > 0 ? (
                filtered.map((appt) => (
                  <AppointmentCard key={appt.id} appt={appt} tab={activeTab} />
                ))
              ) : (
                <p className="text-gray-400 text-sm col-span-3 py-12 text-center">
                  No {activeTab} consultations found.
                </p>
              )}
            </div>
          )}

        </section>
      </main>
    </div>
  );
}