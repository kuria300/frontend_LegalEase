import axios from "axios";

// create axios instance
const api = axios.create({
    baseURL: 'http://localhost:3000' || import.meta.env.VITE_SERVER_URL_NO_API
});

// attach JWT token to every request
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
});

// GET /api/bookings/slots?lawyer_id=&booking_date=
export const getAvailableSlots = async (lawyerId, bookingDate) => {
    const { data } = await api.get("/api/bookings/slots", {
        params: { lawyer_id: lawyerId, booking_date: bookingDate },
    });
    return data.data
};

// POST /api/bookings
export const createBooking = async ({
    lawyerId,
    bookingDate,
    bookingTime,
    meetingType,
    notes,
    parsedDate
}) => {
    const { data } = await api.post("/api/bookings", {
        lawyer_id: lawyerId,
        booking_date: bookingDate,
        booking_time: bookingTime,
        meeting_type: meetingType,
        notes: notes || "",
        parsedDate,
    });

    return data.data;
}

// sends phone number, triggers STK push
export const initiateStkPush = async (bookingId, phoneNumber) => {
  try {
    const { data } = await api.post(`/checkout/${bookingId}`, {
      phoneNumber,
    });

    return data.data;
  } catch (error) {
    console.error("STK Push failed:", error);

     throw new Error(error?.response?.data?.error || "Failed to initiate STK Push");
  }
};
// payment status polling

export const getPaymentStatus = async (checkoutReqId) => {
  try {
    const { data } = await api.get( `/check-status/${checkoutReqId}`);

    return data;
  } catch (error) {
    console.error("Payment status error:", error);

    throw new Error( error?.response?.data?.error || "Failed to fetch payment status");
  }
};