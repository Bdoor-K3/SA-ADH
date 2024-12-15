import React, { useState, useEffect } from 'react';
import { fetchEventsForOrganizer } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './OrganizerDashboard.css';

/**
 * OrganizerDashboard Component
 * Displays the list of events assigned to the organizer and provides options to scan tickets.
 */
function OrganizerDashboard() {
  const [events, setEvents] = useState([]); // State to store events assigned to the organizer
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to store error messages
  const navigate = useNavigate();

  /**
   * Fetches events assigned to the organizer on component mount.
   */
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEventsForOrganizer();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events for organizer:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  /**
   * Navigates to the ticket scanning page for the selected event.
   * @param {string} eventId - The ID of the event to scan tickets for.
   */
  const handleScanTickets = (eventId) => {
    if (!eventId) {
      console.error('Invalid event ID');
      return;
    }
    navigate(`/organizer/scan/${eventId}`);
  };

  return (
    <div className="organizer-dashboard">
      <h1>Organizer Dashboard</h1>
      <h2>Assigned Events</h2>

      {/* Display loading state */}
      {loading && <p className="loading">Loading events...</p>}

      {/* Display error message */}
      {error && <p className="error-message">{error}</p>}

      {/* Display list of events */}
      {!loading && !error && (
        events.length > 0 ? (
          <ul className="event-list">
            {events.map((event) => (
              <li key={event._id} className="event-item">
                <h3>{event.name}</h3>
                <p>Date: {new Date(event.dateOfEvent).toLocaleDateString()}</p>
                <button onClick={() => handleScanTickets(event._id)} className="scan-button">
                  Scan Tickets
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-events">No assigned events found.</p>
        )
      )}
    </div>
  );
}

export default OrganizerDashboard;