import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { resetPassword } from '../../services/api';
import './Auth.css';

/**
 * ResetPassword Component
 * Handles password reset functionality for users with a valid token.
 */
function ResetPassword() {
  const { token } = useParams(); // Extracts the reset token from the URL
  const navigate = useNavigate(); // Navigation hook for redirection
  const { t } = useTranslation(); // Translation hook for multi-language support

  const [password, setPassword] = useState(''); // State to store the new password
  const [message, setMessage] = useState(''); // Success message state
  const [error, setError] = useState(''); // Error message state

  /**
   * Validates the password input to ensure it meets complexity requirements.
   * @returns {boolean} - True if the password is valid, false otherwise.
   */
  const validatePassword = () => {
    if (password.length < 6) {
      setError(t('resetPassword.validation.shortPassword'));
      return false;
    }
    return true;
  };

  /**
   * Handles the submission of the reset password form.
   * Validates the password and sends a request to the API.
   * @param {Object} e - The form submission event.
   */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!validatePassword()) return;

    try {
      const response = await resetPassword({ token, password });
      setMessage(response.data.message);

      // Redirect to login page after successful reset
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      if (err.response?.status === 400) {
        setError(
          err.response.data?.message ||
            t('resetPassword.error.expiredOrUsedLink')
        );
      } else {
        const errorMessage = err.response?.data?.message || t('resetPassword.error.generic');
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">{t('resetPassword.title')}</h2>
        <p className="auth-subtitle">{t('resetPassword.subtitle')}</p>

        {/* Reset Password Form */}
        <form onSubmit={handleResetPassword} noValidate>
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

          {/* Success and Error Messages */}
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="auth-button">
            {t('resetPassword.form.submitButton')}
          </button>
        </form>
      </div>

      {/* Logo Section */}
      <div className="auth-logo"></div>
    </div>
  );
}

export default ResetPassword;
