import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { registerUser } from '../../services/api';
import './Auth.css';

function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    countryCode: '', // Added countryCode
    email: '',
    address: {
      city: '',
      region: '',
      address1: '',
      address2: '',
    },
    birthdate: '',
    gender: '',
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
    try {
      await registerUser(formData);
      alert(t('signup.messages.success'));
      navigate('/login');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || t('signup.messages.failure');
      setError(errorMessage);
    }
  };

  const handleChange = (e) => {
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

  return (
    <div className="auth-page">
      <div className="auth-container">
        <button className="back-button" onClick={() => navigate('/login')}>
          {t('signup.backToLogin')}
        </button>
        <h2 className="auth-title">{t('signup.title')}</h2>
        <p className="auth-subtitle">{t('signup.subtitle')}</p>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="fullName"
            placeholder={t('signup.form.fullName')}
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder={t('signup.form.email')}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="countryCode"
            placeholder={t('signup.form.countryCode')}
            value={formData.countryCode}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder={t('signup.form.phoneNumber')}
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address.city"
            placeholder={t('signup.form.city')}
            value={formData.address.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address.region"
            placeholder={t('signup.form.region')}
            value={formData.address.region}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address.address1"
            placeholder={t('signup.form.address1')}
            value={formData.address.address1}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address.address2"
            placeholder={t('signup.form.address2')}
            value={formData.address.address2}
            onChange={handleChange}
          />
          <input
            type="date"
            name="birthdate"
            placeholder={t('signup.form.birthdate')}
            value={formData.birthdate}
            onChange={handleChange}
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">{t('signup.form.gender')}</option>
            <option value="male">{t('signup.form.genderOptions.male')}</option>
            <option value="female">{t('signup.form.genderOptions.female')}</option>
            <option value="other">{t('signup.form.genderOptions.other')}</option>
          </select>
          <input
            type="password"
            name="password"
            placeholder={t('signup.form.password')}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder={t('signup.form.confirmPassword')}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button">
            {t('signup.form.submitButton')}
          </button>
        </form>
        <div className="social-login">
          <p>{t('signup.or')}</p>
          <button className="social-button google">
            {t('signup.form.continueWithGoogle')}
          </button>
          <button className="social-button apple">
            {t('signup.form.continueWithApple')}
          </button>
        </div>
        <p className="terms">{t('signup.terms')}</p>
      </div>
      <div className="auth-logo"></div>
    </div>
  );
}

export default Signup;
