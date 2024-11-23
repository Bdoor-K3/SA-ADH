import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { registerUser } from '../../services/api';
import './Auth.css';

function Signup() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: {
      city: '',
      region: '',
      address1: '',
      address2: '',
    },
    age: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError(t('signup.messages.passwordMismatch'));
      return;
    }

    try {
      await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: {
          city: formData.address.city,
          region: formData.address.region,
          address1: formData.address.address1,
          address2: formData.address.address2,
        },
        age: formData.age,
        gender: formData.gender,
        password: formData.password,
      });
      alert(t('signup.messages.success'));
    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);

      // Check if the server provides an error message and display it
      const errorMessage = err.response?.data?.error || err.response?.data?.message || t('signup.messages.failure');
      setError(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="auth-container">
      <h2>{t('signup.title')}</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="fullName"
          placeholder={t('signup.form.fullName')}
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder={t('signup.form.email')}
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder={t('signup.form.phoneNumber')}
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address.city"
          placeholder={t('signup.form.city')}
          value={formData.address.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address.region"
          placeholder={t('signup.form.region')}
          value={formData.address.region}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address.address1"
          placeholder={t('signup.form.address1')}
          value={formData.address.address1}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address.address2"
          placeholder={t('signup.form.address2')}
          value={formData.address.address2}
          onChange={handleChange}
        />
        <input
          type="number"
          name="age"
          placeholder={t('signup.form.age')}
          value={formData.age}
          onChange={handleChange}
          required
        />
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">{t('signup.form.gender')}</option>
          <option value="male">{t('signup.form.genderOptions.male')}</option>
          <option value="female">{t('signup.form.genderOptions.female')}</option>
        </select>
        <input
          type="password"
          name="password"
          placeholder={t('signup.form.password')}
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder={t('signup.form.confirmPassword')}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">{t('signup.form.submitButton')}</button>
      </form>
    </div>
  );
}

export default Signup;
