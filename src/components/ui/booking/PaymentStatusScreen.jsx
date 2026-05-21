import { useEffect } from "react";
import { Loader2, XCircle } from "lucide-react";
import usePaymentPolling from "../../../hooks/usePaymentPolling";
import { formatCurrency } from "../../../utils/formatCurrency";

const PaymentStatusScreen = ({
  checkoutReqId,
  amount,
  onSuccess,
  onFailed,
}) => {
  // Start polling as soon as this component mounts with enabled = true
  const { status, error, attempts } = usePaymentPolling(checkoutReqId, true);

  // React to status changes and trigger the correct BookingPage callback
  useEffect(() => {
    if (status === "SUCCESS") onSuccess();
    if (status === "FAILED") onFailed();
  }, [status]);

  // Trigger onFailed if polling hook sets an error (timeout or network failure)
  useEffect(() => {
    if (error) onFailed();
  }, [error]);

  return (
    <div className="status-screen-wrapper">
      <div className="status-screen-card">
        {/* Waiting state — shown while payment status is still PENDING */}
        {status === "PENDING" && !error && (
          <>
            <div className="status-spinner-ring">
              <Loader2 size={36} className="text-secondary animate-spin" />
            </div>

            <h2 className="status-title">Waiting for Payment</h2>

            {/* Prompt user to act on the STK push notification on their phone */}
            <p className="status-subtitle">
              Check your phone and enter your M-Pesa PIN to confirm{" "}
              <strong>{formatCurrency(amount)}</strong>.
            </p>

            {/* Attempt counter shows user the system is actively checking */}
            <p className="status-attempts">
              Checking payment status... (attempt {attempts} of 20)
            </p>

            {/* Animated pulse bar — visual indicator of active polling */}
            <div className="status-pulse-bar">
              <div className="status-pulse-fill" />
            </div>

            {/* Warning not to close the page during the polling window */}
            <p className="status-hint">
              Do not close this page. This may take up to 60 seconds.
            </p>
          </>
        )}

        {/* FAILED state — brief UI shown before BookingPage redirects back */}
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

        {/* Error state — shown on timeout or network failure */}
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
