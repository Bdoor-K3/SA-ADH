import React from 'react';
import { useTranslation } from 'react-i18next';
import './ContactSection.css';

function ContactSection() {
  const { t } = useTranslation();

  return (
    <section className="contact-section">
      {/* خريطة Google */}
      <div className="map-container">
        <iframe
          title={t('contact.map.title')}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224346.2641786824!2d46.572522783181834!3d24.77426568084008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f02857f56040f%3A0x94761e0a2d5a065e!2sRiyadh%2C%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1699294467053!5m2!1sen!2sus"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      {/* محتوى الاتصال */}
      <div className="contact-content">
        <div className="contact-form">
          <h3>{t('contact.form.title')}</h3>
          <form>
            <input
              type="text"
              placeholder={t('contact.form.namePlaceholder')}
              required
            />
            <input
              type="email"
              placeholder={t('contact.form.emailPlaceholder')}
              required
            />
            <input
              type="text"
              placeholder={t('contact.form.phonePlaceholder')}
              required
            />
            <textarea
              placeholder={t('contact.form.messagePlaceholder')}
              required
            ></textarea>
            <button type="submit">{t('contact.form.submitButton')}</button>
          </form>
        </div>

        <div className="contact-info">
          <h3>{t('contact.info.title')}</h3>
          <p>
            <strong>{t('contact.info.addressLabel')}:</strong>{' '}
            {t('contact.info.address')}
          </p>
          <p>
            <strong>{t('contact.info.emailLabel')}:</strong> info@Tathazer.net
          </p>
          <p>
            <strong>{t('contact.info.phoneLabel')}:</strong> +59 123456789121
          </p>
          <div className="social-icons">
            <a href="#facebook" className="social-icon">
              Facebook
            </a>
            <a href="#twitter" className="social-icon">
              Twitter
            </a>
            <a href="#instagram" className="social-icon">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
