import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile, updateUser, forgotPassword } from '../services/api';
import PhoneInput from 'react-phone-number-input';
import countries from 'world-countries/countries.json';
import 'react-phone-number-input/style.css';
import './Profile.css';

/**
 * Profile Component
 * Displays and edits user profile data with validation for input fields.
 */
function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeContent, setActiveContent] = useState("profile");
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
  const [showPurchaseHistory, setShowPurchaseHistory] = useState(false);

  /**
   * Extracts country options from the dataset for dropdown menu.
   */
  const countryOptions = countries.map((country) => ({
    name: country.name.common,
    code: country.cca2,
  }));

  /**
   * Loads user profile data and purchase history on component mount.
   */
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const data = await fetchUserProfile();
        if (!data || !data.user) {
          setErrorMessages({ profile: t('profile.error') });
          return;
        }

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
        setErrorMessages({ profile: t('profile.error') });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [t]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  /**
   * Validates and sets error messages for individual fields.
   */
  const validateField = (name, value) => {
    let error = '';

    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = t('profile.errors.invalidEmail');
    }

    if (name === 'birthdate' && new Date(value) > new Date()) {
      error = t('profile.errors.invalidBirthdate');
    }

    if (name === 'phoneNumber' && !/^\+?[1-9]\d{1,14}$/.test(value)) {
      error = t('profile.errors.invalidPhone');
    }

    if (name.includes('address') && value.trim() === '') {
      error = t('profile.errors.incompleteAddress');
    }

    setErrorMessages((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  /**
   * Handles input changes and validates them in real-time.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  /**
   * Handles phone number changes and validates the input.
   */
  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value }));
    validateField('phoneNumber', value);
  };

  /**
   * Validates the entire form before submission.
   */
  const validateFormData = () => {
    const validations = [
      validateField('email', formData.email),
      validateField('phoneNumber', formData.phoneNumber),
      validateField('birthdate', formData.birthdate),
      validateField('address.city', formData.address.city),
      validateField('address.region', formData.address.region),
      validateField('address.address1', formData.address.address1),
    ];
    return validations.every((valid) => valid);
  };

  /**
   * Handles profile update form submission.
   */
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateFormData()) {
      return;
    }

    setErrorMessages({});
    setSuccessMessage('');
    try {
      await updateUser(user._id, formData);
      setSuccessMessage(t('profile.updateSuccess'));
      setIsEditing(false);
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
    } catch (err) {
      setErrorMessages({ form: t('profile.updateError') });
    }
  };

  /**
   * Handles password reset requests.
   */
  const handleResetPassword = async () => {
    setErrorMessages({});
    setSuccessMessage('');
    try {
      const response = await forgotPassword({ email: user.email });
      setSuccessMessage(response.message || t('profile.resetPasswordSuccess'));
    } catch (err) {
      setErrorMessages({ resetPassword: t('profile.resetPasswordError') });
    }
  };
  /**
   * Render loading state if data is still being fetched.
   */
  if (isLoading) {
    return <p className="loading">{t('profile.loading')}</p>;
  }

  return (
    <div className={`profile ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="profile-container">
        <div className="profile-details-options">
        <div class="profile-header">
        <div class="profile-icon-container">
            <i class="fas fa-user"></i>
             </div>
             <h2 className="profile-title">{t('profile.title')}</h2>
             <div class="profile-title-line"></div>
             </div>
          <button
            className="profile-button"
            onClick={() => setIsEditing(true)}>
            {t('profile.buttons.edit')}
          </button>
          <button
            className="profile-button reset-password-button"
            onClick={handleResetPassword}
          >
            {t('profile.buttons.resetPassword')}
          </button>

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
            onClick={() => {
              setShowPurchaseHistory((prev) => !prev); 
              setActiveContent((prev) => prev === "profile" ? "purchaseHistory" : "profile");
            }} 
          >
            {t('profile.buttons.showPurchaseHistory')}
          </button>

          <button
          onClick={handleLogout}
          className="profile-button"
          >
          {t('header.logout')} </button>
        </div>

        <div className="profile-details">
          <h2>{t('profile.sections.personalDetails')}</h2>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {Object.values(errorMessages).map((msg, index) => (
            msg && <p key={index} className="error-message">{msg}</p>
          ))}
          {isEditing ?(
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
                  value={formData.phoneNumber}
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
              <input
                type="text"
                name="address.region"
                placeholder={t('profile.labels.country')}
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
                <p><strong>{t('profile.labels.phone')}:</strong> {user.phoneNumber}</p>
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
            </div>
          )}

         {showPurchaseHistory && (
        <div className="purchase-history">
          <h3>{t('profile.sections.purchaseHistory')}</h3>
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
          )}
      </div>    
       </div>
    </div>
  );
}

export default Profile;
