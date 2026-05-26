
export const getLawyers = async () => {
  let token = localStorage.getItem("token");

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
    const response = await fetch("https://legaleaseafrica.org/__api__/api/lawyers", {
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
    `https://legaleaseafrica.org/__api__/api/lawyer-dashboard/summary?lawyer_id=${lawyerId}`,
    { headers: authHeaders() }
  );
  if (!res.ok) throw new Error("Failed to fetch dashboard summary");
  const json = await res.json();
  return json.data; 
};

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
  const res = await fetch(`https://legaleaseafrica.org/__api__/api/bookings/lawyer?lawyer_id`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
};


export const getLawyerProfile = async () => {
  const lawyerId = getLawyerId();
  const res = await fetch(
    `https://legaleaseafrica.org/__api__/api/lawyer-dashboard/summary?lawyer_id=${lawyerId}`,
    { headers: authHeaders() }
  );
  if (!res.ok) throw new Error("Failed to fetch profile");
  const json = await res.json();
  return { data: json.data.lawyer_profile };
};

export const updateLawyerProfile = async (data) => {
  const res = await fetch(`https://legaleaseafrica.org/__api__/api/lawyer-profile/update`, {
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
    const res = await fetch(`https://legaleaseafrica.org/__api__/api/api/lawyer?id=${lawyerId}`, {
      headers: authHeaders(),
    });
    
    if (!res.ok) throw new Error("Failed to pull data from backend Prisma");
    
    return await res.json();
  } catch (err) {
    console.error("Frontend fetch error in service:", err);
    throw err;
  }
};
