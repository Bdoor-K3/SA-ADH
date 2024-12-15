// Import axios for making HTTP requests
import axios from 'axios';

/**
 * Axios instance setup
 */
const api = axios.create({
  baseURL: 'http://localhost:5001', // Replace with process.env.REACT_APP_BACKEND_URL in production
});

// Add Authorization header interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * API Endpoints
 */

// Authentication APIs
export const registerUser = async (userData) => {
  return await api.post('/api/auth/register', userData);
};

export const loginUser = async (credentials) => {
  return await api.post('/api/auth/login', credentials);
};

export const forgotPassword = async (data) => {
  try {
    const response = await api.post('/api/auth/forgot-password', data);
    return response.data;
  } catch (error) {
    console.error('Error sending forgot password email:', error);
    throw error;
  }
};

export const resetPassword = async ({ token, password }) => {
  try {
    const response = await api.post('/api/auth/reset-password', { token, password });
    return response;
  } catch (error) {
    throw error;
  }
};

// Event APIs
export const fetchEvents = async () => {
  try {
    const response = await api.get('/api/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const fetchEventsAdmin = async () => {
  try {
    const response = await api.get('/api/events/admin');
    return response.data;
  } catch (error) {
    console.error('Error fetching events for admin:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/api/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const getEventById = async (id) => {
  try {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    throw error;
  }
};

export const updateEvent = async (eventId, updates) => {
  try {
    const response = await api.put(`/api/events/${eventId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  return await api.delete(`/api/events/${eventId}`);
};

export const fetchEventsForOrganizer = async () => {
  try {
    const response = await api.get('/api/events/organizer/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events for organizer:', error);
    throw error;
  }
};

// Ticket APIs
export const validateTicket = async (qrCodeData, eventId) => {
  try {
    const response = await api.post('/api/tickets/validate', { qrCodeData, eventId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const purchaseTicket = async (eventIds, tickets) => {
  try {
    const response = await api.post('/api/tickets/purchase', { eventIds, tickets });
    return response.data;
  } catch (error) {
    console.error('Error purchasing tickets:', error);
    throw error;
  }
};

export const purchaseFreeTicket = async ({ eventId, ticketClass, quantity }) => {
  try {
    const response = await api.post('/api/tickets/purchase/free', { eventId, ticketClass, quantity });
    return response.data;
  } catch (error) {
    console.error('Error purchasing free ticket:', error);
    throw error;
  }
};

export const fetchTickets = async (queryParams = '') => {
  try {
    const response = await api.get(`/api/tickets?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

export const markTicketAsUsed = async (ticketId) => {
  try {
    const response = await api.put(`/api/tickets/${ticketId}/use`);
    return response.data;
  } catch (error) {
    console.error('Error marking ticket as used:', error);
    throw error;
  }
};

export const verifyPayment = async (tap_id) => {
  try {
    const response = await api.get(`/api/tickets/payment/callback`, { params: { tap_id } });
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

// User APIs
export const fetchUsers = async () => {
  try {
    const response = await api.get('/api/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchUserByEmail = async (email) => {
  try {
    const response = await api.get(`/api/users/email/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/api/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const fetchOrganizers = async () => {
  try {
    const response = await api.get('/api/users/organizers');
    return response.data;
  } catch (error) {
    console.error('Error fetching organizers:', error);
    throw error;
  }
};

export const updateUser = async (id, updates) => {
  return await api.put(`/api/users/${id}`, updates);
};

export const deleteUser = async (id) => {
  return await api.delete(`/api/users/${id}`);
};

// Contact APIs
export const submitContactForm = async (formData) => {
  try {
    const response = await api.post('/api/contact', formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

export const fetchContacts = async () => {
  try {
    const response = await api.get('/api/contact');
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

export const deleteContact = async (contactId) => {
  try {
    const response = await api.delete(`/api/contact/${contactId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};

/**
 * Export the axios instance for custom requests if needed.
 */
export default api;
