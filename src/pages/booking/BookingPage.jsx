import { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import MpesaCheckout from "../../components/ui/booking/MpesaCheckout";

// declare valid step constants
const VALID_STEPS = {
  CHECKOUT: "CHECKOUT",
  FAILED: "FAILED",
};

const BookingPage = () => {
  // pull booking state passed via navigate() from BookingCard
  const { state } = useLocation();

  // redirect back if any required booking state is missing
  if (
    !state?.bookingId ||
    !state?.lawyer ||
    !state?.selectedDate ||
    !state?.selectedTime ||
    !state?.amount
  ) {
    toast.error("Booking information is missing. Please retry again.");
    return <Navigate to="/marketplace" replace />;
  }

  const { bookingId, lawyer, selectedDate, selectedTime, meetingType, amount } =
    state;

  // set active step -> to control which branch component renders
  const [step, setStep] = useState(VALID_STEPS.CHECKOUT);

  return (
    <div className="booking-page-wrapper">

      {(step === VALID_STEPS.CHECKOUT || step === VALID_STEPS.FAILED) && (
        <MpesaCheckout
          bookingId={bookingId}
          lawyer={lawyer}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          meetingType={meetingType}
          amount={amount}
          paymentFailed={step === VALID_STEPS.FAILED}
          onStkSuccess={handleStkSuccess}
        />
      )}
 
    </div>
  )
};
export default BookingPage;
