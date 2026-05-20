// Temporary mock data for Task 4 testing
const dummyLawyers = [
  {
    id: 1,
    name: "Clara Amondi",
    category: "Family Law",
    experience: "5 years",
    location: "Nairobi",
  },
  {
    id: 2,
    name: "Mwangi Kamau",
    category: "Land Law",
    experience: "8 years",
    location: "Mombasa",
  },
  {
    id: 3,
    name: "Arnold Ochieng",
    category: "Criminal Law",
    experience: "12 years",
    location: "Kisumu",
  },
  {
    id: 4,
    name: "Faith Chepkwony",
    category: "Family Law",
    experience: "4 years",
    location: "Nakuru",
  }
];

export const getLawyers = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:3000/api/lawyers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch live data");
    }

    return await response.json();
  } catch (error) {
    console.warn("Backend unavailable, falling back to local mock data:", error.message);
    
    // RETURN MOCK DATA INSTEAD OF CRASHING
    return dummyLawyers; 
  }
};