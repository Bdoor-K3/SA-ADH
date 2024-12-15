import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { forgotPassword } from '../../services/api';
import './Auth.css';

/**
 * ForgotPassword Component
 * Handles the functionality for requesting a password reset.
 */
function ForgotPassword() {
  const { t } = useTranslation(); // Translation hook for multi-language support
  const [email, setEmail] = useState(''); // State to store the user's email input
  const [message, setMessage] = useState(''); // Success message state
  const [error, setError] = useState(''); // Error message state

  /**
   * Handles the submission of the forgot password form.
   * Validates the email input and sends a request to the server.
   * @param {Object} e - The form submission event.
   */
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validate email input
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('forgotPasswordparent.validation.invalidEmail'));
      return;
    }

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

        {/* Forgot Password Form */}
        <form onSubmit={handleForgotPassword} noValidate>
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

          {/* Success and Error Messages */}
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="auth-button">
            {t('forgotPasswordparent.form.submitButton')}
          </button>
        </form>
      </div>

      {/* Logo Section */}
      <div className="auth-logo"></div>
    </div>
  );
}

export default ForgotPassword;
