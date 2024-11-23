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
      setMessage(response.message); // Access `message` directly
    } catch (err) {
      const errorMessage = err.response?.data?.message || t('forgotPassword.error');
      setError(errorMessage);
    }
  };
  return (
    <div className="auth-container">
      <h2>{t('forgotPassword.title')}</h2>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder={t('forgotPassword.form.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <button type="submit">{t('forgotPassword.form.submitButton')}</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
