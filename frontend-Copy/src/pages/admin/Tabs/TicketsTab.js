import React, { useState, useEffect } from 'react';
import { fetchTickets, fetchEvents } from '../../../services/api';
import './TicketsTab.css';

function TicketsTab() {
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [email, setEmail] = useState('');
  const [eventId, setEventId] = useState('');
  const [used, setUsed] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAllTickets = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (email) queryParams.append('email', email);
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

  const fetchAllEvents = async () => {
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  useEffect(() => {
    fetchAllEvents();
    fetchAllTickets();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchAllTickets();
  };

  return (
    <div className="tickets-tab">
      <h2>Tickets Management</h2>

      <form onSubmit={handleFilter} className="filter-form">
        <input
          type="email"
          placeholder="Filter by user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select value={eventId} onChange={(e) => setEventId(e.target.value)}>
          <option value="">Filter by event</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.name}
            </option>
          ))}
        </select>

        <select value={used} onChange={(e) => setUsed(e.target.value)}>
          <option value="">Filter by status</option>
          <option value="true">Used</option>
          <option value="false">Unused</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Filtering...' : 'Filter'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

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
          {tickets.map((ticket) => (
            <tr key={ticket._id}>
              <td>{ticket.eventId.name}</td>
              <td>{ticket.buyerId?.email || 'N/A'}</td>
              <td>{ticket.used ? 'Used' : 'Unused'}</td>
              <td>{new Date(ticket.purchaseDate).toLocaleDateString()}</td>
              <td>{ticket.useDate ? new Date(ticket.useDate).toLocaleDateString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TicketsTab;
