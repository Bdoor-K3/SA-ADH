import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { registerUser } from '../../services/api';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './Auth.css';

function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    countryCode: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t('signup.messages.passwordMismatch'));
      return;
    }

    if (!formData.countryCode || !formData.phoneNumber) {
      setError(t('signup.messages.phoneRequired'));
      return;
    }

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

  const handlePhoneChange = (value) => {
    if (value) {
      // Extract country code and phone number
      const matches = value.match(/^(\+?\d{1,3})?\s?(.*)$/);
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
        <form onSubmit={handleSignup}>
          <div>
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

          <div>
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

          <div className="phone-input-container">
            <PhoneInput
              id="phoneNumber"
              value={`${formData.countryCode} ${formData.phoneNumber}`}
              onChange={handlePhoneChange}
              defaultCountry="US"
              international
              placeholder="Phone number *"
              countryCallingCodeEditable={false}
            />
          </div>

          <div>
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

          <div>

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

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="auth-button">
            {t('signup.form.submitButton')}
          </button>
        </form>

        <p className="terms">{t('signup.terms')}</p>
      </div>
      <div className="auth-logo"></div>
    </div>
  );
}

export default Signup;
