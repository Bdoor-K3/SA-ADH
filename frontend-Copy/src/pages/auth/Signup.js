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
  <div>
    <label htmlFor="fullName">{t('signup.form.fullName')}</label>
    <input
      id="fullName"
      type="text"
      name="fullName"
      placeholder={t('signup.form.fullName')}
      value={formData.fullName}
      onChange={handleChange}
      required
    />
  </div>

  <div>
    <label htmlFor="email">{t('signup.form.email')}</label>
    <input
      id="email"
      type="email"
      name="email"
      placeholder={t('signup.form.email')}
      value={formData.email}
      onChange={handleChange}
      required
    />
  </div>

  <div>
    <label htmlFor="countryCode">{t('signup.form.countryCode')}</label>
    <input
      id="countryCode"
      type="text"
      name="countryCode"
      placeholder={t('signup.form.countryCode')}
      value={formData.countryCode}
      onChange={handleChange}
      required
    />
  </div>

  <div>
    <label htmlFor="phoneNumber">{t('signup.form.phoneNumber')}</label>
    <input
      id="phoneNumber"
      type="text"
      name="phoneNumber"
      placeholder={t('signup.form.phoneNumber')}
      value={formData.phoneNumber}
      onChange={handleChange}
      required
    />
  </div>

  <div>
    <label htmlFor="city">{t('signup.form.city')}</label>
    <input
      id="city"
      type="text"
      name="address.city"
      placeholder={t('signup.form.city')}
      value={formData.address.city}
      onChange={handleChange}
      required
    />
  </div>

  <div>
    <label htmlFor="region">{t('signup.form.region')}</label>
    <input
      id="region"
      type="text"
      name="address.region"
      placeholder={t('signup.form.region')}
      value={formData.address.region}
      onChange={handleChange}
      required
    />
  </div>

  <div>
    <label htmlFor="address1">{t('signup.form.address1')}</label>
    <input
      id="address1"
      type="text"
      name="address.address1"
      placeholder={t('signup.form.address1')}
      value={formData.address.address1}
      onChange={handleChange}
      required
    />
  </div>

  <div>
    <label htmlFor="address2">{t('signup.form.address2')}</label>
    <input
      id="address2"
      type="text"
      name="address.address2"
      placeholder={t('signup.form.address2')}
      value={formData.address.address2}
      onChange={handleChange}
    />
  </div>

  <div>
    <label htmlFor="birthdate">{t('signup.form.birthdate')}</label>
    <input
      id="birthdate"
      type="date"
      name="birthdate"
      placeholder={t('signup.form.birthdate')}
      value={formData.birthdate}
      onChange={handleChange}
      required
    />
  </div>

  <div>
    <label htmlFor="gender">{t('signup.form.gender')}</label>
    <select
      id="gender"
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
  </div>

  <div>
    <label htmlFor="password">{t('signup.form.password')}</label>
    <input
      id="password"
      type="password"
      name="password"
      placeholder={t('signup.form.password')}
      value={formData.password}
      onChange={handleChange}
      required
    />
  </div>

  <div>
    <label htmlFor="confirmPassword">{t('signup.form.confirmPassword')}</label>
    <input
      id="confirmPassword"
      type="password"
      name="confirmPassword"
      placeholder={t('signup.form.confirmPassword')}
      value={formData.confirmPassword}
      onChange={handleChange}
      required
    />
  </div>

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
