import React, { useState, useEffect } from 'react';
import { fetchUsers, updateUser, deleteUser } from '../../../services/api';

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [userFormData, setUserFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: {
      city: '',
      region: '',
      address1: '',
      address2: '',
    },
    age: '',
    gender: '',
    role: '',
    password: '',
  });
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };
    loadUsers();
  }, []);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUserId) {
        await updateUser(editUserId, userFormData);
        alert('User updated successfully!');
      }
      setUserFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: {
          city: '',
          region: '',
          address1: '',
          address2: '',
        },
        age: '',
        gender: '',
        role: '',
        password: '',
      });
      setEditUserId(null);
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error creating/updating user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      alert('User deleted successfully!');
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = (user) => {
    setEditUserId(user._id);
    setUserFormData({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: {
        city: user.address.city,
        region: user.address.region,
        address1: user.address.address1,
        address2: user.address.address2 || '',
      },
      age: user.age,
      gender: user.gender,
      role: user.role,
      password: '', // For security reasons, the password field is left blank
    });
  };

  return (
    <div>
      <h2>{editUserId ? 'Edit User' : 'Manage Users'}</h2>
      <form onSubmit={handleUserSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={userFormData.fullName}
          onChange={(e) => setUserFormData({ ...userFormData, fullName: e.target.value })}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userFormData.email}
          onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={userFormData.phoneNumber}
          onChange={(e) => setUserFormData({ ...userFormData, phoneNumber: e.target.value })}
          required
        />
        <input
          type="text"
          name="address.city"
          placeholder="City"
          value={userFormData.address.city}
          onChange={(e) =>
            setUserFormData({
              ...userFormData,
              address: { ...userFormData.address, city: e.target.value },
            })
          }
          required
        />
        <input
          type="text"
          name="address.region"
          placeholder="Region"
          value={userFormData.address.region}
          onChange={(e) =>
            setUserFormData({
              ...userFormData,
              address: { ...userFormData.address, region: e.target.value },
            })
          }
          required
        />
        <input
          type="text"
          name="address.address1"
          placeholder="Address Line 1"
          value={userFormData.address.address1}
          onChange={(e) =>
            setUserFormData({
              ...userFormData,
              address: { ...userFormData.address, address1: e.target.value },
            })
          }
          required
        />
        <input
          type="text"
          name="address.address2"
          placeholder="Address Line 2 (optional)"
          value={userFormData.address.address2}
          onChange={(e) =>
            setUserFormData({
              ...userFormData,
              address: { ...userFormData.address, address2: e.target.value },
            })
          }
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={userFormData.age}
          onChange={(e) => setUserFormData({ ...userFormData, age: e.target.value })}
          required
        />
        <select
          name="gender"
          value={userFormData.gender}
          onChange={(e) => setUserFormData({ ...userFormData, gender: e.target.value })}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <select
          name="role"
          value={userFormData.role}
          onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
          required
        >
          <option value="">Select Role</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
          <option value="organizer">Organizer</option>
        </select>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userFormData.password}
          onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
        />
        <button type="submit">{editUserId ? 'Update User' : 'Add User'}</button>
      </form>

      <h2>Existing Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <h3>{user.fullName}</h3>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phoneNumber}</p>
            <p>
              Address: {user.address.city}, {user.address.region}, {user.address.address1}
              {user.address.address2 ? `, ${user.address.address2}` : ''}
            </p>
            <p>Age: {user.age}</p>
            <p>Gender: {user.gender}</p>
            <p>Role: {user.role}</p>
            <h4>Purchase History:</h4>
            <ul>
              {user.purchaseHistory.map((history, index) => (
                <li key={index}>
                  Ticket ID: {history.ticketId._id || history.ticketId}, Purchase Date:{' '}
                  {new Date(history.purchaseDate).toLocaleString()}, Used:{' '}
                  {history.used ? 'Yes' : 'No'}
                </li>
              ))}
            </ul>
            <button onClick={() => handleEditUser(user)}>Edit</button>
            <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersTab;
