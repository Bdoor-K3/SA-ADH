import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>{t('footer.about')}</h3>
          <ul>
            <li>{t('footer.address')}</li>
            <li>{t('footer.email')}</li>
            <li>{t('footer.phone')}</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>{t('footer.links')}</h3>
          <ul>
            <li><a href="#home">{t('footer.home')}</a></li>
            <li><a href="#events">{t('footer.events')}</a></li>
            <li><a href="#about">{t('footer.aboutUs')}</a></li>
            <li><a href="#contact">{t('footer.contact')}</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>{t('footer.social')}</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          {t('footer.copyright')}{' '}
          <a href="https://tathaker.net">Tathaker.com</a>.
        </p>
        <p>{t('footer.poweredBy')}</p>
      </div>
    </footer>
  );
}

export default Footer;
