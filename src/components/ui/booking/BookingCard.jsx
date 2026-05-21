import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import DatePicker from "./DatePicker";
import TimeSlotPicker from "./TimeSlotPicker";
import {
  getAvailableSlots,
  createBooking,
} from "../../../api/booking/bookingApi";
import { formatCurrency } from "../../../utils/formatCurrency";
import { toDateString, createParsedDate } from "../../../utils/date.utils";

const MEETING_TYPES = ["Video Call (Google Meet)", "Phone Call", "In-Person"];

// Maps display label → backend accepted value
const MEETING_TYPE_MAP = {
  "Video Call (Google Meet)": "Google Meet",
  "Phone Call": "Phone Call",
  "In-Person": "In-Person",
};

const BookingCard = ({ lawyer }) => {
  const navigate = useNavigate();

  // date and time selections
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // meeting type -> defaults to Google meet
  const [meetingType, setMeetingType] = useState(MEETING_TYPES[0]);
  // Notes -> optional details the client wants the lawyer to know before the session
  const [notes, setNotes] = useState("");

  // slots fetched from backend after a date is picked
  // GET api/bookings/slots
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // booking creation state for POST /api/bookings
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch available slots whenever the selected date changes
  useEffect(() => {
    if (!selectedDate || !lawyer?.id){
      return;
    } 
      
    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSelectedTime(null);
      try {
        const data = await getAvailableSlots(
          lawyer.id,
          toDateString(selectedDate)
        );
        setSlots(data);
        
        // notify the user if no slots available for the selected date
        if(data.length === 0){
          toast.info("No available slots for this date");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load available slots");
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, lawyer?.id]);

  // function to handle click on "Book Consultation"
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime){
      toast.warn("Please select both a date and a time slot.");
      return;
    }

    setBookingLoading(true);
    try {
      const booking = await createBooking({
        lawyerId: lawyer.id,
        bookingDate: toDateString(selectedDate),
        bookingTime: selectedTime,
        meetingType: MEETING_TYPE_MAP[meetingType],
        notes: notes.trim(),
        parsedDate: createParsedDate(selectedDate, selectedTime),
      });

      // inform user booking was created and payment is next
      toast.success("Booking created! Proceeding to payment...");

      // Pass all state needed for checkout via react-router navigate
      navigate("/booking/checkout", {
        state: {
          bookingId: booking.id,
          lawyer,
          selectedDate: toDateString(selectedDate),
          selectedTime,
          meetingType,
          amount: lawyer.consultation_fee,
        },
      });

      // Reset calendar state after successful booking
      setSelectedDate(null);
      setSelectedTime(null);
      setSlots([]);
      setMeetingType(MEETING_TYPES[0]);
      setNotes("");

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to create a booking. Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // ensure book button is only active when both date and time are selected
  const canBook = selectedDate && selectedTime && !bookingLoading;

  return (
      <div className="booking-modal-card">
        {/* Header */}
        <div className="booking-modal-header">

          <h2 className="text-on-primary text-base font-medium mb-1">
            Book a Consultation
          </h2>

          {/* pull consultation fee from lawyer object*/}
          {lawyer?.consultation_fee && (
            <p className="text-on-primary text-2xl font-semibold">
              {formatCurrency(lawyer.consultation_fee)}
              <span className="text-on-primary/75 text-sm font-normal">
                {" "}
                /30 mins
              </span>
            </p>
          )}
        </div>

        {/*Body */}
        <div className="booking-modal-body">
          {/* Date Picker */}
          <div>
            <label className="booking-section-label">Select Date</label>
            <DatePicker
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* Time Slot Picker — will render only after a date is selected */}
          {selectedDate && (
            <div>
              <label className="booking-section-label">
                Available Times (EAT)
              </label>
                <TimeSlotPicker
                  slots={slots}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                  loading={slotsLoading}
                  />
            </div>
          )}

          {/* Meeting Type -> drop down */}
          <div>
            <label className="booking-section-label">Meeting Type</label>
            <select
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value)}
              className="booking-select"
            >
              {MEETING_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          {/* Notes, optional details for the lawyer before the session */}
          <div>
            <label className="booking-section-label">
              Additional Notes
              <span className="text-outline font-normal ml-1">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Briefly describe your legal issue or any details the lawyer should know before your consultation..."
              rows={3}
              maxLength={500}
              className="booking-notes-input"
            />
            {/* Character counter to help user stay within the 500 char limit */}
            <p className="text-xs text-outline text-right mt-1">
              {notes.length}/500
            </p>
          </div>

          {/* Book Button */}
          <button
            onClick={handleBooking}
            disabled={!canBook}
            className={
              canBook ? "booking-submit-btn" : "booking-submit-btn-disabled"
            }
          >
            {bookingLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CalendarCheck size={16} />
                Book Consultation
              </>
            )}
          </button>

          <p className="text-center text-xs text-outline">
            Secure payment via M-Pesa required to confirm.
          </p>
        </div>
      </div>
  );
};

export default BookingCard;
