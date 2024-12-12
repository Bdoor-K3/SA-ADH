import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';

function Footer() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <footer className={`footer ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="footer-container">
        {/* Quick Links Section */}
        <div className="footer-section links-section">
          <h3>{t('footer.links')}</h3>
          <ul>
            <li>
              <a href="/">{t('footer.home')}</a>
            </li>
            <li>
              <a href="/events">{t('footer.events')}</a>
            </li>
            <li>
              <a href="/contact">{t('footer.contact')}</a>
            </li>
            <li>
              <a href="/about">{t('footer.aboutUs')}</a>
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

          </ul>
        </div>
      </div>

      {/* Follow Us Section */}
      <div className="footer-social">
        <h3>{t('footer.social')}</h3>
        <div className="footer-social-icons">
          <a
            className="instagram"
            href="https://www.instagram.com/saadah.me"
            target="_blank"
            rel="noopener noreferrer"
          ></a>
          <a
            className="twitter"
            href="https://x.com/saadah_me"
            target="_blank"
            rel="noopener noreferrer"
          ></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
