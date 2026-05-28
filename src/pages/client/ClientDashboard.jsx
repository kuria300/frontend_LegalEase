import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './../../hooks/useAuth';
import { MessageCircleQuestion, Search, Calendar, Clock, History, ChevronRight, MessageSquare } from 'lucide-react';
import axios from 'axios';
import ClientSidebar from '../../components/layout/client/ClientSidebar';
import ClientReschedule from './ClientReschedule';
import { toast } from 'react-toastify';
import FloatingChatButton from '../../components/ui/Chat/FloatingChatButton';
import { baseUrl } from '../../config/Baseurl';

//Skeleton components
function ConsultationSkeleton() {
  return (
    <div className="animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between p-3 border-b border-outline-variant/30 last:border-0 gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-11 h-11 rounded-full bg-gray-200 shrink-0" />
            <div className="flex flex-col gap-2 min-w-0">
              <div className="h-3 bg-gray-200 rounded w-32" />
              <div className="h-2.5 bg-gray-100 rounded w-20" />
              <div className="h-2.5 bg-gray-100 rounded w-28" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="h-5 w-16 bg-gray-200 rounded-full" />
            <div className="h-6 w-20 bg-gray-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b border-outline-variant/30 last:border-0">
          <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="h-3 bg-gray-200 rounded w-28" />
            <div className="h-2.5 bg-gray-100 rounded w-full" />
            <div className="h-2 bg-gray-100 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

//Main Component
const ClientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, processed } = useAuth();

  const [upcomingConsultations, setUpcomingConsultations] = useState([]);
  const [consultationHistory, setConsultationHistory]     = useState([]);
  const [recentChats, setRecentChats]                     = useState([]);
  const [dashboardLoading, setDashboardLoading]           = useState(false);
  const [chatsLoading, setChatsLoading]                   = useState(false);
  const [modalOpen, setModalOpen]                         = useState(false);
  const [selectedBooking, setSelectedBooking]             = useState(null);
  const [error, setError]                                 = useState(null);
  const [reschedulingId, setReschedulingId]               = useState(null);

  const [page]  = useState(1);
  const [limit] = useState(20);

  const [sessionUser, setSessionUser] = useState(null);

  const { url }=baseUrl()

  useEffect(() => {
    const refreshSession = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const url = import.meta.env.VITE_SERVER_URL;
        const res = await axios.get(`${url}/api/auth/session/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessionUser(res.data.user);
      } catch {
      }
    };
    refreshSession();
  }, []); 

  // sessionUser fresh from the session endpoint
  const name = sessionUser?.first_name || user?.first_name || 'Client';

  //Fetch bookings
  useEffect(() => {
    if (loading || !processed || !user?.id) return;

    const fetchConsultations = async () => {
      try {
        setDashboardLoading(true);

        const response = await axios.get(`${url}/api/bookings/user`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params: { page, limit },
        });

        const allBookings = response.data.data || [];

        // Compare against current datetime so only bookings from NOW onwards show
        const now = new Date();

        setUpcomingConsultations(
          allBookings.filter((b) => {
            if (b.booking_status !== 'CONFIRMED' && b.booking_status !== 'PENDING') return false;

          
            const bookingDateTime = new Date(b.booking_date);


            return bookingDateTime >= now;
          })
        );

        setConsultationHistory(
          allBookings.filter((b) => b.booking_status === 'COMPLETED' && b.payment_status === 'PAID')
        );
      } catch (err) {
        console.error(err);
        setError('Failed to load consultations');
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchConsultations();
  }, [loading, user, page, limit]);

  // Fetch recent AI chats
  useEffect(() => {
    if (loading || !processed || !user?.id) return;

    const fetchChats = async () => {
      try {
        setChatsLoading(true);

        const res = await axios.get(`${url}/api/chat/history`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params: { limit: 3 },
        });

        const conversations = res.data.conversations || [];

        setRecentChats(
          conversations.slice(0, 3).map((c) => ({
            id:      c.id,
            title:   c.category  || 'Legal Question',
            message: c.chat      || '',
            time:    c.created_at
              ? new Date(c.created_at).toLocaleDateString('en-KE', {
                  month: 'short', day: 'numeric',
                })
              : '',
          }))
        );
      } catch (err) {
        console.error('Failed to load recent chats:', err);
        setRecentChats([]);
      } finally {
        setChatsLoading(false);
      }
    };

    fetchChats();
  }, [loading, user, location.key]);

 //helper functions
  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-KE', {
      weekday: 'short', month: 'short', day: 'numeric',
    });

  const bookingStatusColors = {
    CONFIRMED: 'bg-green-50 text-green-700 border-green-200',
    PENDING:   'bg-yellow-50 text-yellow-700 border-yellow-200',
    CANCELLED: 'bg-red-50 text-red-600 border-red-200',
    COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const handleOpenReschedule = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleBookingUpdate = async (updatedData) => {
    try {
      setReschedulingId(selectedBooking.id);
      await axios.put(
        `${url}/api/bookings/user/reschedule/${selectedBooking.id}`,
        {
          new_booking_date: updatedData.bookingDate,
          new_booking_time: updatedData.bookingTime,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setUpcomingConsultations((prev) =>
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
    <>
      <div className="min-h-screen bg-surface-container/50 flex flex-col md:flex-row">
        <ClientSidebar />

        <main className="md:ml-64 w-full md:flex-1 transition-all duration-300 min-h-screen">
          <section className="w-full max-w-7xl mx-auto flex flex-col items-start justify-start gap-8 py-8 px-6">

            {/* Welcome Header */}
            {loading || !processed || !user?.id ? (
              <div className="animate-pulse flex flex-col gap-2">
                <div className="h-8 bg-gray-200 rounded w-48" />
                <div className="h-5 bg-gray-100 rounded w-80" />
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-on-surface mb-2">Hi {name},</h1>
                <p className="text-base md:text-lg text-on-surface-variant">
                  Welcome back to your LegalEase dashboard. How can we assist you today?
                </p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              {loading || !processed || !user?.id ? (
                <>
                  <div className="animate-pulse bg-white border-2 border-outline-variant/60 rounded-xl p-5 flex items-center gap-4 h-24">
                    <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-36" />
                      <div className="h-3 bg-gray-100 rounded w-52" />
                    </div>
                  </div>
                  <div className="animate-pulse bg-white border-2 border-outline-variant/60 rounded-xl p-5 flex items-center gap-4 h-24">
                    <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-28" />
                      <div className="h-3 bg-gray-100 rounded w-48" />
                    </div>
                  </div>
                </>
              ) : null}
              {!loading && processed && user?.id && (
                <>
                  <div
                    onClick={() => navigate('/chat')}
                    className="bg-white border-2 border-outline-variant/60 rounded-xl p-5 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-primary/40 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <MessageCircleQuestion size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-on-surface mb-0.5">Ask a Legal Question</h3>
                        <p className="text-sm text-on-surface-variant leading-relaxed">Get instant answers from our AI assistant.</p>
                      </div>
                    </div>
                    <ChevronRight className="text-on-surface-variant/60 group-hover:text-on-surface group-hover:translate-x-0.5 transition-all shrink-0" size={20} />
                  </div>
                  <div
                    onClick={() => navigate('/find-lawyers')}
                    className="bg-white border-2 border-outline-variant/60 rounded-xl p-5 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-secondary/40 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <Search size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-on-surface mb-0.5">Find a Lawyer</h3>
                        <p className="text-sm text-on-surface-variant leading-relaxed">Browse verified professionals for your case.</p>
                      </div>
                    </div>
                    <ChevronRight className="text-on-surface-variant/60 group-hover:text-on-surface group-hover:translate-x-0.5 transition-all shrink-0" size={20} />
                  </div>
                </>
              )}
            </div>

            {/* Upcoming + Recent Chats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">

              {/* Upcoming Consultations */}
              <div className="lg:col-span-2 w-full bg-white border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-outline-variant/40 flex justify-between items-center bg-surface-container-lowest">
                  <div className="flex items-center gap-2 font-semibold text-base">
                    <Calendar size={18} className="text-primary" />
                    Upcoming Consultations
                  </div>
                  <button
                    onClick={() => navigate('/client/consult?tab=upcoming')}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="p-3">
                  {dashboardLoading ? (
                    <ConsultationSkeleton />
                  ) : upcomingConsultations.length === 0 ? (
                    <p className="text-sm text-on-surface-variant text-center py-8">
                      No upcoming consultations scheduled.
                    </p>
                  ) : (
                    upcomingConsultations.map((consult) => {
                      const lawyer   = consult.users_bookings_lawyer_idTousers;
                      const initials = `${lawyer?.first_name?.[0] || ''}${lawyer?.second_name?.[0] || ''}`;
                      const lawyerName = `${lawyer?.first_name || ''} ${lawyer?.second_name || ''}`.trim();
                      const statusStyle = bookingStatusColors[consult.booking_status] || 'bg-gray-100 text-gray-600 border-gray-200';
                      const isRescheduling = reschedulingId === consult.id;

                      return (
                        <div
                          key={consult.id}
                          className="flex items-center justify-between p-3 border-b border-outline-variant/30 last:border-0 hover:bg-surface-variant/10 rounded-lg transition-colors gap-4"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-bold uppercase shrink-0">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-sm text-on-surface truncate">{lawyerName}</h4>
                              <p className="text-xs text-on-surface-variant capitalize mt-0.5">
                                {consult.meeting_type?.replace(/_/g, ' ')}
                              </p>
                              <div className="flex items-center gap-1 mt-1 text-[11px] text-on-surface-variant/80 font-medium">
                                <Clock size={12} className="text-primary" />
                                <span>{formatDate(consult.booking_date)} at {consult.booking_time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className={`text-[11px] font-bold uppercase border px-2 py-0.5 rounded-full ${statusStyle}`}>
                              {consult.booking_status}
                            </span>
                            <button
                              onClick={() => handleOpenReschedule(consult)}
                              disabled={isRescheduling}
                              className="text-xs border border-outline px-3 py-1.5 rounded-full font-medium hover:bg-surface-variant/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
                            >
                              {isRescheduling ? (
                                <>
                                  <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                  Rescheduling...
                                </>
                              ) : (
                                "Reschedule"
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Recent AI Chats */}
              <div className="w-full bg-white border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-outline-variant/40 flex justify-between items-center bg-surface-container-lowest">
                  <div className="flex items-center gap-2 font-semibold text-base">
                    <MessageSquare size={18} className="text-primary" />
                    Recent AI Chats
                  </div>
                  <button onClick={() => navigate('/chat')} className="text-sm text-primary font-medium hover:underline">
                    Open Chat
                  </button>
                </div>

                <div className="p-3">
                  {chatsLoading ? (
                    <ChatSkeleton />
                  ) : recentChats.length === 0 ? (
                    <p className="text-sm text-on-surface-variant text-center py-8">No recent AI chats.</p>
                  ) : (
                    recentChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => navigate('/chat')}
                        className="flex items-center justify-between p-4 border-b border-outline-variant/30 last:border-0 hover:bg-surface-variant/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                            <MessageSquare size={18} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm text-on-surface truncate">{chat.title}</h4>
                            <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{chat.message}</p>
                            <span className="text-[11px] text-on-surface-variant/70 mt-1 block">{chat.time}</span>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-on-surface-variant shrink-0" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Consultation History */}
            <div className="w-full bg-white border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-outline-variant/40 flex justify-between items-center bg-surface-container-lowest">
                <div className="flex items-center gap-2 font-semibold text-base">
                  <History size={18} className="text-primary" />
                  Consultation History
                </div>
                <button
                  onClick={() => navigate('/client/consult?tab=past')}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  View History
                </button>
              </div>

              <div className="p-3">
                {dashboardLoading ? (
                  <ConsultationSkeleton />
                ) : consultationHistory.length === 0 ? (
                  <p className="text-sm text-on-surface-variant text-center py-8">No completed consultations yet.</p>
                ) : (
                  consultationHistory.map((consult) => {
                    const lawyer     = consult.users_bookings_lawyer_idTousers;
                    const initials   = `${lawyer?.first_name?.[0] || ''}${lawyer?.second_name?.[0] || ''}`;
                    const lawyerName = `${lawyer?.first_name || ''} ${lawyer?.second_name || ''}`.trim();

                    return (
                      <div
                        key={consult.id}
                        className="flex items-center justify-between p-3 border-b border-outline-variant/30 last:border-0 hover:bg-surface-variant/10 rounded-lg transition-colors gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-full bg-secondary text-white flex items-center justify-center font-bold uppercase">
                            {initials}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">{lawyerName}</h4>
                            <p className="text-xs text-on-surface-variant mt-1">
                              {formatDate(consult.booking_date)} • {consult.meeting_type?.replace(/_/g, ' ')}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold uppercase border px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border-blue-200">
                          COMPLETED
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

            <ClientReschedule
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              currentBooking={selectedBooking}
              onUpdate={handleBookingUpdate}
            />
          </section>
        </main>

        <FloatingChatButton />
      </div>
    </>
  );
};

export default ClientDashboard;