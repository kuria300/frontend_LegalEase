import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { getPaymentStatus } from "../api/booking/bookingApi";

const usePaymentPolling = (checkoutReqId, enabled) => {
  const [status, setStatus] = useState("PENDING");
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const intervalRef = useRef(null);
  const inFlightRef = useRef(false); 

  const MAX_ATTEMPTS = 20;

  useEffect(() => {
    if (!enabled || !checkoutReqId) return;

    const stopPolling = (msg) => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setError(msg || null);
    };

    const poll = async () => {
      if (inFlightRef.current) return; 

      inFlightRef.current = true;

      try {
        const data = await getPaymentStatus(checkoutReqId);

        setAttempts((prev) => {
          const next = prev + 1;

          if (next >= MAX_ATTEMPTS) {
            stopPolling("Payment confirmation timed out. Please try again.");
            toast.error("Payment confirmation timed out.");
          }

          return next;
        });

        const currentStatus = data?.status;

        if (!currentStatus) return;

        setStatus(currentStatus);

        // TERMINAL STATES
        if (currentStatus === "SUCCESS") {
          stopPolling();
          toast.success("Payment confirmed successfully!");
        }

        if (currentStatus === "FAILED") {
          stopPolling();
          toast.error("Payment failed. Please try again.");
        }

        if (currentStatus === "ERROR") {
          stopPolling("Payment error occurred.");
        }
      } catch (err) {
        stopPolling(err.message || "Polling failed");
        toast.error("Payment status check failed.");
      } finally {
        inFlightRef.current = false;
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 3000);

    return () => clearInterval(intervalRef.current);
  }, [checkoutReqId, enabled]);

  return { status, error, attempts };
};

export default usePaymentPolling;