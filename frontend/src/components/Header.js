import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes } from 'react-icons/fa'; // Icons for menu toggle
import logo from '../pages/assets/saada.png';
import './Header.css';

function Header() {
  const [menuVisible, setMenuVisible] = useState(window.innerWidth > 768); // Open on PC, closed on mobile
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  useEffect(() => {
    const handleResize = () => {
      setMenuVisible(window.innerWidth > 768); // Open menu by default on larger screens
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  return (
    <header className={`header ${i18n.language === 'ar' ? 'rtl' : ''}`}>
      {/* Top Header */}
      <div className="top_header">
        <div className="header-container">
          <div className="logo_site">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </div>
          <div className="find_us_block">
            <p>{t('header.find_us_on')}:</p>
            <ul className="social_head">
              <li>
                <a href="https://facebook.com">
                  <i className="fab fa-facebook-f"></i>
                </a>
              </li>
              <li>
                <a href="https://twitter.com">
                  <i className="fab fa-twitter"></i>
                </a>
              </li>
              <li>
                <a href="https://instagram.com">
                  <i className="fab fa-instagram"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button className="menu-toggle" onClick={toggleMenu}>
        {menuVisible ? <FaTimes /> : <FaBars />}
      </button>

      {/* Bottom Header */}
      <div className={`bottom_header ${menuVisible ? 'visible' : 'hidden'}`}>
        <div className="header-container">
          <ul className="main_menu">
            <li>
              <Link to="/" className="nav-link">
                {t('header.home')}
              </Link>
            </li>
            <li>
              <Link to="/events" className="nav-link">
                {t('header.events')}
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link">
                {t('header.about')}
              </Link>
            </li>
            <li>
              <Link to="/faqs" className="nav-link">
                {t('header.faqs')}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="nav-link">
                {t('header.contact')}
              </Link>
            </li>
            {token && (
              <li>
                <Link to="/profile" className="profile-button">
                  {t('header.profile')}
                </Link>
              </li>
            )}
          </ul>
          <div className="auth_buttons">
            {!token ? (
              <>
                <Link to="/login" className="auth-button login">
                  <i className="fas fa-sign-in-alt"></i> {t('header.login')}
                </Link>
                <Link to="/signup" className="auth-button signup">
                  <i className="fas fa-user-plus"></i> {t('header.signup')}
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="auth-button logout">
                <i className="fas fa-sign-out-alt"></i> {t('header.logout')}
              </button>
            )}
          </div>
          <div className="lang_site">
            <button onClick={toggleLanguage} className="lang-button">
              {i18n.language === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
