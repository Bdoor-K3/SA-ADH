import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false); // Close menu on mobile after clicking a link
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">
          <Link to="/">Event Ticketing</Link>
        </h1>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <nav className={`header-auth-buttons ${menuOpen ? 'open' : ''}`}>
          <a href="#events" onClick={() => handleScroll('events')} className="nav-link">
            Events
          </a>
          <a href="#about" onClick={() => handleScroll('about')} className="nav-link">
            About Us
          </a>
          <a href="#contact" onClick={() => handleScroll('contact')} className="nav-link">
            Contact Us
          </a>
          <a href="#qa" onClick={() => handleScroll('qa')} className="nav-link">
            Q&A
          </a>
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
        </nav>
      </div>
    </header>
  );
}

export default Header;
