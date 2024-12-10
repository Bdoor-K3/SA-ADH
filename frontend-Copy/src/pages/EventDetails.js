import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getEventById, purchaseTicket, purchaseFreeTicket, verifyPayment } from '../services/api';
import './EventDetails.css';

function EventDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [event, setEvent] = useState(null);
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
    const tap_id = queryParams.get('tap_id');

    if (tap_id) {
      setLoading(true);
      const verifyPaymentStatus = async () => {
        try {
          const response = await verifyPayment(tap_id);
          // Redirect to Ticket Page with ticket and event details
          navigate('/ticket', { state: { ticket: response.data.ticket, event } });
        } catch (err) {
          console.error('Error verifying payment:', err);
          setError(t('eventDetails.error.verifyPayment'));
        } finally {
          setLoading(false);
        }
      };

      verifyPaymentStatus();
    }
  }, [location.search, t, navigate, event]);

  const handlePurchaseTicket = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert(t('eventDetails.loginPrompt'));
      navigate('/login');
      return;
    }

    try {
      if (event.price === 0) {
        // Use the free ticket endpoint
        const response = await purchaseFreeTicket(id);
        // Redirect to Ticket Page with ticket details
        navigate('/ticket', { state: { ticket: response.ticket, event } });
      } else {
        // Use the payment-required endpoint
        const response = await purchaseTicket(id);
        if (response.url) {
          window.location.href = response.url; // Redirect to payment URL
        } else {
          alert(t('eventDetails.error.noPaymentUrl'));
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || t('eventDetails.error.purchaseTicket'));
    }
  };

  const handleOpenLocation = () => {
    const locationLink = event.location;
    window.open(locationLink, '_blank');
  };

  if (!event) {
    return <p className="loading">{t('eventDetails.loading')}</p>;
  }

  return (
    <div className={`event-details-container ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="event-details-header">
        <h2>
          {t('eventDetails.breadcrumb')} &gt; {event.name}
        </h2>
      </div>
      <div className="event-banner" style={{ backgroundImage: `url(${event.bannerImage})` }}>
        <div className="banner-overlay"></div>
      </div>
      <div className="event-details-content">
        <div className="ticket-purchase-box">
          <p className="price-info">
            {t('eventDetails.priceStart')} {event.price} {event.currency}{' '}
            {t('eventDetails.taxIncluded')}
          </p>
          <button className="purchase-button" onClick={handlePurchaseTicket}>
            {t('eventDetails.bookNow')}
          </button>
        </div>
        <div className="event-info">
          <div className="event-info-box">
            <div className="event-date-location">
              <div className="date-box">
                <p className="date-label">{t('eventDetails.date')}</p>
                <p className="date-value">
                  {new Date(event.purchaseStartDate).toLocaleDateString()} -{' '}
                  {new Date(event.purchaseEndDate).toLocaleDateString()}
                  <span> </span>{event.timeStart}-{event.timeEnd}
                </p>
              </div>
              <div className="location-box" onClick={handleOpenLocation}>
                <p className="location-label">{t('eventDetails.location')}</p>
                <p className="location-value">{event.city}</p>
              </div>
            </div>
          </div>
          <div className="event-description">
            <h3>{t('eventDetails.about')}</h3>
            <p>{event.description}</p>
            <h3>{t('eventDetails.termsAndConditions')}</h3>
            <p>
              {t('eventDetails.terms')} {new Date(event.purchaseStartDate).toLocaleDateString()}.
            </p>
          </div>
        </div>
      </div>
      <div className="fixed-price-box">
        <p className="price-info">
          {t('eventDetails.priceStart')} {event.price} {event.currency}
        </p>
        <button className="purchase-button" onClick={handlePurchaseTicket}>
          {t('eventDetails.bookNow')}
        </button>
      </div>
    </div>
  );
}

export default EventDetails;
