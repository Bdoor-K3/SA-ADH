import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents } from '../services/api';
import './Home.css';

function Home() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    getEvents();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/event/${id}`);
  };

  return (
    <div className="home">
      <h2>Upcoming Events</h2>
      <div className="event-cards">
        {events.map((event) => (
          <div className="event-card" key={event._id}>
            <h3>{event.name}</h3>
            <p>{event.description}</p>
            <p>Date of Event: {new Date(event.dateOfEvent).toLocaleDateString()}</p>
            <p>Price: ${event.price}</p>
            <button onClick={() => handleViewDetails(event._id)}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
