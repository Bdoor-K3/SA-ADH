import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { validateTicket } from '../../services/api';
import './ScanTickets.css';

function ScanTickets() {
  const [scanResult, setScanResult] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showNextScanButton, setShowNextScanButton] = useState(false); // Control visibility of "Scan Next" button

  const handleScan = async (data) => {
    if (data) {
      setScanResult(data);

      try {
        const eventId = window.location.pathname.split('/').pop(); // Get event ID from URL
        const response = await validateTicket(data.text || data, eventId); // Validate ticket with backend

        setValidationMessage(response.message);
        setErrorMessage('');
        setShowNextScanButton(true); // Show "Scan Next" button after a successful scan
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
    setScanResult(''); // Clear previous scan result
    setValidationMessage(''); // Clear validation message
    setErrorMessage(''); // Clear error message
    setShowNextScanButton(false); // Hide "Scan Next" button to allow a new scan
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  const videoConstraints = {
    facingMode: { exact: 'environment' }, // Use back camera
  };

  return (
    <div className="scan-tickets">
      <h1>Scan Tickets</h1>
      {!showNextScanButton && (
        <QrScanner
          delay={300}
          style={previewStyle}
          constraints={{ video: videoConstraints }}
          onError={handleError}
          onScan={handleScan}
        />
      )}
      {validationMessage && <p className="success">{validationMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}

      {showNextScanButton && (
        <button onClick={handleNextScan} className="next-scan-button">
          Scan Next Ticket
        </button>
      )}
    </div>
  );
}

export default ScanTickets;
