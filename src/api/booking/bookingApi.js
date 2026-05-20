import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
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
    const { data } = await api.get("/booking/slots", {
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
    const { data } = await api.post("/bookings", {
        lawyer_id: lawyerId,
        booking_date: bookingDate,
        booking_time: bookingTime,
        meeting_type: meetingType,
        notes: notes || "",
        parseDate,
    });

    return data.data;
}