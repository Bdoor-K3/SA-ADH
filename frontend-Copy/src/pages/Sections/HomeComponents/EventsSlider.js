import React from 'react';
import Slider from 'react-slick';
import './EventsSlider.css';

/**
 * EventsSlider Component
 * Displays a carousel of event banners with a "Book Now" button for each event.
 * @param {Array} events - List of event objects to display in the slider.
 * @param {Function} handleViewDetails - Function to handle navigation to event details.
 * @param {Object} sliderSettings - Configuration for the slider.
 * @param {Function} t - Translation function for multi-language support.
 */
const EventsSlider = ({ events, handleViewDetails, sliderSettings, t }) => {
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
    <section id="events-slider" className="custom-slider-section">
      <Slider {...sliderSettings}>
        {events.map((event) => (
          <div key={event._id} className="custom-ticket-card">
            {/* Full Background Image */}
            <div
              className="custom-event-banner"
              style={{
                backgroundImage: `url(${event.bannerImage || '/assets/default-banner.jpg'})`,
              }}
            >
              {/* Book Now Button */}
              <button
                className="custom-book-button-left"
                onClick={() => onViewDetails(event._id)}
              >
                {t ? t('home.bookNow') : 'Book Now'}
              </button>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default EventsSlider;