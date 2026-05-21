import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Calendar, Clock, Video, ArrowRight,
  Loader2, Smartphone,
} from "lucide-react";
import PhoneInput from "./PhoneInput";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatTime } from "../../../utils/formatTime";
import { formatDisplayDate } from "../../../utils/date.utils";

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
  // Raw phone digits typed by the user — +254 prefix is handled separately
  const [phone, setPhone] = useState("");
 
  // Loading state while POST /api/checkout/:booking_id is in flight
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (paymentFailed) {
        toast.error("Payment was not completed. Please try again.");
    }
    }, [paymentFailed]);
 
  // Formats "10:00" → "10:00 AM - 10:30 AM" for the booking summary display
  const formatTimeRange = (time24) => {
    const [hh, mm] = time24.split(":").map(Number);
    const endDate = new Date();
    endDate.setHours(hh, mm + 30, 0, 0);
    const endHH = String(endDate.getHours()).padStart(2, "0");
    const endMM = String(endDate.getMinutes()).padStart(2, "0");
    return `${formatTime(time24)} - ${formatTime(`${endHH}:${endMM}`)}`;
  };
 
  // validate phone number and initiates the STK Push request
  const handlePay = async () => {}

    return (
    <div className="checkout-page-wrapper">
 
      {/* Page header */}
      <div className="checkout-page-header">
        <h1 className="checkout-title">Complete Your Booking</h1>
        <p className="checkout-subtitle">
          Review details and process payment securely.
        </p>
      </div>
 
      {/* Booking Summary */}
      <div className="checkout-section">
 
        {/* Numbered section badge */}
        <div className="checkout-section-heading">
          <span className="checkout-badge">1</span>
          <h2 className="checkout-section-title">Booking Summary</h2>
        </div>
 
        <div className="checkout-card">
 
          {/* Lawyer info row — name, title, and avatar */}
          <div className="checkout-lawyer-row">
            <div>
              {/* Small uppercase label above the lawyer name */}
              <p className="checkout-lawyer-label">LAWYER</p>
              <p className="checkout-lawyer-name">
                {lawyer?.first_name} {lawyer?.last_name}
              </p>
              <p className="checkout-lawyer-title">
                {lawyer?.specialty || "Verified Advocate"}
              </p>
            </div>
 
            {/* Avatar — initials fallback when no photo URL is available */}
            {lawyer?.photo_url ? (
              <img
                src={lawyer.photo_url}
                alt={`${lawyer.first_name} ${lawyer.last_name}`}
                className="checkout-avatar"
              />
            ) : (
              <div className="checkout-avatar-fallback">
                {lawyer?.first_name?.[0]}{lawyer?.last_name?.[0]}
              </div>
            )}
          </div>
 
          <div className="checkout-divider" />
 
          {/* Date and time — two-column meta row */}
          <div className="checkout-meta-row">
            <div className="checkout-meta-item">
              <Calendar size={13} className="text-outline" />
              <div>
                <span className="checkout-meta-label">Date</span>
                <span className="checkout-meta-value">
                  {formatDisplayDate(selectedDate)}
                </span>
              </div>
            </div>
            <div className="checkout-meta-item">
              <Clock size={13} className="text-outline" />
              <div>
                <span className="checkout-meta-label">Time</span>
                <span className="checkout-meta-value">
                  {formatTimeRange(selectedTime)}
                </span>
              </div>
            </div>
          </div>
 
          {/* Consultation type — single row below date and time */}
          <div className="checkout-meta-item">
            <Video size={13} className="text-outline" />
            <div>
              <span className="checkout-meta-label">Consultation Type</span>
              <span className="checkout-meta-value">{meetingType}</span>
            </div>
          </div>
 
          <div className="checkout-divider" />
 
          {/* Fee row */}
          <div className="checkout-fee-row">
            <span className="checkout-fee-label">Consultation Fee</span>
            <span className="checkout-fee-amount">{formatCurrency(amount)}</span>
          </div>
 
        </div>
      </div>
 
      {/* Payment Details */}
      <div className="checkout-section">
 
        {/* Numbered section badge */}
        <div className="checkout-section-heading">
          <span className="checkout-badge">2</span>
          <h2 className="checkout-section-title">Payment Details</h2>
        </div>
 
        <div className="checkout-card checkout-payment-card">
 
          {/* M-Pesa branding row — green badge + label */}
          <div className="checkout-mpesa-brand-row">
            <div className="checkout-mpesa-badge">
              <span className="checkout-mpesa-badge-text">{"M-\nPESA"}</span>
            </div>
            <div>
              <p className="checkout-mpesa-title">Pay via M-Pesa</p>
              <p className="checkout-mpesa-subtitle">Fast, secure mobile payment</p>
            </div>
          </div>
 
          {/* Phone number input with +254 prefix */}
          <div className="mt-4">
            <label className="checkout-input-label">M-Pesa Phone Number</label>
            <PhoneInput
              value={phone}
              onChange={setPhone}
              disabled={loading}
            />
          </div>
 
          {/* Instruction box — explains the STK push flow to the user */}
          <div className="checkout-instruction-box">
            <Smartphone size={18} className="text-secondary shrink-0 mt-0.5" />
            <p className="checkout-instruction-text">
              Instructions: Click &apos;Pay Now&apos;, then{" "}
              <strong>enter your M-Pesa PIN on your phone</strong> to complete
              the transaction of {formatCurrency(amount)}.
            </p>
          </div>
 
          {/* Pay button — onClick wired to handlePay */}
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