import React, { useState } from 'react';
import { registerUser } from '../../services/api';
import './Auth.css';

function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
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
      setError('Passwords do not match');
      return;
    }

    try {
      console.log('Submitting form data:', formData);
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
      alert('Registration successful! Please log in.');
    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);
      setError('Registration failed. Please try again.');
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
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address.city"
          placeholder="City"
          value={formData.address.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address.region"
          placeholder="Region"
          value={formData.address.region}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address.address1"
          placeholder="Address Line 1"
          value={formData.address.address1}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address.address2"
          placeholder="Address Line 2 (optional)"
          value={formData.address.address2}
          onChange={handleChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
