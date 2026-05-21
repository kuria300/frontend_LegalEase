import { useEffect, useState } from "react";
import { LawyerCard } from "../../../src/components/layout/lawyers/LawyerCard";
import { getLawyers } from "../../services/lawyerService";
import Legalease from "../../assets/images/Legalease.png";
import LawyerProfileModal from "../../pages/marketplace/LawyerProfileModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Footer from "../../components/layout/Footer";
import { User } from "lucide-react"

const LawyerMarketplace = () => {
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Holds the lawyer object that was clicked — drives the modal
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  // Track data loading state from your backend
  const [dataLoading, setDataLoading] = useState(true);

  // const navigate = useNavigate();
  // 'loading' here comes from your Auth Context
  const { user, loading } = useAuth();

  // // // 1. REDIRECT LOGIC (Safe at top level)
  // // useEffect(() => {
  // //   if (!loading && !user) {
  // //     toast.info("Please log in to continue.");
  // //     navigate('/login');
  // //   }
  // }, [user, loading, navigate]);

  // 2. FETCH LAWYERS FROM BACKEND
  useEffect(() => {
    const fetchLawyers = async () => {
      // Don't fetch if auth is still processing or if no user exists
      if (loading || !user) return;

      try {
        setDataLoading(true);
        const data = await getLawyers();
        const safeData = Array.isArray(data) ? data : [];
        setLawyers(safeData);
        setFilteredLawyers(safeData);
      } catch (error) {
        console.error("Failed to load lawyers:", error);
        setLawyers([]);
        setFilteredLawyers([]);
      } finally {
        setDataLoading(false);
      }
    };

    fetchLawyers();
  }, [user, loading]); // Re-run fetch when user authentication completes

  // 3. FILTER LOGIC
  useEffect(() => {
    let result = [...lawyers];

    if (selectedCategory !== "All") {
      result = result.filter(
        (lawyer) => lawyer?.category === selectedCategory
      );
    }

    // if (search.trim() !== "") {
    //   result = result.filter((lawyer) =>
    //     lawyer?.name?.toLowerCase().includes(search.toLowerCase())
    //   );
    // }
    if (search.trim() !== "") {
      result = result.filter((lawyer) =>
        lawyer?.lawyer_applications?.users?.first_name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    setFilteredLawyers(result);
  }, [search, selectedCategory, lawyers]);


  // 4. POSITION REAL Loading Screen Here (After all hooks)
  // This blocks the UI until Auth is complete and backend data is fully loaded
  if (loading || dataLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <img src={Legalease} alt="Loading..." className="w-24 h-24 object-contain animate-pulse mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">
          {loading ? "Verifying session..." : "Loading lawyers from marketplace..."}
        </p>
      </div>
    );
  }
  if (!user) return

  const isActive = (path) => location.pathname === path;


  // 5. RENDER MAIN UI (Only runs if user is validated AND data is ready)
  return (
    <>
    <nav className="w-full bg-white h-20 border-b border-gray-200 shadow-sm z-10 sticky top-0 flex justify-center">
        {/* Inner container to keep nav items aligned with the dashboard content */}
        <div className="w-full max-w-[1300px] px-8 flex items-center justify-between h-full">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/client-dashboard')}>
            <img src={Legalease} alt='Logo' className='w-28 h-28 object-contain' />
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex gap-8 items-center h-full">
            {[
              { name: 'Home', path: '/client-dashboard' },
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
          <section className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-10 flex flex-col items-center text-center">
          <img src={Legalease} alt="LegalEase Logo" className="w-40 h-40 object-contain mb-4" />
          <h1 className="text-primary text-4xl font-bold">Find Verified Lawyers</h1>
          <p className="text-on-surface-variant mt-2 text-lg">Browse trusted legal professionals across Kenya</p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Search lawyer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">All Categories</option>
            <option value="Family Law">Family Law</option>
            <option value="Criminal Law">Criminal Law</option>
            <option value="Land Law">Land Law</option>
          </select>
        </div>

        {/* EMPTY STATE */}
        {filteredLawyers.length === 0 && (
          <p className="text-gray-500 text-center py-10">No lawyers found matching your criteria.</p>
        )}

        {/* GRID */}
        {filteredLawyers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map((lawyer) => (
              <LawyerCard
                key={lawyer.id}
                lawyer={lawyer}
                onViewProfile = {(lawyer)=> setSelectedLawyer(lawyer)}
              />
            ))}
          </div>
        )}

        {/* MODAL */}
        {selectedLawyer && (
          <LawyerProfileModal
            lawyer={selectedLawyer}
            onClose={() => setSelectedLawyer(null)}
          />
        )}

      </div>
    </section>
    <Footer />
    </>

  );
};

export default LawyerMarketplace;
