import React, { useState, useEffect } from 'react';
import { fetchEventsForOrganizer } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './OrganizerDashboard.css';

function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEventsForOrganizer();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events for organizer:', error);
      }
    };

    loadEvents();
  }, []);

  const handleScanTickets = (eventId) => {
    navigate(`/organizer/scan/${eventId}`);
  };

  return (
    <div className="organizer-dashboard">
      <h1>Organizer Dashboard</h1>
      <h2>Assigned Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <h3>{event.name}</h3>
            <p>Date: {new Date(event.dateOfEvent).toLocaleDateString()}</p>
            <button onClick={() => handleScanTickets(event._id)}>Scan Tickets</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrganizerDashboard;
