import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { verifyPayment } from '../services/api';
import './CartSuccessPage.css';

function CartSuccessPage({ setCart }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [verifiedTickets, setVerifiedTickets] = useState([]);
  const [isVerifying, setIsVerifying] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasVerified, setHasVerified] = useState(false); // Track if the request has been made

  useEffect(() => {
    if (hasVerified) return; // Prevent additional API calls

    const queryParams = new URLSearchParams(location.search);
    const tap_id = queryParams.get('tap_id');

    if (!tap_id) {
      setErrorMessage(t('payment.errorMissingTapId'));
      setIsVerifying(false);
      return;
    }

    setHasVerified(true); // Set the flag before making the API request

    // Verify payment
    verifyPayment(tap_id)
      .then((response) => {
        if (response.status === 'success') {
          setVerifiedTickets(response.tickets);
          setCart([]); // Clear the cart after success
          localStorage.setItem('cart', JSON.stringify([])); // Sync with localStorage

          // Redirect to TicketPage with tickets and event details
          navigate('/ticket', { state: { tickets: response.tickets, events: [response.event] } });
        } else {
          setErrorMessage(t('payment.error'));
        }
      })
      .catch((err) => {
        console.error('Error verifying payment:', err);
        setErrorMessage(t('payment.error'));
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, [location.search, t, setCart, navigate, hasVerified]);

  if (isVerifying) {
    return <p className="loading">{t('payment.verifying')}</p>;
  }

  if (errorMessage) {
    return <p className="error-message">{errorMessage}</p>;
  }

  return null; // This page is used for intermediate verification; redirect occurs upon success.
}

export default CartSuccessPage;
