import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile, updateUser, forgotPassword } from '../services/api'; // Include forgotPassword API
import PhoneInput from 'react-phone-number-input';
import countries from 'world-countries/countries.json';
import 'react-phone-number-input/style.css';
import './Profile.css';

function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    countryCode: '',
    address: {
      city: '',
      region: '',
      address1: '',
      address2: '',
    },
    birthdate: '',
    gender: '',
  });

  // Extract country names from the countries dataset
  const countryOptions = countries.map((country) => ({
    name: country.name.common,
    code: country.cca2,
  }));

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUser(data.user);   

        setPurchaseHistory(data.purchaseHistory || []);
        setFormData({
          fullName: data.user.fullName || '',
          email: data.user.email || '',
          phoneNumber: data.user.phoneNumber || '',
          countryCode: data.user.countryCode || '',
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

  const handlePhoneChange = (value) => {
    if (value) {
      const matches = value.match(/^\+?(\d{1,3})?\s?(.*)$/);
      if (matches) {
        const countryCode = matches[1] || '';
        const phoneNumber = matches[2] || '';
        setFormData((prev) => ({
          ...prev,
          countryCode,
          phoneNumber,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        countryCode: '',
        phoneNumber: '',
      }));
    }
  };

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
      await updateUser(user._id, formData);
      alert(t('profile.updateSuccess'));
      setIsEditing(false);
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(t('profile.updateError'));
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setSuccessMessage('');
    try {
      const response = await forgotPassword({ email: user.email });
      setSuccessMessage(response.message || t('profile.resetPasswordSuccess'));
    } catch (err) {
      const errorMessage = err.response?.data?.message || t('profile.resetPasswordError');
      setError(errorMessage);
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
        <div className="profile-details">
          <h2>{t('profile.sections.personalDetails')}</h2>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {error && <p className="error-message">{error}</p>}
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
              <div className="phone-input-container">
                <label htmlFor="phoneNumber">{t('profile.labels.phone')}</label>
                <PhoneInput
                  id="phoneNumber"
                  value={`${formData.countryCode} ${formData.phoneNumber}`}
                  onChange={handlePhoneChange}
                  defaultCountry="US"
                  international
                  countryCallingCodeEditable={false}
                />
              </div>

              <input
                type="text"
                name="address.city"
                placeholder={t('profile.labels.city')}
                value={formData.address.city}
                onChange={handleInputChange}
                required
              />
              <div>
                <label htmlFor="region">{t('profile.labels.country')}</label>
                <select
                  id="region"
                  name="address.region"
                  value={formData.address.region}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, region: e.target.value },
                    }))
                  }
                  required
                >
                  <option value="">{t('profile.placeholders.selectCountry')}</option>
                  {countryOptions.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
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
            <div className="profile-card">
              <div className="card-item">
                <i className="fas fa-user"></i>
                <p><strong>{t('profile.labels.name')}:</strong> {user.fullName}</p>
              </div>
              <div className="card-item">
                <i className="fas fa-envelope"></i>
                <p><strong>{t('profile.labels.email')}:</strong> {user.email}</p>
              </div>
              <div className="card-item">
                <i className="fas fa-phone"></i>
                <p><strong>{t('profile.labels.phone')}:</strong> {user.phoneNumber || t('profile.placeholders.noPhone')}</p>
              </div>
              <div className="card-item">
                <i className="fas fa-map-marker-alt"></i>
                <p>
                  <strong>{t('profile.labels.address')}:</strong> {user.address ? `${user.address.address1}, ${user.address.city}, ${user.address.region}` : t('profile.placeholders.noAddress')}
                </p>
              </div>
              <div className="card-item">
                <i className="fas fa-calendar"></i>
                <p><strong>{t('profile.labels.birthdate')}:</strong> {user.birthdate ? new Date(user.birthdate).toLocaleDateString() : t('profile.placeholders.noBirthdate')}</p>
              </div>
              <div className="card-item">
                <i className="fas fa-venus-mars"></i>
                <p><strong>{t('profile.labels.gender')}:</strong> {user.gender || t('profile.placeholders.noGender')}</p>
              </div>
              <button
                className="profile-button"
                onClick={() => setIsEditing(true)}
              >
                {t('profile.buttons.edit')}
              </button>
              <button
                className="profile-button reset-password-button"
                onClick={handleResetPassword}
              >
                {t('profile.buttons.resetPassword')}
              </button>
            </div>
          )}
        </div>

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

<div className="purchase-history">
  <h2>{t('profile.sections.purchaseHistory')}</h2>

  {purchaseHistory.length === 0 ? (
    <p>{t('profile.placeholders.noTickets')}</p>
  ) : (
    <ul className="ticket-list">
      {purchaseHistory.map((purchase, index) => (
        <li key={index} className="ticket-item">
          <p>
            <strong>{t('profile.labels.purchaseDate')}:</strong>{' '}
            {new Date(purchase.purchaseDate).toLocaleDateString()}
          </p>
          <p>
            <strong>{t('profile.labels.amount')}:</strong>{' '}
            {`${purchase.amount || 0} ${purchase.currency}`}
          </p>
          {purchase.eventIds.map((event, eventIndex) => (
            <div key={eventIndex} className="event-details">
              <p>
                <strong>{t('profile.labels.event')}:</strong> {event?.name || t('profile.labels.noEvent')}
              </p>
              <p>
                <strong>{t('profile.labels.date')}:</strong>{' '}
                {event?.dateOfEvent ? new Date(event.dateOfEvent).toLocaleDateString() : t('profile.labels.noDate')}
              </p>
            </div>
          ))}
          <ul className="ticket-sublist">
            {purchase.tickets.length > 0 ? (
              purchase.tickets.map((ticket, ticketIndex) => (
                <li key={ticketIndex} className="ticket-subitem">
                  <p>
                    <strong>{t('profile.labels.ticketClass')}:</strong> {ticket.ticketClass}
                  </p>
                  <p>
                    <strong>{t('profile.labels.quantity')}:</strong> {ticket.quantity}
                  </p>
                  <p>
                    <strong>{t('profile.labels.price')}:</strong> {`${ticket.price || 0} ${purchase.currency}`}
                  </p>
                </li>
              ))
            ) : (
              <p>{t('profile.placeholders.noTickets')}</p>
            )}
          </ul>
          <button
            className="view-ticket-button"
            onClick={() =>
              navigate('/ticket', {
                state: {
                  tickets: purchase.tickets,
                  events: purchase.eventIds,
                },
              })
            }
          >
            {t('profile.buttons.viewTicket')}
          </button>
        </li>
      ))}
    </ul>
  )}
</div>


      </div>
    </div>
  );
}

export default Profile;
