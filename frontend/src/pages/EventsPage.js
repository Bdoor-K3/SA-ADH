import React, { useEffect, useState } from "react";
import { fetchEvents } from "../services/api";
import { useNavigate } from 'react-router-dom';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getEvents = async () => {
      const data = await fetchEvents();
      setEvents(data);
    };

    getEvents();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/event/${id}`);
  };

  return (
    <div className="events-page">
      <h1>All Events</h1>
      <div className="events-grid">
        {events.map((event) => (
                 <div className="event-card">
                 <h3>{event.name}</h3>
                 <p>{event.description}</p>
                 <p>Date: {new Date(event.dateOfEvent).toLocaleDateString()}</p>
                 <button onClick={() => handleViewDetails(event._id)}>
                   More Details
                 </button>
               </div>
        ))}
      </div>
    </div>
  );
}

export default EventsPage;
