import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { registerUser } from '../../services/api';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './Auth.css';

/**
 * Signup Component
 * Handles user registration by submitting user details and managing validations.
 */
function Signup() {
  const { t } = useTranslation(); // Translation hook for multi-language support
  const navigate = useNavigate(); // Navigation hook for redirection
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    countryCode: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(''); // State to manage error messages

  /**
   * Validates the input fields before submission.
   * @returns {boolean} - True if all inputs are valid, false otherwise.
   */
  const validateInputs = () => {
    if (!formData.fullName.trim()) {
      setError(t('signup.messages.fullNameRequired'));
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError(t('signup.messages.invalidEmail'));
      return false;
    }

    if (!formData.phoneNumber || !formData.countryCode) {
      setError(t('signup.messages.phoneRequired'));
      return false;
    }

    if (formData.password.length < 8) {
      setError(t('signup.messages.shortPassword'));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('signup.messages.passwordMismatch'));
      return false;
    }

    return true;
  };

  /**
   * Handles the form submission for user signup.
   * @param {Object} e - The form submission event.
   */
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateInputs()) return;

    try {
      const { confirmPassword, ...userData } = formData; // Exclude confirmPassword
      await registerUser(userData);
      alert(t('signup.messages.success'));
      navigate('/login');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || t('signup.messages.failure');
      setError(errorMessage);
    }
  };

  /**
   * Handles changes to the phone input field.
   * Extracts and updates the country code and phone number.
   * @param {string} value - The phone number input value.
   */
  const handlePhoneChange = (value) => {
    if (value) {
      const matches = value.match(/^\+?(\d{1,3})\s?(.*)$/);
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

  return (
    <div className="auth-page">
      <div className="auth-container">
        <button className="back-button" onClick={() => navigate('/login')}>
          {t('signup.backToLogin')}
        </button>

        <h2 className="auth-title">{t('signup.title')}</h2>
        <p className="auth-subtitle">{t('signup.subtitle')}</p>

        {/* Signup Form */}
        <form onSubmit={handleSignup} noValidate>
          <div className="form-group">
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder={t('signup.form.fullName')}
              value={formData.fullName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fullName: e.target.value }))
              }
              required
            />
          </div>

          <div className="form-group">
            <input
              id="email"
              type="email"
              name="email"
              placeholder={t('signup.form.email')}
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>

          <div className="form-group phone-input-container">
            <PhoneInput
              id="phoneNumber"
              value={`${formData.countryCode} ${formData.phoneNumber}`}
              onChange={handlePhoneChange}
              defaultCountry="US"
              international
              placeholder={t('signup.form.phonePlaceholder')}
              countryCallingCodeEditable={false}
            />
          </div>

          <div className="form-group">
            <input
              id="password"
              type="password"
              name="password"
              placeholder={t('signup.form.password')}
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
          </div>

          <div className="form-group">
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder={t('signup.form.confirmPassword')}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              required
            />
          </div>

          {/* Error Message */}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="auth-button">
            {t('signup.form.submitButton')}
          </button>
        </form>

        <p className="terms">{t('signup.terms')}</p>
      </div>

      {/* Logo Section */}
      <div className="auth-logo"></div>
    </div>
  );
}

export default Signup;
