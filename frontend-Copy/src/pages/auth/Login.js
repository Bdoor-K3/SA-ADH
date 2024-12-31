import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginUser } from '../../services/api';
import Notification from '../../components/Notification';
import './Auth.css';

/**
 * Login Component
 * Handles user authentication by submitting login credentials and managing access tokens.
 */
function Login() {
  const { t } = useTranslation(); // Translation hook for multi-language support
  const [email, setEmail] = useState(''); // State to store email input
  const [password, setPassword] = useState(''); // State to store password input
  const [error, setError] = useState(''); // State to manage error messages
  const [notification, setNotification] = useState({ message: '', type: '' }); // notification alert
  const navigate = useNavigate();

  /**
   * Handles form submission for user login.
   * Validates inputs and sends a request to the API.
   * @param {Object} e - The form submission event.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setNotification({ message: '', type: '' }); //

    // Input validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('login.validation.invalidEmail'));
      setNotification({ message: t('login.validation.invalidEmail'), type: 'error' }); // error alert will show
      return;
    }

    if (password.trim().length < 6) {
      setError(t('login.validation.shortPassword'));
      setNotification({ message: t('login.validation.shortPassword'), type: 'error' }); // error alert will show
      return;
    }

    try {
      const response = await loginUser({ email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role);
      setNotification({ message: t('login.success'), type: 'success' }); // success alert will show
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || t('login.error.invalidCredentials');
      setError(errorMessage);
      setNotification({ message: errorMessage, type: 'error' }); // error alert will show
      return;

    }
  };

  /**
   * Redirects the user to the signup page.
   */
  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  const closeNotification = () => {
    setNotification({ message: '', type: '' }); // close notfication
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">{t('login.title')}</h2>
        <Notification message={notification.message} type={notification.type} onClose={closeNotification} />

        {/* Login Form */}
        <form onSubmit={handleLogin} noValidate>
          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder={t('login.form.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder={t('login.form.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="auth-button">
            {t('login.form.submitButton')}
          </button>
        </form>

        {/* Forgot Password and Signup Links */}
        <p className="auth-footer">
          <a href="/forgot-password">{t('login.form.forgotPasswordchid')}</a>
        </p>
        <button className="signup-button" onClick={handleSignupRedirect}>
          {t('login.form.register')}
        </button>
      </div>

      {/* Logo Section */}
      <div className="auth-logo"></div>
    </div>
  );
}

export default Login;
