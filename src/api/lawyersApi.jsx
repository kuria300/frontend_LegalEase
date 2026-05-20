import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

export const getAllLawyers = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/lawyers`);
    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching lawyers:", err);
    return [];
  }
};