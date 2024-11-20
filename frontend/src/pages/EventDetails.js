import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getEventById, purchaseTicket, verifyPayment } from '../services/api';
import './EventDetails.css';

function EventDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [ticket, setTicket] = useState(null); // To hold ticket details (QR code, etc.)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch event details on load
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

  // Handle payment verification if `tap_id` exists in the query string
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tap_id = queryParams.get('tap_id'); // Get `tap_id` from the query string
    console.log('Redirected with tap_id:', tap_id); // Debug log
  
    if (tap_id) {
      setLoading(true);
      const verifyPaymentStatus = async () => {
        try {
          const response = await verifyPayment(tap_id); // Call backend to verify payment
          console.log('Payment verification response:', response); // Debug log
          setTicket(response.ticket); // Set ticket details to display QR code
        } catch (err) {
          console.error('Error verifying payment:', err);
          setError('Error verifying payment or completing the purchase.');
        } finally {
          setLoading(false);
        }
      };
  
      verifyPaymentStatus();
    }
  }, [location.search]);
  

  const handlePurchaseTicket = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login or sign up to purchase a ticket.');
      navigate('/login');
      return;
    }

    try {
      const response = await purchaseTicket(id); // Call the purchase ticket API
      if (response.url) {
        // Redirect the user to Tap Payments page
        window.location.href = response.url;
      } else {
        alert('Error: No payment URL received.');
      }
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
      <p>Currency: {event.currency}</p>
      <p>Price: ${event.price}</p>
      <p>Tickets Available: {event.ticketsAvailable}</p>
      <p>Purchase Start Date: {new Date(event.purchaseStartDate).toLocaleDateString()}</p>
      <p>Purchase End Date: {new Date(event.purchaseEndDate).toLocaleDateString()}</p>
  
      {loading ? (
        <p>Processing payment, please wait...</p>
      ) : ticket ? (
        <div className="ticket-details">
          <h2>Ticket Purchased Successfully!</h2>
          <p>Your ticket has been issued. Use the QR code below to access the event:</p>
          <img src={ticket.QRCodeImage} alt="Ticket QR Code" />
        </div>
      ) : (
        <button onClick={handlePurchaseTicket} disabled={loading}>
          Buy Ticket
        </button>
      )}
  
      {error && <p className="error">{error}</p>}
    </div>
  );
  }

export default EventDetails;
