import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, CalendarCheck, Loader2, AlertCircle } from "lucide-react";
import DatePicker from "./DatePicker";
import TimeSlotPicker from "./TimeSlotPicker";
import { getAvailableSlots, createBooking } from "../../../api/booking/bookingApi";
import { formatCurrency } from "../../../utils/formatCurrency";
import { toDateString, createParsedDate } from "../../../utils/date.utils";

const MEETING_TYPES = ["Video Call (Google Meet)", "Phone Call", "In-Person"];

// Maps display label → backend accepted value
const MEETING_TYPE_MAP = {
  "Video Call (Google Meet)": "Google Meet",
  "Phone Call": "Phone Call",
  "In-Person": "In-Person",
};

const BookingModal = ({ isOpen, onClose, lawyer }) => {
  const navigate = useNavigate();

  // date and time selections
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // meeting type -> defaults to Google meet
  const [meetingType, setMeetingType] = useState(MEETING_TYPES[0]);

  // slots fetched from backend after a date is picked
  // GET api/bookings/slots
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  // booking creation state for POST /api/bookings
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Fetch available slots whenever the selected date changes
  useEffect(() => {
    if (!selectedDate || !lawyer?.id) return;

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSlotsError(null);
      setSelectedTime(null);
      try {
        const data = await getAvailableSlots(
          lawyer.id,
          toDateString(selectedDate)
        );
        setSlots(data);
      } catch (err) {
        setSlotsError(err.response?.data?.message || err.message);
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, lawyer?.id]);

  // Reset all local state when modal is closed
  // -> ensure reopening starts fresh
  useEffect(() => {
    if (!isOpen) {
      setSelectedDate(null);
      setSelectedTime(null);
      setMeetingType(MEETING_TYPES[0]);
      setSlots([]);
      setSlotsError(null);
      setBookingError(null);
    }
  }, [isOpen]);

  // function to handle click on "Book Consultation"
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;

    setBookingLoading(true);
    setBookingError(null);

    try {
      const booking = await createBooking({
        lawyerId: lawyer.id,
        bookingDate: toDateString(selectedDate),
        bookingTime: selectedTime,
        meetingType: MEETING_TYPE_MAP[meetingType],
        notes: "",
        parsedDate: createParsedDate(selectedDate, selectedTime),
      });

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

      onClose();
    } catch (err) {
      setBookingError(err.response?.data?.message || err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  // don't render anything when the modal is closed
  if (!isOpen) return null;

  // ensure book button is only active when both date and time are selected
  const canBook = selectedDate && selectedTime && !bookingLoading;

  return (
    <div
      className="booking-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="booking-modal-card">

        {/* Header */}
        <div className="booking-modal-header">
          <button
            onClick={onClose}
            className="booking-close-btn"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>

          <h2 className="text-on-primary text-base font-medium mb-1">
            Book a Consultation
          </h2>

          {/* pull consultation fee from lawyer object*/}
          {lawyer?.consultation_fee && (
            <p className="text-on-primary text-2xl font-semibold">
              {formatCurrency(lawyer.consultation_fee)}
              <span className="text-on-primary/75 text-sm font-normal">
                {" "}/30 mins
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
              {slotsError ? (
                <div className="booking-error">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <span>{slotsError}</span>
                </div>
              ) : (
                <TimeSlotPicker
                  slots={slots}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                  loading={slotsLoading}
                />
              )}
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

          {/* Booking error -> displayed if fetching bookings fail */}
          {bookingError && (
            <div className="booking-error">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{bookingError}</span>
            </div>
          )}

          {/* Book Button */}
          <button
            onClick={handleBooking}
            disabled={!canBook}
            className={canBook ? "booking-submit-btn" : "booking-submit-btn-disabled"}
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
            Secure payment via M-Pesa or Card required to confirm.
          </p>

        </div>
      </div>
    </div>
  );
};

export default BookingModal;