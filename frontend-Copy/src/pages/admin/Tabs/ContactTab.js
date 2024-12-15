import React, { useState, useEffect } from 'react';
import { fetchContacts, deleteContact } from '../../../services/api'; // Adjust the path to your API functions
import './ContactTab.css';

/**
 * ContactTab Component
 * Displays and manages contact messages received through the platform.
 */
function ContactTab() {
  const [contacts, setContacts] = useState([]); // State to store contact messages
  const [loading, setLoading] = useState(false); // State to track loading status
  const [error, setError] = useState(''); // State to manage error messages

  /**
   * Fetches all contact messages from the server.
   */
  const fetchAllContacts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchContacts();
      setContacts(data);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Error fetching contacts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the deletion of a contact message.
   * Prompts for confirmation before deletion.
   * @param {string} contactId - The ID of the contact message to delete.
   */
  const handleDelete = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      await deleteContact(contactId);
      setContacts((prevContacts) => prevContacts.filter((contact) => contact._id !== contactId));
    } catch (err) {
      console.error('Error deleting contact:', err);
      alert('Error deleting contact. Please try again.');
    }
  };

  // Fetch all contacts when the component mounts
  useEffect(() => {
    fetchAllContacts();
  }, []);

  return (
    <div className="contact-tab">
      <h2>Contact Messages</h2>

      {/* Display error message if any */}
      {error && <p className="error">{error}</p>}

      {/* Display loading state */}
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
                  <td>{contact.phone || 'N/A'}</td>
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
