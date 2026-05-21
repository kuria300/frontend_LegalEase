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


// ─────────────────────────────────────────
// Lawyer Dashboard Services
// ─────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("legalease_token")}`,
});

const getLawyerId = () =>
  localStorage.getItem("legalease_lawyer_id") || "e4d02eba-f313-421a-85b0-1ed07298ef9c";

export const getLawyerDashboardSummary = async () => {
  const lawyerId = getLawyerId();
  const res = await fetch(
    `${BASE_URL}/api/lawyer-dashboard/summary?lawyer_id=${lawyerId}`,
    { headers: authHeaders() }
  );
  if (!res.ok) throw new Error("Failed to fetch dashboard summary");
  const json = await res.json();
  return json.data; // { upcoming_bookings, recent_completed_bookings, lawyer_profile }
};

// // Used by ConsultationList + CalendarPage — returns raw json so each page can destructure
// export const getAllBookings = async (lawyerId) => {
//   const res = await fetch(
//     `${BASE_URL}/api/lawyer-dashboard/summary?lawyer_id=${lawyerId}`,
//     { headers: authHeaders() }
//   );
//   if (!res.ok) throw new Error("Failed to fetch bookings");
//   return res.json(); // { success, data: { upcoming_bookings, recent_completed_bookings } }
// };
export const getAllBookings = async () => {
  const lawyerId = getLawyerId();
  const res = await fetch(`${BASE_URL}/api/bookings/lawyer?lawyer_id`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json(); // { success, data: [...bookings] }
};
// // GET /api/bookings/lawyer
//router.get("/lawyer", authenticate, authorise("LAWYER"), getLawyerBookings);

export const getLawyerProfile = async () => {
  const lawyerId = getLawyerId();
  const res = await fetch(
    `${BASE_URL}/api/lawyer-dashboard/summary?lawyer_id=${lawyerId}`,
    { headers: authHeaders() }
  );
  if (!res.ok) throw new Error("Failed to fetch profile");
  const json = await res.json();
  return { data: json.data.lawyer_profile };
};

export const updateLawyerProfile = async (data) => {
  const res = await fetch(`${BASE_URL}/api/lawyer-profile/update`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ lawyer_id: getLawyerId(), ...data }),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  const json = await res.json();
  return json.data || json;
};


export const getLawyerByIdDirect = async (lawyerId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/lawyer?id=${lawyerId}`, {
      headers: authHeaders(),
    });
    
    if (!res.ok) throw new Error("Failed to pull data from backend Prisma");
    
    return await res.json();
  } catch (err) {
    console.error("Frontend fetch error in service:", err);
    throw err;
  }
};
