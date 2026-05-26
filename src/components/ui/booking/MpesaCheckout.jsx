
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Calendar, Clock, Video, ArrowRight, Loader2, Smartphone } from "lucide-react";
import PhoneInput from "./PhoneInput";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatTime } from "../../../utils/formatTime";
import { formatDisplayDate } from "../../../utils/date.utils";
import { initiateStkPush } from "../../../api/booking/bookingApi";


// function to render a single meta item e.g. Date, Time, Consultation Type
const MetaItem = ({ icon, label, value }) => (
  <div className="checkout-meta-item">
    {icon}
    <div>
      <span className="checkout-meta-label">{label}</span>
      <span className="checkout-meta-value">{value}</span>
    </div>
  </div>
);

// function to render the lawyer avatar — photo if available, initials if not
const LawyerAvatar = ({ lawyer }) => {
  if (lawyer?.photo_url) {
    return (
      <img
        src={lawyer.photo_url}
        alt={`${lawyer.first_name} ${lawyer.last_name}`}
        className="checkout-avatar"
      />
    );
  }
  return (
    <div className="checkout-avatar-fallback">
      {lawyer?.first_name?.[0]}{lawyer?.last_name?.[0]}
    </div>
  );
};


const MpesaCheckout = ({
  bookingId,
  lawyer,
  selectedDate,
  selectedTime,
  meetingType,
  amount,
  paymentFailed,
  onStkSuccess,
}) => {
  // Phone number digits — user types 9 digits, +254 prefix added on submit
  const [phone, setPhone] = useState("");

  // Loading state while STK push request is in flight
  const [loading, setLoading] = useState(false);

  // Show toast when user is returned after a failed payment
  useEffect(() => {
    if (paymentFailed) {
      toast.error("Payment was not completed. Please try again.");
    }
  }, [paymentFailed]);

  // Convert "10:00" → "10:00 AM - 10:30 AM" for the booking summary
  const formatTimeRange = (time24) => {
    const [hh, mm] = time24.split(":").map(Number);
    const end = new Date();
    end.setHours(hh, mm + 30, 0, 0);
    const endTime = `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;
    return `${formatTime(time24)} - ${formatTime(endTime)}`;
  };

  // STK Push API integration
  const handlePay = async () => {
    if (!phone || phone.trim().length < 9){
      toast.warn("Please enter a valid number.")
      return
    }

    setLoading(true);

    try{
      const fullPhone = `254${phone.trim()}`;

      // show loading toast while STK push request is in flight
      const toastId = toast.loading("Sending payment request to your phone...");

      // initiateStkPush
      const checkoutReqId = await initiateStkPush(bookingId, fullPhone);

      console.log(checkoutReqId)

      // dismiss loading toast and show success
      toast.update(toastId, {
        render: "STK push sent! Check your phone to enter your M-pesa Pin",
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });

      // notif BookingPage to advance to PaymentStatusScreen
      onStkSuccess(checkoutReqId);
    }
    catch(err){
      //show specific backend error or fallback message
      toast.error(err.message || "Failed to initiate payment.Please try again");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="checkout-page-wrapper">

      {/* Page header */}
      <div className="checkout-page-header">
        <h1 className="checkout-title">Complete Your Booking</h1>
        <p className="checkout-subtitle">Review details and process payment securely.</p>
      </div>

      {/* ── Booking Summary ── */}
      <div className="checkout-section">
        <div className="checkout-section-heading">
          <span className="checkout-badge">1</span>
          <h2 className="checkout-section-title">Booking Summary</h2>
        </div>

        <div className="checkout-card">

          {/* Lawyer name, title and avatar */}
          <div className="checkout-lawyer-row">
            <div>
              <p className="checkout-lawyer-label">LAWYER</p>
              <p className="checkout-lawyer-name">
                {lawyer?.first_name} {lawyer?.last_name}
              </p>
              <p className="checkout-lawyer-title">
                {lawyer?.specialty || "Verified Advocate"}
              </p>
            </div>
            <LawyerAvatar lawyer={lawyer} />
          </div>

          <div className="checkout-divider" />

          {/* Date and time — two column grid */}
          <div className="checkout-meta-row">
            <MetaItem
              icon={<Calendar size={13} className="text-outline" />}
              label="Date"
              value={formatDisplayDate(selectedDate)}
            />
            <MetaItem
              icon={<Clock size={13} className="text-outline" />}
              label="Time"
              value={formatTimeRange(selectedTime)}
            />
          </div>

          {/* Consultation type */}
          <MetaItem
            icon={<Video size={13} className="text-outline" />}
            label="Consultation Type"
            value={meetingType}
          />

          <div className="checkout-divider" />

          {/* Consultation fee */}
          <div className="checkout-fee-row">
            <span className="checkout-fee-label">Consultation Fee</span>
            <span className="checkout-fee-amount">{formatCurrency(amount)}</span>
          </div>

        </div>
      </div>

      {/* Payment Details */}
      <div className="checkout-section">
        <div className="checkout-section-heading">
          <span className="checkout-badge">2</span>
          <h2 className="checkout-section-title">Payment Details</h2>
        </div>

        <div className="checkout-card checkout-payment-card">

          {/* M-Pesa branding */}
          <div className="checkout-mpesa-brand-row">
            <div className="checkout-mpesa-badge">
              <span className="checkout-mpesa-badge-text">{"M-PESA"}</span>
            </div>
            <div>
              <p className="checkout-mpesa-title">Pay via M-Pesa</p>
              <p className="checkout-mpesa-subtitle">Fast, secure mobile payment</p>
            </div>
          </div>

          {/* Phone number input */}
          <div className="mt-4">
            <label className="checkout-input-label">M-Pesa Phone Number</label>
            <PhoneInput value={phone} onChange={setPhone} disabled={loading} />
          </div>

          {/* Instructions */}
          <div className="checkout-instruction-box">
            <Smartphone size={18} className="text-secondary shrink-0 mt-0.5" />
            <p className="checkout-instruction-text">
              Instructions: Click &apos;Pay Now&apos;, then{" "}
              <strong>enter your M-Pesa PIN on your phone</strong> to complete
              the transaction of {formatCurrency(amount)}.
            </p>
          </div>

          {/* Pay button */}
          <button
            onClick={handlePay}
            disabled={loading}
            className={loading ? "checkout-pay-btn-disabled" : "checkout-pay-btn"}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending STK Push...
              </>
            ) : (
              <>
                Pay {formatCurrency(amount)} Now
                <ArrowRight size={16} />
              </>
            )}
          </button>

        </div>
      </div>

    </div>
  );
};

export default MpesaCheckout;
