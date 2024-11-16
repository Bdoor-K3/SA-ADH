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
        <p><strong>Address:</strong> {`${user.address.address1}, ${user.address.city}, ${user.address.region}`}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      <div className="purchase-history">
        <h2>Purchase History</h2>
        {user.purchaseHistory.length === 0 ? (
          <p>No tickets purchased yet.</p>
        ) : (
          <ul>
            {user.purchaseHistory.map((history) => (
              <li key={history.ticketId._id}>
                <p><strong>Event:</strong> {history.ticketId.eventId.name}</p>
                <p><strong>Date:</strong> {new Date(history.ticketId.eventId.dateOfEvent).toLocaleDateString()}</p>
                <p><strong>Purchase Date:</strong> {new Date(history.purchaseDate).toLocaleDateString()}</p>
                <p><strong>Used:</strong> {history.used ? 'Yes' : 'No'}</p>
                {history.ticketId.QRCode && (
                  <div>
                    <p><strong>QR Code:</strong></p>
                    <img src={history.ticketId.QRCode} alt="QR Code" />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Profile;
