import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { validateTicket } from '../../services/api';
import './ScanTickets.css';

function ScanTickets() {
  const [validationMessage, setValidationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showNextScanButton, setShowNextScanButton] = useState(false);

  const handleScan = async (data) => {
    if (data) {
      try {
        const eventId = window.location.pathname.split('/').pop();
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

  const previewStyle = {
    height: 240,
    width: 320,
  };

  const videoConstraints = {
    facingMode: { exact: 'environment' },
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
      <div aria-live="polite">
        {validationMessage && <p className="success">{validationMessage}</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
      {showNextScanButton && (
        <button onClick={handleNextScan} className="next-scan-button">
          Scan Next Ticket
        </button>
      )}
    </div>
  );
}

export default ScanTickets;
