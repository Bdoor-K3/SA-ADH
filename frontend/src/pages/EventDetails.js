import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getEventById, purchaseTicket, verifyPayment } from '../services/api';
import './EventDetails.css';

function EventDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [event, setEvent] = useState(null);
  const [ticket, setTicket] = useState(null); // Holds ticket details
  const [paymentStatus, setPaymentStatus] = useState(null); // Holds payment state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch event details on load
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        setError(t('eventDetails.error.fetchDetails'));
        console.error(err);
      }
    };

    fetchEventDetails();
  }, [id, t]);

  // Handle payment verification if `tap_id` exists in the query string
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tap_id = queryParams.get('tap_id'); // Get `tap_id` from the query string

    if (tap_id) {
      setLoading(true);
      const verifyPaymentStatus = async () => {
        try {
          const response = await verifyPayment(tap_id); // Verify payment with backend
          setTicket(response.ticket); // Set ticket details (for QR code)
          setPaymentStatus('approved');
        } catch (err) {
          console.error('Error verifying payment:', err);
          setError(t('eventDetails.error.verifyPayment'));
          setPaymentStatus('failed');
        } finally {
          setLoading(false);
        }
      };

      verifyPaymentStatus();
    }
  }, [location.search, t]);

  const handlePurchaseTicket = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert(t('eventDetails.loginPrompt'));
      navigate('/login');
      return;
    }

    try {
      const response = await purchaseTicket(id); // Call the purchase ticket API
      if (response.url) {
        // Redirect the user to Tap Payments page
        window.location.href = response.url;
      } else {
        alert(t('eventDetails.error.noPaymentUrl'));
      }
    } catch (err) {
      setError(err.response?.data?.message || t('eventDetails.error.purchaseTicket'));
    }
  };

  if (!event) {
    return <p className="loading">{t('eventDetails.loading')}</p>;
  }

  return (
    <div className="event-details">
      <header className="event-header">
        <div className="event-header-content">
          <div>
            <h1 className="event-title">{event.name}</h1>
            <p>{t('eventDetails.organizedBy')}: {event.organizer}</p>
          </div>
          <div className="social-links">
            <a href="#facebook" className="social-link">F</a>
            <a href="#twitter" className="social-link">T</a>
            <a href="#instagram" className="social-link">I</a>
          </div>
        </div>
      </header>

      <div className="event-card">
        <div className="event-dates">
          <div className="date-item">
            <span>{new Date(event.startDate).getDate()}</span>
            {new Date(event.startDate).toLocaleString('default', { month: 'short' })}
          </div>
          <div className="date-item">
            <span>{new Date(event.endDate).getDate()}</span>
            {new Date(event.endDate).toLocaleString('default', { month: 'short' })}
          </div>
        </div>
        <h2>{event.details}</h2>
        <p>{event.description}</p>
        <div className="ticket-info">
          <p>{t('eventDetails.ticketsAvailable')}: {event.ticketsAvailable}</p>
          <p>{t('eventDetails.price')}: ${event.price}</p>
        </div>
        <button
          onClick={handlePurchaseTicket}
          className="buy-ticket-button"
          disabled={loading}
        >
          {t('eventDetails.buyTicket')}
        </button>
      </div>

      {paymentStatus && (
        <div className={`payment-status ${paymentStatus}`}>
          {paymentStatus === 'approved' ? (
            <div className="payment-approved">
              <h2>{t('eventDetails.paymentSuccess')}</h2>
              <p>{t('eventDetails.thankYou')}</p>
              <div className="ticket-invoice">
                <h3>{t('eventDetails.invoice')}</h3>
                <p>{t('eventDetails.event')}: {event.name}</p>
                <p>{t('eventDetails.price')}: ${event.price}</p>
                <p>{t('eventDetails.date')}: {new Date(event.dateOfEvent).toLocaleDateString()}</p>
                <div className="qr-code">
                  <img src={ticket.QRCodeImage} alt="QR Code" />
                </div>
              </div>
            </div>
          ) : (
            <div className="payment-failed">
              <h2>{t('eventDetails.paymentFailed')}</h2>
              <p>{t('eventDetails.reason')}: {error || t('eventDetails.unknownError')}</p>
            </div>
          )}
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default EventDetails;
