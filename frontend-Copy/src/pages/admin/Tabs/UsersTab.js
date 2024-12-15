import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchUsers, updateUser, deleteUser } from '../../../services/api';
import PhoneInput from 'react-phone-number-input';
import countries from 'world-countries/countries.json';
import 'react-phone-number-input/style.css';
import './UsersTab.css';

function UsersTab() {
  const { t } = useTranslation(); // For translations

  // State management
  const [users, setUsers] = useState([]); // Stores all users
  const [userFormData, setUserFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    countryCode: '', // Country code for phone number
    address: {
      city: '',
      region: '',
      address1: '',
      address2: '',
    },
    birthdate: '',
    gender: '',
    role: '',
    password: '',
  });
  const [editUserId, setEditUserId] = useState(null); // Stores ID of the user being edited

  // Extract country names and codes
  const countryOptions = countries.map((country) => ({
    name: country.name.common,
    code: country.cca2,
  }));

  // Fetch all users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    loadUsers();
  }, []);

  // Handle phone number input
  const handlePhoneChange = (value) => {
    if (value) {
      const matches = value.match(/^\+?(\d{1,3})\s?(.*)$/);
      if (matches) {
        const countryCode = matches[1] || '';
        const phoneNumber = matches[2] || '';
        setUserFormData((prev) => ({
          ...prev,
          countryCode,
          phoneNumber,
        }));
      }
    } else {
      setUserFormData((prev) => ({
        ...prev,
        countryCode: '',
        phoneNumber: '',
      }));
    }
  };

  // Handle user form submission (add or update user)
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUserId) {
        await updateUser(editUserId, userFormData);
        alert(t('usersTab.alerts.updated'));
      } else {
        // Functionality to add user can be implemented here
        alert(t('usersTab.alerts.added'));
      }

      // Reset form and fetch updated users
      resetForm();
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error(t('usersTab.alerts.submitError'), error);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm(t('usersTab.alerts.confirmDelete'))) return;
    try {
      await deleteUser(id);
      alert(t('usersTab.alerts.deleted'));
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Handle editing user
  const handleEditUser = (user) => {
    setEditUserId(user._id);
    setUserFormData({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      countryCode: user.countryCode || '',
      address: {
        city: user.address.city,
        region: user.address.region,
        address1: user.address.address1,
        address2: user.address.address2 || '',
      },
      birthdate: user.birthdate ? user.birthdate.slice(0, 10) : '',
      gender: user.gender,
      role: user.role,
      password: '', // Do not prefill password for security
    });
  };

  // Reset form and clear editUserId
  const resetForm = () => {
    setUserFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      countryCode: '',
      address: {
        city: '',
        region: '',
        address1: '',
        address2: '',
      },
      birthdate: '',
      gender: '',
      role: '',
      password: '',
    });
    setEditUserId(null);
  };

  return (
    <div className="users-tab">
      <h2 className="tab-title">{t(editUserId ? 'usersTab.title.edit' : 'usersTab.title.manage')}</h2>

      {/* User Form */}
      <form className="user-form" onSubmit={handleUserSubmit}>
        <label htmlFor="fullName">{t('usersTab.form.fullName')}</label>
        <input
          id="fullName"
          type="text"
          placeholder={t('usersTab.form.fullName')}
          value={userFormData.fullName}
          onChange={(e) => setUserFormData({ ...userFormData, fullName: e.target.value })}
          required
        />

        <label htmlFor="email">{t('usersTab.form.email')}</label>
        <input
          id="email"
          type="email"
          placeholder={t('usersTab.form.email')}
          value={userFormData.email}
          onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
          required
        />

        <label htmlFor="phoneNumber">{t('usersTab.form.phoneNumber')}</label>
        <PhoneInput
          id="phoneNumber"
          value={`${userFormData.countryCode} ${userFormData.phoneNumber}`}
          onChange={handlePhoneChange}
          defaultCountry="US"
          international
        />

        <label htmlFor="region">{t('usersTab.form.region')}</label>
        <select
          id="region"
          value={userFormData.address.region}
          onChange={(e) =>
            setUserFormData({
              ...userFormData,
              address: { ...userFormData.address, region: e.target.value },
            })
          }
          required
        >
          <option value="">{t('usersTab.form.selectRegion')}</option>
          {countryOptions.map((country) => (
            <option key={country.code} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>

        <label htmlFor="city">{t('usersTab.form.city')}</label>
        <input
          id="city"
          type="text"
          value={userFormData.address.city}
          onChange={(e) =>
            setUserFormData({
              ...userFormData,
              address: { ...userFormData.address, city: e.target.value },
            })
          }
          required
        />

        <label htmlFor="birthdate">{t('usersTab.form.birthdate')}</label>
        <input
          id="birthdate"
          type="date"
          value={userFormData.birthdate}
          onChange={(e) => setUserFormData({ ...userFormData, birthdate: e.target.value })}
          required
        />

        <label htmlFor="gender">{t('usersTab.form.gender')}</label>
        <select
          id="gender"
          value={userFormData.gender}
          onChange={(e) => setUserFormData({ ...userFormData, gender: e.target.value })}
          required
        >
          <option value="">{t('usersTab.form.gender')}</option>
          <option value="male">{t('usersTab.form.genderOptions.male')}</option>
          <option value="female">{t('usersTab.form.genderOptions.female')}</option>
          <option value="other">{t('usersTab.form.genderOptions.other')}</option>
        </select>

        <label htmlFor="role">{t('usersTab.form.role')}</label>
        <select
          id="role"
          value={userFormData.role}
          onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
          required
        >
          <option value="">{t('usersTab.form.role')}</option>
          <option value="customer">{t('usersTab.form.roleOptions.customer')}</option>
          <option value="admin">{t('usersTab.form.roleOptions.admin')}</option>
          <option value="organizer">{t('usersTab.form.roleOptions.organizer')}</option>
        </select>

        <label htmlFor="password">{t('usersTab.form.password')}</label>
        <input
          id="password"
          type="password"
          value={userFormData.password}
          onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
        />

        <button type="submit">
          {t(editUserId ? 'usersTab.form.submit.update' : 'usersTab.form.submit.add')}
        </button>
      </form>

      {/* Existing Users List */}
      <h2 className="tab-title">{t('usersTab.title.existing')}</h2>
      <ul className="users-list">
        {users.map((user) => (
          <li key={user._id} className="user-item">
            <h3>{user.fullName}</h3>
            <p>{t('usersTab.user.email')}: {user.email}</p>
            <p>{t('usersTab.user.phone')}: {user.countryCode} {user.phoneNumber}</p>
            <p>{t('usersTab.user.address')}: {user.address.city}, {user.address.region}</p>
            <p>{t('usersTab.user.birthdate')}: {user.birthdate?.slice(0, 10)}</p>
            <p>{t('usersTab.user.gender')}: {user.gender}</p>
            <p>{t('usersTab.user.role')}: {user.role}</p>
            <button onClick={() => handleEditUser(user)}>{t('usersTab.actions.edit')}</button>
            <button onClick={() => handleDeleteUser(user._id)}>{t('usersTab.actions.delete')}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersTab;
