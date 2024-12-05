import React from 'react';
import './EventList.css';

const EventList = ({ events, handleViewDetails, t }) => {
  const getButtonColor = (image) => {
    // Function to calculate dynamic color for buttons (placeholder)
    // You can implement image color extraction here if needed
    return '#ff69b4'; // Example color
  };

  return (
    <section id="event-list">
      <h2 className="section-title">{t('home.latestEvents')}</h2>
      <div className="event-cards">
        {events.map((event) => (
          <div key={event._id} className="event-card-container">
            <div className="ticket-card">
              <div className="event-image-container">
                <img src={event.image} alt={event.name} className="event-list-image" />
              </div>
              <div className="ticket-content">
                <h3 className="event-title">{event.name}</h3>
                <p className="event-date">
                  <i className="fas fa-calendar-alt"></i>{' '}
                  {new Date(event.dateOfEvent).toLocaleDateString()}
                </p>
                <p className="event-location">
                  <i className="fas fa-map-marker-alt"></i> {event.location}
                </p>
              </div>
              <button
                className="book-button"
                onClick={() => handleViewDetails(event._id)}
                style={{
                  backgroundColor: getButtonColor(event.image), // Dynamic color
                }}
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
