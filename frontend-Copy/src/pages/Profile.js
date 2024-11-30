import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../services/api';
import './Profile.css';

function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUser(data.user);
        setPurchaseHistory(data.purchaseHistory || []);
      } catch (err) {
        setError(t('profile.error'));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [t]);

  if (isLoading) {
    return <p className="loading">{t('profile.loading')}</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!user) {
    return <p className="no-data">{t('profile.noData')}</p>;
  }

  return (
    <div className={`profile ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
      <h1>{t('profile.title')}</h1>
      <div className="profile-container">
        {/* Personal Details */}
        <div className="profile-details">
          <h2>{t('profile.sections.personalDetails')}</h2>
          <p><strong>{t('profile.labels.name')}:</strong> {user.fullName}</p>
          <p><strong>{t('profile.labels.email')}:</strong> {user.email}</p>
          <p>
            <strong>{t('profile.labels.phone')}:</strong>{' '}
            {user.phoneNumber || t('profile.placeholders.noPhone')}
          </p>
          <p>
            <strong>{t('profile.labels.address')}:</strong>{' '}
            {user.address
              ? `${user.address.address1}, ${user.address.city}, ${user.address.region}`
              : t('profile.placeholders.noAddress')}
          </p>
          <p><strong>{t('profile.labels.age')}:</strong> {user.age || t('profile.placeholders.noAge')}</p>
          <p><strong>{t('profile.labels.gender')}:</strong> {user.gender || t('profile.placeholders.noGender')}</p>
          <p><strong>{t('profile.labels.role')}:</strong> {user.role}</p>
          {user.role === 'organizer' && (
            <button
              className="profile-button"
              onClick={() => window.location.href = '/organizer'}
            >
              {t('profile.buttons.goToOrganizer')}
            </button>
          )}
          {user.role === 'admin' && (
            <button
              className="profile-button"
              onClick={() => window.location.href = '/admin'}
            >
              {t('profile.buttons.goToAdmin')}
            </button>
          )}
        </div>

        {/* Purchase History */}
        <div className="purchase-history">
          <h2>{t('profile.sections.purchaseHistory')}</h2>
          {purchaseHistory.length === 0 ? (
            <p>{t('profile.placeholders.noTickets')}</p>
          ) : (
            <ul className="ticket-list">
              {purchaseHistory.map((purchase, index) => {
                const event = purchase.eventId;

                if (!event) {
                  return null;
                }

                return (
                  <li key={index} className="ticket-item">
                    <p><strong>{t('profile.labels.event')}:</strong> {event.name || t('profile.labels.noEvent')}</p>
                    <p><strong>{t('profile.labels.date')}:</strong> {new Date(event.dateOfEvent).toLocaleDateString()}</p>
                    <p><strong>{t('profile.labels.purchaseDate')}:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                    <p><strong>{t('profile.labels.amount')}:</strong> {`${purchase.amount} ${purchase.currency}`}</p>
                    <button
                      className="view-ticket-button"
                      onClick={() => navigate('/ticket', { state: { ticket: purchase.ticketId, event } })}
                    >
                      {t('profile.buttons.viewTicket')}
                    </button>
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
