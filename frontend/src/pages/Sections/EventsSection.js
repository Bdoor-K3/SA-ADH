import React from 'react';
import './EventsSection.css';

function EventsSection({ events, onViewDetails }) {
  return (
    <section id="events">
      <h2>Upcoming Events</h2>
      <div className="event-cards">
        {events.map((event) => (
          <div
            className="event-card"
            key={event._id}
            onClick={() => onViewDetails(event._id)}
          >
            <div className="card-header">
              <h3>{event.name}</h3>
            </div>
            <div className="card-body">
              <p>{event.description}</p>
              <p>Date: {new Date(event.dateOfEvent).toLocaleDateString()}</p>
              <p>Currency: {event.currency}</p>
              <p>Price: {event.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default EventsSection;
