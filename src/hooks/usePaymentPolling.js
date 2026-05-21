
import { useState, useEffect, useRef } from 'react';
import { toast } from "react-toastify";
import { getPaymentStatus } from '../api/booking/bookingApi';

// polls GET /api/pay-status/:checkout_req_id every 3 seconds
// stops automatically on SUCCESS, FAILED, or after MAX_ATTEMPTS (60s timeout)

const usePaymentPolling = (checkoutReqId, enabled)=>{
    // latest payment status from the backend starts as PENDING
    const [status, setStatus] = useState("PENDING");

    // Error message if polling fails or times out
    const [error, setError] = useState(null);

    // count of the no. of attempts that have been fired
    const [attempts, setAttempts] = useState(0);

    // Ref holds the interval ID so we can clear it from inside the async callback
    const intervalRef = useRef(null);

    // 20 attempts × 3 seconds = 60 second maximum wait time
    const MAX_ATTEMPTS = 20;

    useEffect(() => {
        // do not start polling if disabled or checkout ID is not yet available
        if (!enabled || !checkoutReqId) {
            return;
        }
    
        const poll = async () => {
        try {
            const data = await getPaymentStatus(checkoutReqId);
    
            // Increment attempt counter and check if max has been reached
            setAttempts((prev) => {
            const next = prev + 1;

            if (next >= MAX_ATTEMPTS) {
                clearInterval(intervalRef.current);

                // Notify user that the confirmation window has expired
                const msg = "Payment confirmation timed out. Please contact support.";
                toast.error(msg);
                setError(msg);
            }
            return next;
            });
    
            // Update the status with the latest value returned by the backend
            setStatus(data.status);
    
            // Stop polling and show toast as soon as a terminal status is received
            if (data.status === "SUCCESS") {
            clearInterval(intervalRef.current);
            toast.success("Payment confirmed successfully!");
            }
    
            if (data.status === "FAILED") {
            clearInterval(intervalRef.current);
            toast.error("Payment failed. Please try again.");
            }
        } catch (err) {
            // Stop polling on network or unexpected server error
            clearInterval(intervalRef.current);
            const msg = err.response?.data?.message || err.message;
            toast.error(msg);
            setError(msg);
        }
        };
    
        // Fire first poll immediately then repeat every 3 seconds
        poll();
        intervalRef.current = setInterval(poll, 3000);
    
        // Clear interval on unmount or when dependencies change
        return () => clearInterval(intervalRef.current);
    }, [checkoutReqId, enabled]);

    return { status, error, attempts };
};

export default usePaymentPolling;