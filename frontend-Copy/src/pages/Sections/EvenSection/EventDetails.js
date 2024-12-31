import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getEventById } from '../../../services/api';
import './EventDetails.css';

/**
 * EventDetails Component
 * Displays detailed information about a specific event, including ticket options and purchase functionality.
 */
function EventDetails({ cart, setCart }) {
  const { id } = useParams(); // Retrieves the event ID from the URL.
  const { t, i18n } = useTranslation();

  const [event, setEvent] = useState(null); // Stores event details.
  const [selectedPrice, setSelectedPrice] = useState(null); // Tracks the selected ticket price.
  const [quantity, setQuantity] = useState(1); // Tracks the ticket quantity.

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
        if (data.tickets && data.tickets.length > 0) {
          setSelectedPrice(data.tickets[0]); // Set the default ticket.
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedPrice || quantity < 1) {
      console.error('Invalid ticket selection or quantity');
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.eventId === id && item.ticketClass === selectedPrice.name
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.eventId === id && item.ticketClass === selectedPrice.name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
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

const [standardQuantity, setStandardQuantity] = useState(1);
const [premiumQuantity, setPremiumQuantity] = useState(1);
const [vipQuantity, setVipQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(Math.max(1, isNaN(value) ? 1 : value));
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
            <input type="number" min="1" value={quantity} onChange={handleQuantityChange} />
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
            <div className="event-cards">
              <div className="event-card">
                <i className="fas fa-calendar-alt"></i>
                <p>{t('eventDetails.date')}</p>
                <p>
                  {new Date(event.purchaseStartDate).toLocaleDateString()} -{' '}
                  {new Date(event.purchaseEndDate).toLocaleDateString()}
                </p>
              </div>
              <div className="event-card">
                <i className="fas fa-map-marker-alt"></i>
                <p>{t('eventDetails.location')}</p>
                <p>{event.city}</p>
              </div>
              <div className="event-card">
                <i className="fas fa-clock"></i>
                <p>{t('eventDetails.time')}</p>
                <p>
                  {event.timeStart} - {event.timeEnd}
                </p>
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

      <div className="event-details-header">
        <h2>{t('eventDetails.eventsCategories')}</h2>
        <div className="pricing-container">
          <div className="pricing-card">
            <div className="card-header">Standard</div>
            <div className="card-price">88SR</div>
            <div className="card-content">
              <p>Support seats? Yes</p>
              <div className="quantity-box1">
              <label>{t('eventDetails.quantity')}</label>
              <input
                type="number"
                min="1"
                value={standardQuantity}
                onChange={(e) => setStandardQuantity(e.target.value)}
              />
            </div>
            <button
              className="card-button"
              onClick={() => handleAddToCart('Standard', standardQuantity)}
              disabled={standardQuantity < 1}
            >
              {t('eventDetails.addToCart')}
            </button>
          </div>
        </div>
          <div className="pricing-card">
            <div className="card-header">Premium</div>
            <div className="card-price">188SR</div>
            <div className="card-content">
              <p>Support seats? Yes</p>
              <div className="quantity-box1">
              <label>{t('eventDetails.quantity')}</label>
        <input
          type="number"
          min="1"
          value={premiumQuantity}
          onChange={(e) => setPremiumQuantity(e.target.value)}
        />
      </div>
            <button
              className="card-button"
              onClick={() => handleAddToCart('Premium', premiumQuantity)}
              disabled={premiumQuantity < 1}
            >
              {t('eventDetails.addToCart')}
            </button>
          </div>
        </div>
          <div className="pricing-card">
            <div className="card-header">VIP</div>
            <div className="card-price">288SR</div>
            <div className="card-content">
              <p>Support seats? Yes</p>
              <div className="quantity-box1">
              <label>{t('eventDetails.quantity')}</label>
              <input
                type="number"
                min="1"
                value={vipQuantity}
                onChange={(e) => setVipQuantity(e.target.value)}
              />
            </div>
            <button
              className="card-button"
              onClick={() => handleAddToCart('VIP', vipQuantity)}
              disabled={vipQuantity < 1}
            >
              {t('eventDetails.addToCart')}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
