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
                backgroundImage: `url(${event.bannerImage})`,
              }}
            >
              {/* Book Now Button */}
              <button
                className="custom-book-button-left"
                onClick={() => handleViewDetails(event._id)}
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
