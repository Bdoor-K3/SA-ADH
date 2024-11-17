import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, purchaseTicket } from '../services/api';
import './EventDetails.css';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        setError('Error fetching event details.');
        console.error(err);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handlePurchaseTicket = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login or sign up to purchase a ticket.');
      navigate('/login');
      return;
    }

    try {
      const response = await purchaseTicket(id);
      alert('Ticket purchased successfully!');
      setQrCodeImage(response.ticket.QRCodeImage);
    } catch (err) {
      setError(err.response?.data?.message || 'Error purchasing ticket.');
    }
  };

  if (!event) {
    return <p className="loading">Loading event details...</p>;
  }

  return (
    <div className="event-details">
      <h1>{event.name}</h1>
      <p>{event.description}</p>
      <p>Date of Event: {new Date(event.dateOfEvent).toLocaleDateString()}</p>
      <p>Price: ${event.price}</p>
      <p>Tickets Available: {event.ticketsAvailable}</p>
      <p>Purchase Start Date: {new Date(event.purchaseStartDate).toLocaleDateString()}</p>
      <p>Purchase End Date: {new Date(event.purchaseEndDate).toLocaleDateString()}</p>

      <button onClick={handlePurchaseTicket}>Buy Ticket</button>
      {error && <p className="error">{error}</p>}

      {qrCodeImage && (
        <div className="qr-code">
          <h2>Your Ticket QR Code</h2>
          <img src={qrCodeImage} alt="QR Code" />
        </div>
      )}
    </div>
  );
}

export default EventDetails;
