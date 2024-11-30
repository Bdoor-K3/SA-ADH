import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './TicketPage.css';

function TicketPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const { ticket, event } = location.state || {};

  if (!ticket || !event) {
    return <p className="loading">{t('ticketPage.loading')}</p>;
  }

  return (
    <div className="ticket-page-container">
      <div className="Ticket-page-ticket-container">
        {/* Left Side: QR Code */}
        <div className="ticket-left">
          {ticket.QRCodeImage ? (
            <img src={ticket.QRCodeImage} alt="QR Code" className="qr-code" />
          ) : (
            <p className="qr-code-description">{t('ticketPage.qrCodeUnavailable')}</p>
          )}
          <p className="qr-code-description">{t('ticketPage.presentCode')}</p>
          <button className="send-button">{t('ticketPage.sendButton')}</button>
        </div>

        {/* Right Side: Event Details */}
        <div className="ticket-right">
          {/* Event Banner */}
          <img
            src={event.image || '/assets/default-event-banner.jpg'}
            alt={event.name}
            className="banner-image"
          />

          {/* Event Details */}
          <div className="ticket-details">
            <h3>{event.name}</h3>
            <p>
              <span className="detail-label">{t('ticketPage.date')}:</span>
              <span className="detail-value">
                {new Date(event.dateOfEvent).toLocaleDateString()}
              </span>
            </p>
            <p>
              <span className="detail-label">{t('ticketPage.city')}:</span>
              <span className="detail-value">{event.city || t('ticketPage.defaultCity')}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketPage;
