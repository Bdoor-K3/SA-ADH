import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../services/api';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]); // Correctly named to match API
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUser(data.user); // Set user details
        setPurchaseHistory(data.purchaseHistory || []); // Correctly set purchase history
      } catch (err) {
        setError('Error fetching profile data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (isLoading) {
    return <p className="loading">Loading profile...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!user) {
    return <p className="no-data">No user data available.</p>;
  }

  return (
    <div className="profile">
      <h1>Profile</h1>
      <div className="profile-container">
        {/* Personal Details */}
        <div className="profile-details">
          <h2>Personal Details</h2>
          <p><strong>Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phoneNumber || 'No phone number provided.'}</p>
          <p>
            <strong>Address:</strong>{' '}
            {user.address
              ? `${user.address.address1}, ${user.address.city}, ${user.address.region}`
              : 'No address provided.'}
          </p>
          <p><strong>Age:</strong> {user.age || 'Not provided'}</p>
          <p><strong>Gender:</strong> {user.gender || 'Not provided'}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        {/* Purchase History */}
        <div className="purchase-history">
          <h2>Purchase History</h2>
          {purchaseHistory.length === 0 ? (
            <p>No tickets purchased yet.</p>
          ) : (
            <ul className="ticket-list">
              {purchaseHistory.map((purchase, index) => {
                const ticket = purchase.ticketId;
                const event = purchase.eventId;

                if (!ticket || !event) {
                  return null; // Skip invalid entries
                }

                return (
                  <li key={index} className="ticket-item">
                    <p><strong>Event:</strong> {event.name || 'Event name not available'}</p>
                    <p><strong>Date:</strong> {new Date(event.dateOfEvent).toLocaleDateString()}</p>
                    <p><strong>Purchase Date:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                    <p><strong>Amount:</strong> {`${purchase.amount} ${purchase.currency}`}</p>
                    <p><strong>Paid:</strong> {purchase.paid ? 'Yes' : 'No'}</p>
                    <p><strong>Used:</strong> {purchase.used ? 'Yes' : 'No'}</p>
                    {ticket.QRCodeImage && (
                      <div>
                        <p><strong>QR Code:</strong></p>
                        <img src={ticket.QRCodeImage} alt="QR Code" className="qr-code" />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
