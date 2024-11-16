import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner'; // Install this library
import { validateTicket } from '../../services/api'; // Add API call
import './ScanTickets.css';

function ScanTickets() {
  const [scanResult, setScanResult] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleScan = async (data) => {
    if (data) {
      setScanResult(data);

      try {
        // Validate ticket by sending QR code data and event ID to the backend
        const eventId = window.location.pathname.split('/').pop(); // Get event ID from URL
        const response = await validateTicket(data.text, eventId);

        setValidationMessage(response.message);
        setErrorMessage(''); // Clear error message
      } catch (error) {
        setValidationMessage(''); // Clear validation message
        setErrorMessage(error.response?.data?.message || 'Error validating ticket.');
      }
    }
  };

  const handleError = (err) => {
    console.error('Error scanning QR code:', err);
    setErrorMessage('Error scanning QR code. Please try again.');
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <div className="scan-tickets">
      <h1>Scan Tickets</h1>
      <QrScanner
        delay={300}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      />
      {scanResult && <p>Scanned Data: {scanResult}</p>}
      {validationMessage && <p className="success">{validationMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default ScanTickets;
