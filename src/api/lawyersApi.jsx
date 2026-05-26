import axios from "axios";

const BASE_URL = "https://legaleaseafrica.org/__api__/api";

export const getAllLawyers = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/lawyers`);
    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching lawyers:", err);
    return [];
  }
};