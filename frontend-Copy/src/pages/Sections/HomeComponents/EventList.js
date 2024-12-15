import React from 'react';
import './EventList.css';

/**
 * EventList Component
 * Displays a list of events as cards with details and a booking button.
 * @param {Array} events - List of event objects to display.
 * @param {Function} handleViewDetails - Function to handle navigation to event details.
 * @param {Function} t - Translation function for multi-language support.
 */
const EventList = ({ events, handleViewDetails, t }) => {
  /**
   * Returns a dynamic color for the button based on the image (placeholder).
   * In a real implementation, this could extract dominant colors from the image.
   * @param {string} image - The image URL.
   * @returns {string} - A hex color code.
   */
  const getButtonColor = (image) => {
    return '#ff69b4'; // Placeholder dynamic color
  };

  /**
   * Ensures the handleViewDetails function is valid before calling it.
   * @param {string} eventId - The ID of the event to view details for.
   */
  const onViewDetails = (eventId) => {
    if (typeof handleViewDetails === 'function') {
      handleViewDetails(eventId);
    } else {
      console.error('handleViewDetails is not a valid function');
    }
  };

  return (
    <section id="event-list">
      {/* Section Title */}
      <h2 className="section-title">{t('home.latestEvents')}</h2>

      {/* Event Cards */}
      <div className="event-cards">
        {events.map((event) => (
          <div key={event._id} className="event-card-container">
            <div className="ticket-card">
              {/* Event Image */}
              <div className="event-image-container">
                <img
                  src={event.image || '/assets/default-event.jpg'}
                  alt={event.name || t('home.noImageAvailable')}
                  className="event-list-image"
                />
              </div>

              {/* Event Content */}
              <div className="ticket-content">
                <h3 className="event-title">{event.name}</h3>
                <p className="event-date">
                  <i className="fas fa-calendar-alt"></i>{' '}
                  {event.dateOfEvent
                    ? new Date(event.dateOfEvent).toLocaleDateString()
                    : t('home.noDateAvailable')}
                </p>
                <p className="event-location">
                  <i className="fas fa-map-marker-alt"></i> {event.location || t('home.noLocationAvailable')}
                </p>
              </div>

              {/* Book Now Button */}
              <button
                className="book-button"
                onClick={() => onViewDetails(event._id)}
                style={{ backgroundColor: getButtonColor(event.image) }}
              >
                {t('home.bookNow')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventList;