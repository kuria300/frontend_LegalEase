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