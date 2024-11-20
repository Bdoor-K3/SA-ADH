import React, { useEffect, useState } from "react";
import { fetchEvents } from "../services/api";

function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      const data = await fetchEvents();
      setEvents(data);
    };

    getEvents();
  }, []);

  return (
    <div className="events-page">
      <h1>All Events</h1>
      <div className="events-grid">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <h3>{event.name}</h3>
            <p>{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsPage;
