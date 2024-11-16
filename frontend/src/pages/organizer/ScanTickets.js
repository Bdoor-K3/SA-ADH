import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { validateTicket } from '../../services/api';
import './ScanTickets.css';

function ScanTickets() {
  const [scanResult, setScanResult] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleScan = async (data) => {
    if (data) {
      setScanResult(data);

      try {
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

  const videoConstraints = {
    facingMode: { exact: 'environment' }, // Use the back camera
  };

  return (
    <div className="scan-tickets">
      <h1>Scan Tickets</h1>
      <QrScanner
        delay={300}
        style={previewStyle}
        constraints={{ video: videoConstraints }}
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
