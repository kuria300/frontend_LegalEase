import { useEffect, useState } from "react";
import { LawyerCard } from "../../../src/components/layout/lawyers/LawyerCard";
import { getLawyers } from "../../services/lawyerService";
import Legalease from "../../assets/images/Legalease.png";
import LawyerProfileModal from "../../pages/marketplace/LawyerProfileModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Footer from "../../components/layout/Footer";
import { User } from "lucide-react"
import ClientNavbar from "../../components/layout/client/ClientNavbar";
import { SPECIALIZATIONS } from "../lawyerForm/Constants";


const LawyerMarketplace = () => {
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();
  

  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  const { user, loading } = useAuth();

  // // useEffect(() => {
  // //   if (!loading && !user) {
  // //     toast.info("Please log in to continue.");
  // //     navigate('/login');
  // //   }
  // }, [user, loading, navigate]);

  // 2. FETCH LAWYERS FROM BACKEND
  useEffect(() => {
    const fetchLawyers = async () => {
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
  }, [user, loading]);

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

  // if (loading || dataLoading || !user) {
  //   return (
  //     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
  //       <img src={Legalease} alt="Loading..." className="w-24 h-24 object-contain animate-pulse mb-4" />
  //       <p className="text-gray-500 font-medium animate-pulse">
  //         {loading ? "Verifying session..." : "Loading lawyers from marketplace..."}
  //       </p>
  //     </div>
  //   );
  // }
  // if (!user) return

  const isActive = (path) => location.pathname === path;


  // ui
  return (
    <>
      <ClientNavbar />

        <section className="min-h-screen bg-gray-100 px-6 py-4">
          <div className="max-w-6xl mx-auto px-6">
          
          <div className="mb-6 flex flex-col items-center text-center">
            <img src={Legalease} alt="LegalEase Logo" className="w-40 h-40 object-contain" />
            <h1 className="text-primary text-4xl font-bold">Find Verified Lawyers</h1>
            <p className="text-on-surface-variant mt-2 text-lg">Browse trusted legal professionals across Kenya</p>
          </div>

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search lawyer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">All Categories</option>

            {SPECIALIZATIONS.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
        {/* LOADING */}
        {(loading || dataLoading) && (
            <div className="flex flex-col gap-3 items-center justify-center py-20 w-full">

              <div className="w-8 h-8 border-4 border-[#3b5bdb] border-t-transparent rounded-full animate-spin" />

              <span className="text-gray-500">
                {loading
                  ? "Verifying session..."
                  : "Fetching lawyers..."}
              </span>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading &&
            !dataLoading &&
            filteredLawyers.length === 0 && (
              <p className="text-gray-500 text-center py-10">
                No lawyers found matching your criteria.
              </p>
            )}

        {/* GRID */}
        { !loading && !dataLoading && filteredLawyers.length > 0 && (
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








/*
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
*/ 