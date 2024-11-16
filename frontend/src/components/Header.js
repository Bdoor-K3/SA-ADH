import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <header className="header">
      <h1 className="header-title">
        <Link to="/">Event Ticketing</Link>
      </h1>
      <div className="header-auth-buttons">
        {token ? (
          <>
            <Link to="/profile" className="auth-button">Profile</Link>
            <button className="auth-button logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" className="auth-button">Sign Up</Link>
            <Link to="/login" className="auth-button">Login</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
