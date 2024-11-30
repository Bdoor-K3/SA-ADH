// Import axios for making HTTP requests
import axios from 'axios';

// Set up a base instance with the backend URL from .env
const api = axios.create({
  baseURL:'http://localhost:5000',
});//process.env.REACT_APP_BACKEND_URL
// 
// Add a request interceptor to include the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get All Events
export const fetchEvents = async () => {
  try {
    const response = await api.get('/api/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  return await api.post('/api/auth/register', userData);
};

export const loginUser = async (credentials) => {
  return await api.post('/api/auth/login', credentials);
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

// Get Event by ID
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

// Delete an Event
export const deleteEvent = async (eventId) => {
  return await api.delete(`/api/events/${eventId}`);
};

// Fetch Logs
export const fetchLogs = async () => {
  try {
    const response = await api.get('/api/logs');
    return response.data;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
};

// Fetch All Users
export const fetchUsers = async () => {
  try {
    const response = await api.get('/api/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Fetch User by Email
export const fetchUserByEmail = async (email) => {
  try {
    const response = await api.get(`/api/users/email/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};

// Update User
export const updateUser = async (id, updates) => {
  return await api.put(`/api/users/${id}`, updates);
};

// Delete User
export const deleteUser = async (id) => {
  return await api.delete(`/api/users/${id}`);
};

// Purchase Ticket
export const purchaseTicket = async (eventId) => {
  try {
    const response = await api.post('/api/tickets/purchase', { eventId });
    return response.data;
  } catch (error) {
    console.error('Error purchasing ticket:', error);
    throw error;
  }
};

// Fetch User Profile
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
    return response.data; // This includes _id, fullName, and email
  } catch (error) {
    console.error('Error fetching organizers:', error);
    throw error;
  }
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

export const validateTicket = async (qrCodeData, eventId) => {
  try {
    const response = await api.post('/api/tickets/validate', { qrCodeData, eventId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Correct API 
export const verifyPayment = async (tap_id) => {
  try {
    const response = await api.get(`/api/tickets/payment/callback?tap_id=${tap_id}`);
    return response;
  } catch (error) {
    throw error;
  }
};


// Forgot Password
export const forgotPassword = async (data) => {
  try {
    const response = await api.post('/api/auth/forgot-password', data);
    return response.data;
  } catch (error) {
    console.error('Error sending forgot password email:', error);
    throw error;
  }
};

// Reset Password
export const resetPassword = async ({ token, password }) => {
  try {
    const response = await api.post('/api/auth/reset-password', { token, password });
    return response; // Return the response from the server
  } catch (error) {
    throw error; // Pass any errors to the caller
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


// Export the instance for custom requests if needed
export default api;
