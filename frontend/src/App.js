import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Header from './components/Header';
import AdminDashboard from './pages/admin/AdminDashboard';
import EventDetails from './pages/EventDetails';
import Profile from './pages/Profile';
import './App.css';
import OrganizerDashboard from './pages/organizer/OrganizerDashboard'; // New organizer page
import ScanTickets from './pages/organizer/ScanTickets'; // Import the ScanTickets component

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token || (role && userRole !== role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer"
          element={
            <ProtectedRoute role="organizer">
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/organizer/scan/:eventId"
  element={
    <ProtectedRoute role="organizer">
      <ScanTickets />
    </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
