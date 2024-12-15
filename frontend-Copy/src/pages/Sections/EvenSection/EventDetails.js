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

  /**
   * Fetches event details when the component mounts.
   * Handles errors gracefully and sets the default ticket selection.
   */
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

  /**
   * Handles adding tickets to the cart.
   * Ensures valid input values and updates the cart appropriately.
   */
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
        // Update quantity for an existing item.
        return prevCart.map((item) =>
          item.eventId === id && item.ticketClass === selectedPrice.name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add a new item to the cart.
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

  /**
   * Validates and ensures quantity is at least 1.
   * @param {Event} e - The change event.
   */
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(Math.max(1, isNaN(value) ? 1 : value));
  };

  if (!event) {
    return <p>{t('eventDetails.loading')}</p>;
  }

  return (
    <div className={`event-details-container ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Breadcrumb and Event Name */}
      <div className="event-details-header">
        <h2>
          {t('eventDetails.breadcrumb')} &gt; {event.name}
        </h2>
      </div>

      {/* Event Banner */}
      <div className="event-banner" style={{ backgroundImage: `url(${event.bannerImage})` }}>
        <div className="banner-overlay"></div>
      </div>

      {/* Main Content */}
      <div className="event-details-content">
        {/* Ticket Purchase Box */}
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
              onChange={handleQuantityChange}
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

        {/* Event Information */}
        <div className="event-info">
          <div className="event-info-box">
            <div className="event-date-location">
              <div className="date-box">
                <p className="date-label">{t('eventDetails.date')}</p>
                <p className="date-value">
                  {new Date(event.purchaseStartDate).toLocaleDateString()} -{' '}
                  {new Date(event.purchaseEndDate).toLocaleDateString()} <span> </span>
                  {event.timeStart}-{event.timeEnd}
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