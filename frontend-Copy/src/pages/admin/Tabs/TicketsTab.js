import React, { useState, useEffect } from 'react';
import { fetchTickets, fetchEvents } from '../../../services/api';
import './TicketsTab.css';

function TicketsTab() {
  // State management for tickets, events, filters, and UI states
  const [tickets, setTickets] = useState([]); // Stores the list of tickets
  const [events, setEvents] = useState([]); // Stores the list of events
  const [email, setEmail] = useState(''); // Filter: user email
  const [eventId, setEventId] = useState(''); // Filter: event ID
  const [used, setUsed] = useState(''); // Filter: ticket usage status
  const [loading, setLoading] = useState(false); // Indicates loading state
  const [error, setError] = useState(''); // Stores error messages

  // Fetches all tickets based on filter criteria
  const fetchAllTickets = async () => {
    setLoading(true);
    setError(''); // Clear previous errors
    try {
      const queryParams = new URLSearchParams();
      if (email) queryParams.append('email', email.trim());
      if (eventId) queryParams.append('eventId', eventId);
      if (used) queryParams.append('used', used);

      const data = await fetchTickets(queryParams.toString());
      setTickets(data);
    } catch (err) {
      setError('Error fetching tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetches the list of all events
  const fetchAllEvents = async () => {
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  // Fetches initial data when the component mounts
  useEffect(() => {
    fetchAllEvents();
    fetchAllTickets();
  }, []);

  // Handles the filter form submission
  const handleFilter = (e) => {
    e.preventDefault();
    fetchAllTickets();
  };

  return (
    <div className="tickets-tab">
      <h2>Tickets Management</h2>

      {/* Filter Form */}
      <form onSubmit={handleFilter} className="filter-form">
        <label htmlFor="email">Filter by Email:</label>
        <input
          id="email"
          type="email"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="event">Filter by Event:</label>
        <select
          id="event"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        >
          <option value="">All Events</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.name}
            </option>
          ))}
        </select>

        <label htmlFor="status">Filter by Status:</label>
        <select
          id="status"
          value={used}
          onChange={(e) => setUsed(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="true">Used</option>
          <option value="false">Unused</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Filtering...' : 'Filter'}
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Tickets Table */}
      <table className="tickets-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>User</th>
            <th>Status</th>
            <th>Purchase Date</th>
            <th>Usage Date</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.eventId?.name || 'Unknown Event'}</td>
                <td>{ticket.buyerId?.email || 'N/A'}</td>
                <td>{ticket.used ? 'Used' : 'Unused'}</td>
                <td>{new Date(ticket.purchaseDate).toLocaleDateString()}</td>
                <td>{ticket.useDate ? new Date(ticket.useDate).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No tickets found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TicketsTab;
