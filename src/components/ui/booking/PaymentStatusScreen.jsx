// src/components/ui/Payment/PaymentStatusScreen.jsx
import { useEffect } from "react";
import { Loader2, XCircle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import usePaymentPolling from "../../../hooks/usePaymentPolling";
import { formatCurrency } from "../../../utils/formatCurrency";

const PaymentStatusScreen = ({
  checkoutReqId,
  amount,
  onSuccess,
  onFailed,
}) => {
  const navigate = useNavigate();
  const { status, error, attempts } = usePaymentPolling(checkoutReqId, true);

  // On SUCCESS show toast and redirect to consultations
  useEffect(() => {
    if (status === "SUCCESS") {
      toast.success("Payment confirmed! Your booking is now active.");
      // Small delay so the success UI is briefly visible before redirect
      const timer = setTimeout(() => {
        navigate("/client/consult?tab=upcoming");
        onSuccess?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // On FAILED let BookingPage handle
  useEffect(() => {
    if (status === "FAILED") onFailed?.();
  }, [status]);

  // On polling error
  useEffect(() => {
    if (error) onFailed?.();
  }, [error]);

  return (
    <div className="status-screen-wrapper">
      <div className="status-screen-card">

        {/*PENDING*/}
        {status === "PENDING" && !error && (
          <>
            <div className="status-spinner-ring">
              <Loader2 size={36} className="text-secondary animate-spin" />
            </div>

            <h2 className="status-title">Waiting for Payment</h2>

            <p className="status-subtitle">
              Check your phone and enter your M-Pesa PIN to confirm{" "}
              <strong>{formatCurrency(amount)}</strong>.
            </p>

            <p className="status-attempts">
              Checking payment status... (attempt {attempts} of 20)
            </p>

            <div className="status-pulse-bar">
              <div className="status-pulse-fill" />
            </div>

            <p className="status-hint">
              Do not close this page. This may take up to 60 seconds.
            </p>
          </>
        )}

        {/* brief screen before redirect*/}
        {status === "SUCCESS" && (
          <>
            <div className="status-success-icon">
              <CheckCircle2 size={36} className="text-green-500" />
            </div>
            <h2 className="status-title">Payment Confirmed!</h2>
            <p className="status-subtitle">
              Your booking is active. Taking you to your consultations...
            </p>
          </>
        )}

        {/*FAILED */}
        {status === "FAILED" && !error && (
          <>
            <div className="status-error-icon">
              <XCircle size={36} className="text-error" />
            </div>
            <h2 className="status-title">Payment Failed</h2>
            <p className="status-subtitle">
              Your payment was not completed. Redirecting you back...
            </p>
          </>
        )}

        {/*ERROR*/}
        {error && (
          <>
            <div className="status-error-icon">
              <XCircle size={36} className="text-error" />
            </div>
            <h2 className="status-title">Payment Confirmation Failed</h2>
            <p className="status-subtitle">{error}</p>
          </>
        )}

      </div>
    </div>
  );
};

export default PaymentStatusScreen;