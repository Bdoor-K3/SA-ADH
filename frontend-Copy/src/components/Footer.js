import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Quick Links Section */}
        <div className="footer-section links-section">
          <h3>{t('footer.links')}</h3>
          <ul>
            <li>
              <a href="#home">{t('footer.home')}</a>
            </li>
            <li>
              <a href="#events">{t('footer.events')}</a>
            </li>
            <li>
              <a href="#contact">{t('footer.contact')}</a>
            </li>
            <li>
              <a href="#about">{t('footer.aboutUs')}</a>
            </li>
          </ul>
        </div>

        {/* About Saada Section */}
        <div className="footer-section about-section">
          <h3>{t('footer.about')}</h3>
          <ul>
            <li>
              <i></i> {t('footer.address')}
            </li>
            <li>
              <i></i> {t('footer.email')}
            </li>
            <li>
              <i></i> {t('footer.phone')}
            </li>
          </ul>
        </div>
      </div>

      {/* Follow Us Section */}
      <div className="footer-social">
        <h3>{t('footer.social')}</h3>
        <div className="social-icons">
          <a className="facebook" href="https://facebook.com" target="_blank" rel="noopener noreferrer"></a>
          <a className="instagram" href="https://instagram.com" target="_blank" rel="noopener noreferrer"></a>
          <a className="twitter" href="https://twitter.com" target="_blank" rel="noopener noreferrer"></a>
          <a className="dribbble" href="https://dribbble.com" target="_blank" rel="noopener noreferrer"></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
