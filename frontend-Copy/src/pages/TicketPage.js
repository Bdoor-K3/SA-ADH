import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './TicketPage.css';

function TicketPage() {
  const { t } = useTranslation();
  const location = useLocation();

  // Retrieve tickets and events from location state
  const { tickets = [], eventIds = [] } = location.state || {};

  // Normalize tickets for consistent handling
  const normalizedTickets = tickets.map((ticket) => {
    return {
      ...ticket,
      _id: ticket.ticketId || ticket._id, // Support both post-payment and profile structures
    };
  });

  if (!normalizedTickets.length) {
    return <p className="loading">{t('ticketPage.noTickets')}</p>;
  }

  return (
    <div className="ticket-page-container">
      <h2>{t('ticketPage.title')}</h2>

      <div className="ticket-list">
        {normalizedTickets.map((ticket, index) => {
          // Match ticket with its event using eventId
          const event = eventIds.find((event) => event._id === ticket.eventId);

          return (
            <div key={index} className="ticket-item">
              <div className="ticket-left">
                {ticket.QRCodeImage ? (
                  <img src={ticket.QRCodeImage} alt="QR Code" className="qr-code" />
                ) : (
                  <p className="qr-code-description">{t('ticketPage.qrCodeUnavailable')}</p>
                )}
                <p className="qr-code-description">{t('ticketPage.presentCode')}</p>
              </div>
              <div className="ticket-right">
                {/* Only display event-related data if available */}
                {event ? (
                  <>
                    <img
                      src={event.image || '/assets/default-event-banner.jpg'}
                      alt={event.name || t('ticketPage.defaultEvent')}
                      className="banner-image"
                    />
                    <div className="ticket-details">
                      <h3>{event.name || t('ticketPage.defaultEvent')}</h3>
                      <p>
                        <span className="detail-label">{t('ticketPage.date')}:</span>
                        <span className="detail-value">
                          {event.dateOfEvent
                            ? new Date(event.dateOfEvent).toLocaleDateString()
                            : t('ticketPage.defaultDate')}
                        </span>
                      </p>
                      <p>
                        <span className="detail-label">{t('ticketPage.city')}:</span>
                        <span className="detail-value">{event.city || t('ticketPage.defaultCity')}</span>
                      </p>
                      <p>
                        <span className="detail-label">{t('ticketPage.price')}:</span>
                        <span className="detail-value">
                          {`${ticket.price} ${event.currency || t('ticketPage.defaultCurrency')}`}
                        </span>
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="ticket-details">
                    <p>{t('ticketPage.noEventDetails')}</p>
                  </div>
                )}
                <p>
                  <span className="detail-label">{t('ticketPage.ticketClass')}:</span>
                  <span className="detail-value">{ticket.ticketClass}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TicketPage;
