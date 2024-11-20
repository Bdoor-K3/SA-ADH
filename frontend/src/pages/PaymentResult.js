import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyPayment } from '../services/api';

function PaymentResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const processPayment = async () => {
      const queryParams = new URLSearchParams(location.search);
      const tap_id = queryParams.get('tap_id'); // Get `tap_id` from query string

      if (!tap_id) {
        setMessage('Payment verification failed: Missing payment ID.');
        setLoading(false);
        return;
      }

      try {
        const response = await verifyPayment(tap_id); // Call backend to verify payment
        if (response.success) {
          setMessage('Payment successful! Your ticket has been issued.');
        } else {
          setMessage('Payment failed or was not completed.');
        }
      } catch (error) {
        setMessage('Error verifying payment.');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [location]);

  if (loading) {
    return <p>Processing your payment, please wait...</p>;
  }

  return (
    <div>
      <h1>Payment Status</h1>
      <p>{message}</p>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
}

export default PaymentResult;
