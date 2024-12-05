import React from 'react';
import Slider from 'react-slick';
import './EventsSlider.css';

const EventsSlider = ({ events, handleViewDetails, sliderSettings, t }) => {
  return (
    <section id="events-slider" className="custom-slider-section">
      <Slider {...sliderSettings}>
        {events.map((event) => (
          <div key={event._id} className="custom-ticket-card">
            {/* Left Section: Event Details */}
            <div className="custom-event-details">
              <h2 className="custom-event-title">{event.name}</h2>
              <p className="custom-event-description">{event.description}</p>
              <div className="custom-event-info">
                <span className="custom-event-time">
                  <i className="fas fa-clock"></i> {event.timeStart} -   {event.timeEnd}
                </span>
                <span className="custom-event-date">
                  <i className="fas fa-calendar-alt"></i>{' '}
                  {new Date(event.dateOfEvent).toLocaleDateString()}
                </span>
              </div>
              <button
                className="custom-book-button"
                onClick={() => handleViewDetails(event._id)}
              >
                {t ? t('home.bookNow') : 'Book Now'}
              </button>
            </div>

            {/* Right Section: Event Image */}
            <div className="event-right">
              <img src={event.image} alt={event.name} />
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default EventsSlider;
