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
      // Check if the error is a specific 400 response
      if (err.response?.status === 400) {
        setError(err.response.data?.message || 'This reset link has already been used or is expired.');
      } else {
        const errorMessage = err.response?.data?.message || t('resetPassword.error');
        setError(errorMessage);
      }
    }
  };
  

  return (
    <div className="auth-container">
      <h2>{t('resetPassword.title')}</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder={t('resetPassword.form.passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <button type="submit">{t('resetPassword.form.submitButton')}</button>
      </form>
    </div>
  );
}

export default ResetPassword;
