import axios from "axios";
import { baseUrl } from "../config/Baseurl";

const { url }=baseUrl()

const BASE_URL = url

export const getAllLawyers = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/lawyers`);
    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching lawyers:", err);
    return [];
  }
};