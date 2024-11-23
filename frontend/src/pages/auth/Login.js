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

  return (
    <div className="auth-container">
      <h2>{t('login.title')}</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder={t('login.form.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={t('login.form.passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">{t('login.form.submitButton')}</button>
      </form>
      <p>
        <a href="/forgot-password">{t('login.form.forgotPassword')}</a>
      </p>
    </div>
  );
}

export default Login;
