import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { verifyPayment } from '../services/api';
import './CartSuccessPage.css';

/**
 * CartSuccessPage Component
 * Handles payment verification and redirects the user upon successful payment.
 */
function CartSuccessPage({ setCart }) {
  const { t } = useTranslation(); // Translation hook for multi-language support
  const navigate = useNavigate(); // Navigation hook for redirection
  const location = useLocation(); // Access to URL parameters

  const [verifiedTickets, setVerifiedTickets] = useState([]); // Stores verified tickets
  const [isVerifying, setIsVerifying] = useState(true); // Tracks the verification state
  const [errorMessage, setErrorMessage] = useState(''); // Stores error messages
  const [hasVerified, setHasVerified] = useState(false); // Ensures verification is only triggered once

  /**
   * Handles payment verification on component mount.
   */
  useEffect(() => {
    if (hasVerified) return; // Prevent duplicate API calls

    const queryParams = new URLSearchParams(location.search);
    const tap_id = queryParams.get('tap_id'); // Extract the tap_id from URL

    if (!tap_id) {
      setErrorMessage(t('payment.errorMissingTapId'));
      setIsVerifying(false);
      return;
    }

    setHasVerified(true); // Mark as verified to avoid duplicate calls

    // Call the API to verify the payment
    verifyPayment(tap_id)
      .then((response) => {
        if (response.status === 'success') {
          setVerifiedTickets(response.tickets); // Save verified tickets
          setCart([]); // Clear the cart
          localStorage.setItem('cart', JSON.stringify([])); // Sync cart with localStorage

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
        setIsVerifying(false); // Stop loading state
      });
  }, [location.search, t, setCart, navigate, hasVerified]);

  /**
   * Renders a loading message while verifying payment.
   */
  if (isVerifying) {
    return <p className="loading">{t('payment.verifying')}</p>;
  }

  /**
   * Renders an error message if payment verification fails.
   */
  if (errorMessage) {
    return <p className="error-message">{errorMessage}</p>;
  }

  // No direct content; redirection occurs upon success.
  return null;
}

export default CartSuccessPage;
