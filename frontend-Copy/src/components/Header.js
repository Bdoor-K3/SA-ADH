import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes, FaUser, FaHome, FaCalendarAlt, FaInfoCircle, FaQuestionCircle, FaEnvelope } from 'react-icons/fa'; // Icons for menu toggle, user, and navigation
import logo from '../pages/assets/saada.png';
import './Header.css';

function Header({ cart = [] }) {
  const [menuVisible, setMenuVisible] = useState(window.innerWidth > 768); // Open on PC, closed on mobile
  const [userMenuVisible, setUserMenuVisible] = useState(false); // User menu visibility
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Detect if user is on mobile
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const cartItemCount = cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  useEffect(() => {
    const handleResize = () => {
      setMenuVisible(window.innerWidth > 768); // Open menu by default on larger screens
      setIsMobile(window.innerWidth <= 768); // Update mobile state
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

  const toggleUserMenu = () => {
    setUserMenuVisible((prev) => !prev);
  };

  return (
    <header className={`header ${i18n.language === 'ar' ? 'rtl' : ''}`}>
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo_site">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        {/* Menu Toggle Button for Mobile */}
        {isMobile && (
          <button className="menu-toggle" onClick={toggleMenu}>
            {menuVisible ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        )}

        {/* Navigation Menu for Desktop */}
        {!isMobile && menuVisible && (
          <nav className="nav_menu">
            <ul className="main_menu">
              <li>
                <Link to="/" className="nav-link">
                  <FaHome /> {t('header.home')}
                </Link>
              </li>
              <li>
                <Link to="/events" className="nav-link">
                  <FaCalendarAlt /> {t('header.events')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="nav-link">
                  <FaInfoCircle /> {t('header.about')}
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="nav-link">
                  <FaQuestionCircle /> {t('header.faqs')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="nav-link">
                  <FaEnvelope /> {t('header.contact')}
                </Link>
              </li>
              <Link to="/cart" className="header-cart">
            <i className="cart-icon fa fa-shopping-cart"></i>
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </Link>
            </ul>
          </nav>
        )}

        {/* User Menu */}
        <div className="user_menu">
          <div className="dropdown">
            <button className="dropdown-toggle" onClick={toggleUserMenu}>
              <FaUser size={20} />
            </button>
            {userMenuVisible && (
              <ul className="dropdown-menu">
                {!token ? (
                  <>
                    <li>
                      <Link to="/login" className="dropdown-item">
                        {t('header.login')}
                      </Link>
                    </li>
                    <li>
                      <Link to="/signup" className="dropdown-item">
                        {t('header.signup')}
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/profile" className="dropdown-item">
                        {t('header.profile')}
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item logout-button"
                      >
                        {t('header.logout')}
                      </button>
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Language Switcher */}
        <div className="lang_switcher">
          <button onClick={toggleLanguage} className="lang-button">
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </button>
        </div>

        {/* Mobile Menu Popup as List Card under Button */}
        {isMobile && menuVisible && (
          <div className="mobile-menu-list-card" style={{ top: '60px', right: 'auto', left: '0' }}>
            <ul className="mobile-menu-list">
              <li>
                <Link to="/" className="mobile-nav-link" onClick={toggleMenu}>
                  <FaHome /> {t('header.home')}
                </Link>
              </li>
              <li>
                <Link to="/events" className="mobile-nav-link" onClick={toggleMenu}>
                  <FaCalendarAlt /> {t('header.events')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="mobile-nav-link" onClick={toggleMenu}>
                  <FaInfoCircle /> {t('header.about')}
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="mobile-nav-link" onClick={toggleMenu}>
                  <FaQuestionCircle /> {t('header.faqs')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="mobile-nav-link" onClick={toggleMenu}>
                  <FaEnvelope /> {t('header.contact')}
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
