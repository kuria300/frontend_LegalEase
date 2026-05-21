import { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import MpesaCheckout from "../../components/ui/booking/MpesaCheckout";
import PaymentStatusScreen from "../../components/ui/booking/PaymentStatusScreen";


// declare valid step constants
const VALID_STEPS = {
  CHECKOUT: "CHECKOUT",
  POLLING: "POLLING",
  SUCCESS: "SUCCESS",
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

  // checkuot_req_id returned by STK push
  const [checkoutReqId, setCheckoutReqId] = useState(null);

  // Callback by MpesaCheckout after initiateStkPush succeeds
  const handleStkSuccess = (redId)=>{
    setCheckoutReqId(reqId);
    setStep(VALID_STEPS.POLLING)
  }

  // callbacks to confirm payment success
  const handlePaymentSuccess = () => {
    setStep(VALID_STEPS.SUCCESS);
  };

  // called by paymentstatus screen when the payment Fails or polling timeout
  const handlePaymentFailed = () => {
    setStep(VALID_STEPS.FAILED)
  }
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

      {/* polling / loading screen */}
      {step === VALID_STEPS.POLLING && (
          <PaymentStatusScreen
            checkoutReqId={checkoutReqId}
            amount={amount}
            // Called when polling confirms SUCCESS — moves to Branch 5
            onSuccess={handlePaymentSuccess}
            // Called when payment FAILS or times out — returns to Branch 2
            onFailed={handlePaymentFailed}
          />
        )}
    </div>
  )
};
export default BookingPage;
