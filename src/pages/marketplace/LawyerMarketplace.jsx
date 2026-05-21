import { useEffect, useState } from "react";
import { LawyerCard } from "../../../src/components/layout/lawyers/LawyerCard";
import { getLawyers } from "../../services/lawyerService";
import Legalease from "../../assets/images/Legalease.png";
import LawyerProfileModal from "../../pages/marketplace/LawyerProfileModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

const LawyerMarketplace = () => {
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  
  // Track data loading state from your backend
  const [dataLoading, setDataLoading] = useState(true);

  const navigate = useNavigate();
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

    if (search.trim() !== "") {
      result = result.filter((lawyer) =>
        lawyer?.name?.toLowerCase().includes(search.toLowerCase())
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


  // 5. RENDER MAIN UI (Only runs if user is validated AND data is ready)
  return (
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
  );
};

export default LawyerMarketplace;
