import React, { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';
import { validateTicket, fetchTickets, markTicketAsUsed } from '../../services/api';
import './ScanTickets.css';

function ScanTickets() {
  const [validationMessage, setValidationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showNextScanButton, setShowNextScanButton] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredTickets, setFilteredTickets] = useState([]);
  const eventId = window.location.pathname.split('/').pop();

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await fetchTickets(`eventId=${eventId}`);
        setTickets(data);
        setFilteredTickets(data);
      } catch (error) {
        console.error('Error loading tickets:', error);
      }
    };

    loadTickets();
  }, [eventId]);

  const handleScan = async (data) => {
    if (data) {
      try {
        const response = await validateTicket(data.text || data, eventId);
        setValidationMessage(response.message);
        setErrorMessage('');
        setShowNextScanButton(true);
      } catch (error) {
        setValidationMessage('');
        setErrorMessage(error.response?.data?.message || 'Error validating ticket.');
      }
    }
  };

  const handleError = (err) => {
    console.error('Error scanning QR code:', err);
    setErrorMessage('Error scanning QR code. Please try again.');
  };

  const handleNextScan = () => {
    setValidationMessage('');
    setErrorMessage('');
    setShowNextScanButton(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value.trim() === '') {
      setFilteredTickets(tickets);
    } else {
      const lowercasedValue = e.target.value.toLowerCase();
      setFilteredTickets(
        tickets.filter(
          (ticket) =>
            (ticket.buyerId.email && ticket.buyerId.email.toLowerCase().includes(lowercasedValue)) ||
            (ticket.buyerId.phoneNumber && ticket.buyerId.phoneNumber.includes(lowercasedValue))
        )
      );
    }
  };

  const handleMarkAsUsed = async (ticketId) => {
    try {
      await markTicketAsUsed(ticketId);
      alert('Ticket marked as used successfully.');
      // Refresh the tickets
      const data = await fetchTickets(`eventId=${eventId}`);
      setTickets(data);
      setFilteredTickets(data);
    } catch (error) {
      console.error('Error marking ticket as used:', error);
      alert('Failed to mark ticket as used.');
    }
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  const videoConstraints = {
    facingMode: { exact: 'environment' },
  };

  return (
    <div className="scan-tickets">
      <h1 className="page-title">Scan Tickets</h1>
      <div className="scanner-container">
        {!showNextScanButton && (
          <QrScanner
            delay={300}
            style={previewStyle}
            constraints={{ video: videoConstraints }}
            onError={handleError}
            onScan={handleScan}
          />
        )}
        <div aria-live="polite" className="scanner-feedback">
          {validationMessage && <p className="success">{validationMessage}</p>}
          {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
        {showNextScanButton && (
          <button onClick={handleNextScan} className="next-scan-button">
            Scan Next Ticket
          </button>
        )}
      </div>

      <div className="manual-attendance">
  <h2 className="section-title">Manual Attendance</h2>
  <input
    type="text"
    placeholder="Search by email or phone"
    value={search}
    onChange={handleSearch}
    className="search-input"
  />
  <div className="tickets-table-container">
    <table className="tickets-table">
      <thead>
        <tr>
          <th>Email</th>
          <th>Phone</th>
          <th>QR Code</th>
          <th>Used</th>
          <th>Use Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredTickets.map((ticket) => (
          <tr key={ticket._id}>
            <td>{ticket.buyerId.email}</td>
            <td>{ticket.buyerId.phoneNumber || 'N/A'}</td>
            <td>{ticket.QRCode}</td>
            <td>{ticket.used ? 'Yes' : 'No'}</td>
            <td>{ticket.useDate ? new Date(ticket.useDate).toLocaleString() : 'N/A'}</td>
            <td>
              {!ticket.used && (
                <button
                  className="mark-used-button"
                  onClick={() => handleMarkAsUsed(ticket._id)}
                >
                  Mark as Used
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
    </div>
  );
}

export default ScanTickets;
