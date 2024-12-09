import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Events from './pages/EventsPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import TicketPage from './pages/TicketPage';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminDashboard from './pages/admin/AdminDashboard';
import EventDetails from './pages/EventDetails';
import Profile from './pages/Profile';
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import ScanTicket from './pages/organizer/ScanTickets';
import About from './pages/Sections/AboutSection';
import FAQs from './pages/Sections/QASection';
import Contact from './pages/Sections/ContactSection';
import SplashScreen from './SplashScreen'; // Import the Splash Screen
import './App.css';

// ProtectedRoute Component
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token || (role && userRole !== role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay for the splash screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Show splash screen for 1 second

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  if (isLoading) {
    return <SplashScreen />; // Show Splash Screen while loading
  }

  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/ticket" element={<TicketPage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/about" element={<About />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes */}
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
          path="/organizer/scan/:id"
          element={
            <ProtectedRoute role="organizer">
              <ScanTicket />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
