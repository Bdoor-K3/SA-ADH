import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getEventById } from '../services/api';
import './EventDetails.css';

function EventDetails({ cart, setCart }) {
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const [event, setEvent] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
        if (data.tickets && data.tickets.length > 0) {
          setSelectedPrice(data.tickets[0]); // Set default ticket
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedPrice || quantity < 1) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.eventId === id && item.ticketClass === selectedPrice.name
      );

      if (existingItem) {
        // Update quantity for existing item
        return prevCart.map((item) =>
          item.eventId === id && item.ticketClass === selectedPrice.name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        const newItem = {
          eventId: id,
          eventName: event.name,
          ticketClass: selectedPrice.name,
          price: selectedPrice.price,
          quantity,
          currency: event.currency,
        };
        return [...prevCart, newItem];
      }
    });
  };

  if (!event) {
    return <p>{t('eventDetails.loading')}</p>;
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
          <div className="price-list">
            <label>{t('eventDetails.selectTicket')}</label>
            <select
              value={selectedPrice ? selectedPrice._id : ''}
              onChange={(e) =>
                setSelectedPrice(event.tickets.find((ticket) => ticket._id === e.target.value))
              }
            >
              {event.tickets.map((ticket) => (
                <option key={ticket._id} value={ticket._id}>
                  {ticket.name} - {ticket.price} {event.currency}
                </option>
              ))}
            </select>
          </div>
          <div className="quantity-box">
            <label>{t('eventDetails.quantity')}</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
            />
          </div>
          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={!selectedPrice || quantity < 1}
          >
            {t('eventDetails.addToCart')}
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
              <div className="location-box">
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
    </div>
  );
}

export default EventDetails;
