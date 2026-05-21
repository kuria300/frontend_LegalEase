import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MessageCircleQuestion, 
  Search, 
  Calendar, 
  Clock, 
  History,
  ChevronRight,
  User
} from 'lucide-react';
import axios from 'axios';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Data States (Ready for Axios)
  const [clientName, setClientName] = useState('David');
  const [upcomingConsultations, setUpcomingConsultations] = useState([]);
  const [consultationHistory, setConsultationHistory] = useState([]);

  // Axios Data Fetching
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // REPLACE THESE WITH YOUR ACTUAL AXIOS ROUTES
        // const clientRes = await axios.get('/api/client/profile');
        // setClientName(clientRes.data.name);

        // const upcomingRes = await axios.get('/api/consultations/upcoming');
        // setUpcomingConsultations(upcomingRes.data);

        // const historyRes = await axios.get('/api/consultations/history');
        // setConsultationHistory(historyRes.data);

        // --- Mock Data injected for UI presentation ---
        setUpcomingConsultations([
          { id: 1, lawyerName: 'Advocate Maina', type: 'Property Law Consultation', time: 'Today, 2:00 PM', avatarUrl: 'https://i.pravatar.cc/150?u=1' },
          { id: 2, lawyerName: 'Advocate Kamau', type: 'Business Incorporation', time: 'Tomorrow, 10:30 AM', initials: 'EK' }
        ]);

        setConsultationHistory([
          { id: 1, lawyerName: 'Advocate Wambui', type: 'Family Law', date: 'Oct 12, 2023', initials: 'AW', status: 'COMPLETED' },
          { id: 2, lawyerName: 'Advocate J. Mutua', type: 'Employment Law', date: 'Sep 28, 2023', initials: 'JM', status: 'COMPLETED' }
        ]);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper to determine active nav tab based on current route
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#f9f9ff] font-sans flex flex-col items-center">
      
      {/* End-to-End Navigation Bar */}
      <nav className="w-full bg-white h-20 border-b border-gray-200 shadow-sm z-10 sticky top-0 flex justify-center">
        {/* Inner container to keep nav items aligned with the dashboard content */}
        <div className="w-full max-w-[1200px] px-8 flex items-center justify-between h-full">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-[#000e27] rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-[#fed65b] rounded-full"></div>
            </div>
            <span className="font-bold text-[#000e27] text-xl tracking-tight">LegalEase</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex gap-8 items-center h-full">
            {[
              { name: 'Home', path: '/' },
              { name: 'Chat', path: '/ask-legal-questions' },
              { name: 'Lawyers', path: '/find-lawyers' }, 
              { name: 'Profile', path: '/profile' }
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => navigate(tab.path)}
                className={`h-full px-2 text-sm font-medium transition-colors relative flex items-center ${
                  isActive(tab.path) ? 'text-[#111c2c]' : 'text-[#44474f] hover:text-[#111c2c]'
                }`}
              >
                {tab.name}
                {isActive(tab.path) && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#fed65b] rounded-t-md" />
                )}
              </button>
            ))}
          </div>

          {/* User Profile */}
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-gray-50 text-gray-600 cursor-pointer hover:bg-gray-100"
          >
            <User size={18} />
          </div>

        </div>
      </nav>

      {/* Main Area */}
      <main className="flex-1 w-full max-w-[1200px] px-8 py-8 mb-4">
        <div className="max-w-[1000px] mx-auto relative">
            
          {/* Header Greeting */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#111c2c] mb-2">Hi {clientName},</h1>
            <p className="text-[#44474f]">Welcome back to your LegalEase dashboard. How can we assist you today?</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div 
              onClick={() => navigate('/ask-legal-questions')}
              className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#00234e] text-[#adc7fb] rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MessageCircleQuestion size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111c2c]">Ask a Legal Question</h3>
                  <p className="text-sm text-[#44474f]">Get instant answers from our AI assistant.</p>
                </div>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-gray-700" size={20} />
            </div>

            <div 
              onClick={() => navigate('/find-lawyers')} 
              className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-yellow-200 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#fed65b] text-[#745c00] rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Search size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111c2c]">Find a Lawyer</h3>
                  <p className="text-sm text-[#44474f]">Browse verified professionals for your case.</p>
                </div>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-gray-700" size={20} />
            </div>
          </div>

          {/* Main Content Areas */}
          <div className="flex flex-col gap-6 max-w-4xl">
            
            {/* Upcoming Consultations */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-2 text-[#111c2c] font-semibold">
                  <Calendar size={18} className="text-[#445f8c]" />
                  Upcoming Consultations
                </div>
                <button onClick={() => navigate('/upcoming-consultations')} className="text-sm text-blue-800 font-medium hover:underline">View All</button>
              </div>
              <div className="p-2">
                {upcomingConsultations.map((consult) => (
                  <div key={consult.id} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-4">
                      {consult.avatarUrl ? (
                        <img src={consult.avatarUrl} alt={consult.lawyerName} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#d8e3fa] text-[#2c4773] flex items-center justify-center font-semibold text-sm">
                          {consult.initials}
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-sm text-[#111c2c]">{consult.lawyerName}</h4>
                        <p className="text-xs text-[#44474f]">{consult.type}</p>
                        <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-500">
                          <Clock size={12} /> {consult.time}
                        </div>
                      </div>
                    </div>
                    <button className="text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-100 font-medium cursor-pointer">
                      Reschedule
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Consultation History */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-2 text-[#111c2c] font-semibold">
                  <History size={18} className="text-[#445f8c]" />
                  Consultation History
                </div>
                <button onClick={() => navigate('/consultation-history')} className="text-sm text-blue-800 font-medium hover:underline cursor-pointer">View History</button>
              </div>
              <div className="p-2">
                {consultationHistory.map((history) => (
                  <div key={history.id} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100/50 text-blue-800 flex items-center justify-center font-semibold text-sm">
                          {history.initials}
                        </div>
                      <div>
                        <h4 className="font-semibold text-sm text-[#111c2c]">{history.lawyerName}</h4>
                        <p className="text-xs text-[#44474f]">{history.date} • {history.type}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold tracking-wider text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                      {history.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
};

export default ClientDashboard;