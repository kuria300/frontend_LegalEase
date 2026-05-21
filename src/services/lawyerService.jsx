/**
 * Fetches all verified legal practitioners from the LegalEase backend API.
 * Safely extracts the JWT token string from local storage fallbacks.
 * @returns {Promise<Array>} Array of lawyer data objects.
 */
export const getLawyers = async () => {
  // 1. Check standard localStorage keys
  let token = localStorage.getItem("token");

  // 2. Fallback Safety Check: If the token was saved as part of a stringified object
  if (!token || token === "undefined" || token === "null") {
    const pendingUser = localStorage.getItem("pendingUser");
    if (pendingUser) {
      try {
        const parsed = JSON.parse(pendingUser);
        token = parsed?.token || parsed?.accessToken || parsed?.data?.token;
      } catch (e) {
        console.error("Failed to parse pendingUser object:", e);
      }
    }
  }

  try {
    const response = await fetch("http://localhost:3000/api/lawyers", {
      method: "GET",
      headers: {
        // Send the extracted token cleanly
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - Failed to fetch live data`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : (data.data || []);
    
  } catch (error) {
    console.error("Database Service Layer Exception:", error.message);
    throw error;
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
