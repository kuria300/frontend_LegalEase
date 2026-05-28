import React, { useEffect, useState } from 'react';
import ClientSidebar from '../../components/layout/client/ClientSidebar';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import ClientReschedule from './ClientReschedule';
import { baseUrl } from '../../config/Baseurl';
import { toast } from 'react-toastify'; 

const STATUS_BADGE = {
  CONFIRMED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function getInitials(first, second) {
  return `${first?.[0] || ""}${second?.[0] || ""}`.toUpperCase();
}

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

function AppointmentDetailsModal({ appt, onClose }) {
  if (!appt) return null;
  const client = appt.users_bookings_lawyer_idTousers;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Consultation Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {getInitials(client?.first_name, client?.second_name)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{client?.first_name} {client?.second_name}</p>
            <p className="text-xs text-gray-500">{client?.email}</p>
          </div>
        </div>
        <hr />
        <div className="flex flex-col gap-3 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-500">Meeting Type</span>
            <span className="font-medium capitalize">{appt.meeting_type?.replace(/_/g, " ")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-medium">{new Date(appt.booking_date).toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time</span>
            <span className="font-medium">{appt.booking_time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${STATUS_BADGE[appt.booking_status] || "bg-gray-100"}`}>
              {appt.booking_status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span className="font-medium">{appt.payment_status || "—"}</span>
          </div>
          {appt.notes && (
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Notes</span>
              <p className="bg-gray-50 rounded-lg p-3 text-gray-700 text-xs">{appt.notes}</p>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-2 w-full py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition">
          Close
        </button>
      </div>
    </div>
  );
}

function AppointmentCard({ appt, tab, onReschedule, onViewDetails, reschedulingId }) {
  const client = appt.users_bookings_lawyer_idTousers;
  const isRescheduling = reschedulingId === appt.id;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
          {getInitials(client?.first_name, client?.second_name)}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-sm truncate">
            {client?.first_name} {client?.second_name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {appt.meeting_type?.replace(/_/g, " ")}
          </p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
          STATUS_BADGE[appt.booking_status] || "bg-gray-100"
        }`}>
          {appt.booking_status}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>{new Date(appt.booking_date).toLocaleDateString()}</span>
        <span>{appt.booking_time}</span>
      </div>
      <hr className="border-on-surface-variant/10" />
      <div className="flex gap-2">
        {tab === "upcoming" ? (
          <button
            onClick={() => onReschedule(appt)}
            disabled={isRescheduling}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5">
            {isRescheduling ? (
              <>
                <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Rescheduling...
              </>
            ) : (
              "Reschedule"
            )}
          </button>
        ) : (
          <button
            onClick={() => onViewDetails(appt)}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
            View Details
          </button>
        )}
      </div>
    </div>
  );
}

const ClientConsult = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "upcoming";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [error, setError] = useState(null);
  const [reschedulingId, setReschedulingId] = useState(null);

    const [page]  = useState(1);
    const [limit] = useState(20);

  const { url } = baseUrl();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${url}/api/bookings/user`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: { page, limit },
        });
        setAppointments(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load consultations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  const upcoming = safeAppointments.filter(
    (a) => a.booking_status === "PENDING" || a.booking_status === "CONFIRMED"
  );
  const past = safeAppointments.filter(
    (a) => a.booking_status === "COMPLETED" && a.payment_status === "PAID"
  );
  const filtered = activeTab === "upcoming" ? upcoming : past;

  const handleOpenReschedule = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleOpenDetails = (appt) => {
    setSelectedDetails(appt);
    setDetailsModalOpen(true);
  };

  const handleBookingUpdate = async (updatedData) => {
    try {
      setReschedulingId(selectedBooking.id);
      await axios.put(
        `${url}/api/bookings/user/reschedule/${selectedBooking.id}`,
        { new_booking_date: updatedData.bookingDate, new_booking_time: updatedData.bookingTime },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAppointments((prev) =>
        prev.map((b) =>
          b.id === selectedBooking.id
            ? { ...b, booking_date: updatedData.bookingDate, booking_time: updatedData.bookingTime }
            : b
        )
      );
      toast.success('Booking rescheduled successfully!');
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update booking. Please try again.');
    } finally {
      setReschedulingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container/45 flex flex-col md:flex-row w-full">
      <ClientSidebar />
      <main className="md:ml-[264px] w-full flex-1 min-h-screen">
        <section className="max-w-7xl mx-auto py-8 px-6 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Consultations</h1>
            <p className="text-[20px] text-on-surface-variant mt-1">
              Manage your upcoming and past client consultations.
            </p>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {["upcoming", "past"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setSearchParams({ tab }); setActiveTab(tab); }}
                className={`px-5 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                  activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab} ({loading ? "…" : tab === "upcoming" ? upcoming.length : past.length})
              </button>
            ))}
          </div>
          {error && <p className="text-red-500 text-sm py-12 text-center">{error}</p>}
          {!error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              ) : filtered.length > 0 ? (
                filtered.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appt={appt}
                    tab={activeTab}
                    onReschedule={handleOpenReschedule}
                    onViewDetails={handleOpenDetails}
                    reschedulingId={reschedulingId}
                  />
                ))
              ) : (
                <p className="text-gray-400 text-sm col-span-3 py-12 text-center">
                  No {activeTab} consultations found.
                </p>
              )}
            </div>
          )}
          <ClientReschedule
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            currentBooking={selectedBooking}
            onUpdate={handleBookingUpdate}
          />
          <AppointmentDetailsModal
            appt={selectedDetails}
            onClose={() => { setDetailsModalOpen(false); setSelectedDetails(null); }}
          />
        </section>
      </main>
    </div>
  );
};

export default ClientConsult;