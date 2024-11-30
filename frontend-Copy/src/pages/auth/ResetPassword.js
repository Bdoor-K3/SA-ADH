import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { resetPassword } from '../../services/api';
import './Auth.css';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await resetPassword({ token, password });
      setMessage(response.data.message);

      // Redirect to login page after successful reset
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data?.message || 'This reset link has already been used or is expired.');
      } else {
        const errorMessage = err.response?.data?.message || t('resetPassword.error');
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">{t('resetPassword.title')}</h2>
        <p className="auth-subtitle">{t('resetPassword.subtitle')}</p>
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label htmlFor="password">{t('resetPassword.form.passwordLabel')}</label>
            <input
              type="password"
              id="password"
              placeholder={t('resetPassword.form.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button">
            {t('resetPassword.form.submitButton')}
          </button>
        </form>
      </div>
      <div className="auth-logo"></div>
    </div>
  );
}

export default ResetPassword;
