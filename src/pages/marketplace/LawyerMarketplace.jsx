import { useEffect, useState } from "react";
import LawyerCard from "../../components/LawyerCard";
import { getLawyers } from "../../services/lawyerService";
import Legalease from "../../assets/images/Legalease.png";
import LawyerProfileModal from "../marketplace/LawyerProfileModal";

const LawyerMarketplace = () => {
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedLawyer, setSelectedLawyer] = useState(null);

  // FETCH LAWYERS
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);

        const data = await getLawyers();

        const safeData = Array.isArray(data) ? data : [];

        setLawyers(safeData);
        setFilteredLawyers(safeData);

      } catch (error) {
        console.error("Failed to load lawyers:", error);

        setLawyers([]);
        setFilteredLawyers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  // FILTER LOGIC
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

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-12">

      <div className="max-w-6xl mx-auto">

        
<div className="mb-10 flex flex-col items-center text-center">
  
  <img
    src={Legalease}
    alt="LegalEase Logo"
className="w-40 h-40 object-contain mb-4"  />

          <h1 className="text-primary text-4xl font-bold">
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

        {/* LOADING */}
        {loading && (
          <p className="text-gray-500">Loading lawyers...</p>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredLawyers.length === 0 && (
          <p className="text-gray-500">
            No lawyers found.
          </p>
        )}

        {/* GRID */}
        {!loading && filteredLawyers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredLawyers.map((lawyer) => (
              <LawyerCard
                key={lawyer.id}
                lawyer={lawyer}
                onView={() => setSelectedLawyer(lawyer)}
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