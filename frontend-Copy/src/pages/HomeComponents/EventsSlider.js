import React from 'react';
import Slider from 'react-slick';
import './EventsSlider.css';

const EventsSlider = ({ events, handleViewDetails, sliderSettings, t }) => {
  return (
    <section id="events-slider" className="custom-slider-section">
      <Slider {...sliderSettings}>
        {events.map((event) => (
          <div key={event._id} className="custom-ticket-card">
            {/* Full Background Image */}
            <div
              className="custom-event-banner"
              style={{
                backgroundImage: `url(${event.image})`,
              }}
            >
              {/* Overlay Content */}
              <div className="custom-event-overlay">
                <h2 className="custom-event-title">{event.name}</h2>
                <p className="custom-event-description">{event.description}</p>
                <div className="custom-event-price">
                  {t ? t('home.price') : 'Price'}: {event.price} USD
                </div>
                <button
                  className="custom-book-button"
                  onClick={() => handleViewDetails(event._id)}
                >
                  {t ? t('home.bookNow') : 'Book Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default EventsSlider;
