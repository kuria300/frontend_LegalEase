import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Pulls user, role, loading from your AuthProvider Context
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";         // Toast alerts added for system-wide symmetry
import { LawyerCard } from "../../components/layout/lawyers/LawyerCard";
import { getLawyers } from "../../services/lawyerService";
import Legalease from "../../assets/images/Legalease.png";
import LawyerProfileModal from "../../../src/pages/marketplace/LawyerProfileModal";

const AVAIL_CATEGORIES = [
  { value: "All", label: "All Categories" },
  { value: "Family Law", label: "Family Law" },
  { value: "Corporate & Commercial Law", label: "Corporate & Commercial Law" },
  { value: "Criminal Defense", label: "Criminal Defense" },
  { value: "Land Law", label: "Land & Property Law" }
];

const LawyerMarketplace = () => {
  const { user, loading: authLoading } = useAuth(); // Matches context mapping perfectly
  const navigate = useNavigate();

  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedLawyer, setSelectedLawyer] = useState(null);

  // FETCH LAWYERS
  useEffect(() => {
    // Hold execution if context checkAuth loop is still resolving
    if (authLoading) return;

    // Safety Catch: If auth finished and context has no user, push them to login
    if (!user) {
      toast.error("Session expired or unauthorized. Please login again.");
      navigate("/login");
      return;
    }

    const fetchLawyers = async () => {
      try {
        setLoading(true);
        
        // 🚀 Calling the updated self-contained localStorage token extraction function
        const data = await getLawyers();
        
        const safeData = Array.isArray(data) ? data : [];
        setLawyers(safeData);
        setFilteredLawyers(safeData);
      } catch (error) {
        console.error("Failed to load lawyers:", error);
        
        // Dynamic toast parsing to catch specific backend responses
        const errorMsg = error.response?.data?.error || error.message || "Failed to load trusted lawyers.";
        toast.error(errorMsg);
        
        setLawyers([]);
        setFilteredLawyers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, [authLoading, user, navigate]);

  // FILTER LOGIC
  useEffect(() => {
    let result = [...lawyers];

    if (selectedCategory !== "All") {
      result = result.filter((lawyer) => lawyer?.category === selectedCategory);
    }

    if (search.trim() !== "") {
      result = result.filter((lawyer) => {
        const firstName = lawyer?.lawyer_applications?.users?.first_name || "";
        const secondName = lawyer?.lawyer_applications?.users?.second_name || "";
        const fullName = `${firstName} ${secondName}`.toLowerCase();
        return fullName.includes(search.toLowerCase());
      });
    }

    setFilteredLawyers(result);
  }, [search, selectedCategory, lawyers]);

  // 1. GLOBAL AUTH LOADING GUARD (Matches checkAuth() fallback visualization)
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoaderCircle className="animate-spin mx-auto text-primary size-12" />
      </div>
    );
  }

  // 2. BACKUP SAFETY GUARD (Prevents flash of unauthenticated UI elements)
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-gray-500 text-sm">Authenticating session data...</p>
        <button 
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-background px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10 flex flex-col items-center text-center">
          <img
            src={Legalease}
            alt="LegalEase Logo"
            className="w-40 h-40 object-contain mb-4"
          />
          <h1 className="text-primary text-4xl font-bold tracking-tight">
            Find Verified Lawyers
          </h1>
          <p className="text-on-surface-variant mt-2 text-lg">
            Browse trusted legal professionals across Kenya
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Search lawyer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-xl border border-outline-variant bg-surface text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-sm min-w-55"
          >
            {AVAIL_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* DATA CONTAINER STATES */}
        {loading ? (
          <div className="text-center py-12 flex flex-col items-center gap-3">
            <LoaderCircle className="animate-spin text-primary size-8" />
            <p className="text-on-surface-variant font-medium text-sm">Loading trusted lawyers...</p>
          </div>
        ) : filteredLawyers.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-outline-variant rounded-2xl bg-surface">
            <p className="text-on-surface-variant font-medium text-sm">No legal professionals found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {filteredLawyers.map((lawyer) => (
              <LawyerCard
                key={lawyer.id}
                lawyer={lawyer}
                onViewProfile={() => setSelectedLawyer(lawyer)}
              />
            ))}
          </div>
        )}

        {/* DETAILS MODAL */}
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