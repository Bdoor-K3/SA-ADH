import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem('token'); // Check if user is logged in
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <header className="header">
      {/* Top Header */}
      <div className="top_header">
        <div className="header-container">
          <div className="logo_site">
            <Link to="/">
              <img src="/path-to-logo.png" alt="Logo" />
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

      {/* Bottom Header */}
      <div className="bottom_header">
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
              <a href="#about" onClick={() => toggleMenu()} className="nav-link">
                {t('header.about')}
              </a>
            </li>
            <li>
              <a href="#faq" onClick={() => toggleMenu()} className="nav-link">
                {t('header.faqs')}
              </a>
            </li>
            <li>
              <a href="#contact" onClick={() => toggleMenu()} className="nav-link">
                {t('header.contact')}
              </a>
            </li>
            {token && (
              <li>
                <Link to="/profile" className="nav-link profile-button">
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
