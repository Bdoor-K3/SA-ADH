import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../services/api';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUser(data);
      } catch (err) {
        setError('Error fetching profile data.');
        console.error(err);
      }
    };

    loadUserProfile();
  }, []);

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile">
      <h1>Profile</h1>
      {error && <p className="error">{error}</p>}
      <div className="profile-details">
        <h2>Personal Details</h2>
        <p><strong>Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phoneNumber}</p>
        <p>
          <strong>Address:</strong>{' '}
          {user.address
            ? `${user.address.address1}, ${user.address.city}, ${user.address.region}`
            : 'No address provided.'}
        </p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      <div className="purchase-history">
        <h2>Purchase History</h2>
        {(!user.purchaseHistory || user.purchaseHistory.length === 0) ? (
          <p>No tickets purchased yet.</p>
        ) : (
          <ul>
            {user.purchaseHistory.map((history, index) => {
              // Safeguard against missing nested data
              const event = history.ticketId?.eventId;
              const qrCodeImage = history.ticketId?.QRCodeImage;

              return (
                <li key={index}>
                  <p>
                    <strong>Event:</strong> {event?.name || 'Event name not available'}
                  </p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {event?.dateOfEvent
                      ? new Date(event.dateOfEvent).toLocaleDateString()
                      : 'Date not available'}
                  </p>
                  <p>
                    <strong>Purchase Date:</strong>{' '}
                    {history.purchaseDate
                      ? new Date(history.purchaseDate).toLocaleDateString()
                      : 'Purchase date not available'}
                  </p>
                  <p>
                    <strong>Used:</strong> {history.used ? 'Yes' : 'No'}
                  </p>
                  {qrCodeImage && (
                    <div>
                      <p><strong>QR Code:</strong></p>
                      <img
                        src={qrCodeImage}
                        alt="QR Code"
                        style={{ width: '200px', height: '200px' }}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Profile;
