import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getEventById, purchaseTicket, verifyPayment } from '../services/api';
import './EventDetails.css';

function EventDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [event, setEvent] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTicket, setShowTicket] = useState(true); // State to toggle ticket display

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
    const tap_id = queryParams.get('tap_id');

    if (tap_id) {
      setLoading(true);
      const verifyPaymentStatus = async () => {
        try {
          const response = await verifyPayment(tap_id);
          setTicket(response.data.ticket);
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
      const response = await purchaseTicket(id);
      if (response.url) {
        window.location.href = response.url;
      } else {
        alert(t('eventDetails.error.noPaymentUrl'));
      }
    } catch (err) {
      setError(err.response?.data?.message || t('eventDetails.error.purchaseTicket'));
    }
  };

  const handleCloseTicket = () => {
    setShowTicket(false); // Close ticket display
  };

  const handleOpenLocation = () => {
    const locationLink = event.location;
    window.open(locationLink, '_blank');
  };

  const handleCopyLocation = () => {
    const locationLink = event.location;
    navigator.clipboard.writeText(locationLink);
    alert(t('eventDetails.locationCopied'));
  };

  if (!event) {
    return <p className="loading">{t('eventDetails.loading')}</p>;
  }

  return (
    <div
      className={`event-details ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}
      style={{
        backgroundImage: `url(${event.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <header className="event-header">
        <div className="event-header-content">
          <div>
            <h1 className="event-title">{event.name}</h1>
            <p>{t('eventDetails.organizedBy')}: Admin</p>
          </div>
        </div>
      </header>

      {paymentStatus === 'approved' && ticket && showTicket ? (
        <div className="success-message">
          <button className="close-button" onClick={handleCloseTicket}>
            ✖
          </button>
          <h2>{t('eventDetails.paymentSuccess')}</h2>
          <p>{t('eventDetails.enjoyEvent')}</p>
          <div className="invoice-details">
            <p><strong>{t('eventDetails.invoiceNumber')}:</strong> {ticket._id}</p>
            <p><strong>{t('eventDetails.date')}:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="qr-code-section">
            <img src={ticket.QRCodeImage} alt="QR Code" className="qr-code-image" />
          </div>
          <p className="ticket-profile-notice">
            {t('eventDetails.ticketProfileNotice') || "You can see the Ticket details in Profile."}
          </p>
        </div>
      ) : (
        <div className="event-card">
          <div className="event-map">
            <iframe
              title={t('eventDetails.mapTitle')}
              src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(event.location)}&key=YOUR_API_KEY`}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
          <div className="location-buttons">
            <button onClick={handleOpenLocation} className="open-location-button">
              {t('eventDetails.openLocation')}
            </button>
            <button onClick={handleCopyLocation} className="copy-location-button">
              {t('eventDetails.copyLocation')}
            </button>
          </div>

          <div className="event-dates">
            <div className="date-item">
              <span>{new Date(event.purchaseStartDate).getDate()}</span>
              <span>{new Date(event.purchaseStartDate).toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div className="date-item">
              <span>{new Date(event.purchaseEndDate).getDate()}</span>
              <span>{new Date(event.purchaseEndDate).toLocaleString('default', { month: 'short' })}</span>
            </div>
          </div>
          <h2 className="event-name">{event.name}</h2>
          <p className="event-tickets">
            {t('eventDetails.seats')}: {event.ticketsAvailable} | {t('eventDetails.available')}: {event.ticketsAvailable}
          </p>
          <p>{event.description}</p>
          <p><strong>{t('eventDetails.category')}:</strong> {event.category}</p>
          <p><strong>{t('eventDetails.location')}:</strong> {event.location}</p>
          <p><strong>{t('eventDetails.city')}:</strong> {event.city}</p>
          <div className="ticket-info">
            <p>{t('eventDetails.price')}: ${event.price}</p>
          </div>
          <button
            onClick={handlePurchaseTicket}
            className="buy-ticket-button"
            disabled={loading}
          >
            {t('eventDetails.buyTickets')}
          </button>
        </div>
      )}
    </div>
  );
}

export default EventDetails;
