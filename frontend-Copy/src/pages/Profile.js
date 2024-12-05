import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile, updateUser } from '../services/api'; // Include updateUser API
import './Profile.css';

function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Toggle for editing mode
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: {
      city: '',
      region: '',
      address1: '',
      address2: '',
    },
    birthdate: '',
    gender: '',
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUser(data.user);
        setPurchaseHistory(data.purchaseHistory || []);

        // Populate the form data with user details
        setFormData({
          fullName: data.user.fullName || '',
          email: data.user.email || '',
          phoneNumber: data.user.phoneNumber || '',
          address: {
            city: data.user.address?.city || '',
            region: data.user.address?.region || '',
            address1: data.user.address?.address1 || '',
            address2: data.user.address?.address2 || '',
          },
          birthdate: data.user.birthdate ? data.user.birthdate.slice(0, 10) : '',
          gender: data.user.gender || '',
        });
      } catch (err) {
        setError(t('profile.error'));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser(user._id, formData); // Use updateUser API
      alert(t('profile.updateSuccess'));
      setIsEditing(false);
      const updatedUser = { ...user, ...formData }; // Reflect updated data
      setUser(updatedUser);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(t('profile.updateError'));
    }
  };

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
          {isEditing ? (
            <form onSubmit={handleUpdate} className="profile-update-form">
              <input
                type="text"
                name="fullName"
                placeholder={t('profile.labels.name')}
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder={t('profile.labels.email')}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder={t('profile.labels.phone')}
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="address.city"
                placeholder={t('profile.labels.city')}
                value={formData.address.city}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="address.region"
                placeholder={t('profile.labels.region')}
                value={formData.address.region}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="address.address1"
                placeholder={t('profile.labels.address1')}
                value={formData.address.address1}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="address.address2"
                placeholder={t('profile.labels.address2')}
                value={formData.address.address2}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="birthdate"
                placeholder={t('profile.labels.birthdate')}
                value={formData.birthdate}
                onChange={handleInputChange}
                required
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">{t('profile.labels.gender')}</option>
                <option value="male">{t('profile.labels.genderOptions.male')}</option>
                <option value="female">{t('profile.labels.genderOptions.female')}</option>
                <option value="other">{t('profile.labels.genderOptions.other')}</option>
              </select>
              <button type="submit" className="profile-button">
                {t('profile.buttons.save')}
              </button>
              <button
                type="button"
                className="profile-button cancel-button"
                onClick={() => setIsEditing(false)}
              >
                {t('profile.buttons.cancel')}
              </button>
            </form>
          ) : (
            <>
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
              <p><strong>{t('profile.labels.birthdate')}:</strong> {user.birthdate || t('profile.placeholders.noBirthdate')}</p>
              <p><strong>{t('profile.labels.gender')}:</strong> {user.gender || t('profile.placeholders.noGender')}</p>
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
              <button
                className="profile-button"
                onClick={() => setIsEditing(true)}
              >
                {t('profile.buttons.edit')}
              </button>
            </>
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
