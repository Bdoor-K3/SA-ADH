import React, { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';
import { validateTicket, fetchTickets, markTicketAsUsed } from '../../services/api';
import './ScanTickets.css';

/**
 * ScanTickets Component
 * Allows organizers to scan tickets using QR codes or mark attendance manually.
 */
function ScanTickets() {
  const [validationMessage, setValidationMessage] = useState(''); // Validation success message
  const [errorMessage, setErrorMessage] = useState(''); // Validation error message
  const [showNextScanButton, setShowNextScanButton] = useState(false); // State to show "Next Scan" button
  const [tickets, setTickets] = useState([]); // All tickets for the event
  const [search, setSearch] = useState(''); // Search input for manual attendance
  const [filteredTickets, setFilteredTickets] = useState([]); // Filtered tickets based on search
  const eventId = window.location.pathname.split('/').pop(); // Extract event ID from URL

  /**
   * Fetches tickets for the event on component mount.
   */
  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await fetchTickets(`eventId=${eventId}`);
        setTickets(data);
        setFilteredTickets(data);
      } catch (error) {
        console.error('Error loading tickets:', error);
        setErrorMessage('Failed to load tickets. Please try again later.');
      }
    };

    loadTickets();
  }, [eventId]);

  /**
   * Handles scanning of a QR code.
   * @param {Object} data - The scanned QR code data.
   */
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

  /**
   * Handles errors during QR code scanning.
   * @param {Object} err - The scanning error.
   */
  const handleError = (err) => {
    console.error('Error scanning QR code:', err);
    setErrorMessage('Error scanning QR code. Please try again.');
  };

  /**
   * Resets the scanning state to allow scanning the next ticket.
   */
  const handleNextScan = () => {
    setValidationMessage('');
    setErrorMessage('');
    setShowNextScanButton(false);
  };

  /**
   * Filters tickets based on the search input.
   * @param {Object} e - The search input event.
   */
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearch(searchValue);

    if (searchValue.trim() === '') {
      setFilteredTickets(tickets);
    } else {
      setFilteredTickets(
        tickets.filter(
          (ticket) =>
            (ticket.buyerId.email && ticket.buyerId.email.toLowerCase().includes(searchValue)) ||
            (ticket.buyerId.phoneNumber && ticket.buyerId.phoneNumber.includes(searchValue))
        )
      );
    }
  };

  /**
   * Marks a ticket as used.
   * Refreshes the ticket list after marking.
   * @param {string} ticketId - The ID of the ticket to mark as used.
   */
  const handleMarkAsUsed = async (ticketId) => {
    try {
      await markTicketAsUsed(ticketId);
      alert('Ticket marked as used successfully.');
      const data = await fetchTickets(`eventId=${eventId}`);
      setTickets(data);
      setFilteredTickets(data);
    } catch (error) {
      console.error('Error marking ticket as used:', error);
      alert('Failed to mark ticket as used.');
    }
  };

  // QR Scanner preview styles
  const previewStyle = {
    height: 240,
    width: 320,
  };

  // Constraints for the camera
  const videoConstraints = {
    facingMode: { exact: 'environment' },
  };

  return (
    <div className="scan-tickets">
      <h1 className="page-title">Scan Tickets</h1>

      {/* QR Code Scanner */}
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

      {/* Manual Attendance Section */}
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
