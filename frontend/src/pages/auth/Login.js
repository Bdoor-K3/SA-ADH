import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
      console.log(t('login.success'), response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role);
      navigate('/');
    } catch (err) {
      console.error(t('login.error.invalidCredentials'), err.response?.data || err.message);
      setError(err.response?.data?.message || t('login.error.invalidCredentials'));
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
    </div>
  );
}

export default Login;
