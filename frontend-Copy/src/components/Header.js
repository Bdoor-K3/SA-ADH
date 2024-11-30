import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa'; // Icons for menu toggle and user
import logo from '../pages/assets/saada.png';
import './Header.css';

function Header() {
  const [menuVisible, setMenuVisible] = useState(window.innerWidth > 768); // Open on PC, closed on mobile
  const [userMenuVisible, setUserMenuVisible] = useState(false); // User menu visibility
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

        {/* Navigation Menu */}
        <nav className="nav_menu">
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
          </ul>
        </nav>

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
      </div>
    </header>
  );
}

export default Header;
