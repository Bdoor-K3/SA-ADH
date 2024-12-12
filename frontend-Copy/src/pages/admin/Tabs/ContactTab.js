import React, { useState, useEffect } from 'react';
import { fetchContacts, deleteContact } from '../../../services/api'; // Adjust the path to your API functions
import './ContactTab.css';

function ContactTab() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all contacts
  const fetchAllContacts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchContacts();
      setContacts(data);
    } catch (err) {
      setError('Error fetching contacts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle contact deletion
  const handleDelete = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      await deleteContact(contactId);
      setContacts((prevContacts) => prevContacts.filter((contact) => contact._id !== contactId));
    } catch (err) {
      alert('Error deleting contact. Please try again.');
    }
  };

  useEffect(() => {
    fetchAllContacts();
  }, []);

  return (
    <div className="contact-tab">
      <h2>Contact Messages</h2>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="contact-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <tr key={contact._id}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.message}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(contact._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ContactTab;
