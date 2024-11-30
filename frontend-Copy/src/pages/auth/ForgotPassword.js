import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { forgotPassword } from '../../services/api';
import './Auth.css';

function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await forgotPassword({ email });
      setMessage(response.message);
    } catch (err) {
      const errorMessage = err.response?.data?.message || t('forgotPasswordparent.error');
      setError(errorMessage);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">{t('forgotPasswordparent.title')}</h2>
        <p className="auth-subtitle">{t('forgotPasswordparent.subtitle')}</p>
        <form onSubmit={handleForgotPassword}>
          <div className="form-group">
            <label htmlFor="email">{t('forgotPasswordparent.form.emailLabel')}</label>
            <input
              type="email"
              id="email"
              placeholder={t('forgotPasswordparent.form.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button">
            {t('forgotPasswordparent.form.submitButton')}
          </button>
        </form>
      </div>
      <div className="auth-logo"></div>
    </div>
  );
}

export default ForgotPassword;
