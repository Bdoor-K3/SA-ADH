import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginUser } from '../../services/api';
import './Auth.css';

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await loginUser({ email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role);
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || t('login.error.invalidCredentials');
      setError(errorMessage);
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">{t('login.title')}</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">{t('login.form.emailLabel')}</label>
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
            <label htmlFor="password">{t('login.form.passwordLabel')}</label>
            <input
              type="password"
              id="password"
              placeholder={t('login.form.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button">
            {t('login.form.submitButton')}
          </button>
        </form>
        <p className="auth-footer">
          <a href="/forgot-password">{t('login.form.forgotPasswordchid')}</a>
        </p>
        <button className="signup-button" onClick={handleSignupRedirect}>
          {t('login.form.register')}
        </button>
      </div>
      <div className="auth-logo"></div>
    </div>
  );
}

export default Login;
