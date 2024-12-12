import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { submitContactForm } from '../../services/api'; // Adjust the path to your api.js
import './ContactSection.css';

function ContactSection() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // For success or error messages

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    try {
      const response = await submitContactForm(formData);
      setSuccess({ message: response.message, type: 'success' });
      setFormData({ name: '', email: '', phone: '', message: '' }); // Clear form
    } catch (error) {
      setSuccess({
        message: error.response?.data?.message || 'Submission failed. Try again later.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`contact-section ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Google Map */}
      <div className="map-container">
        <iframe
          title={t('contact.map.title')}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224346.2641786824!2d46.572522783181834!3d24.77426568084008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f02857f56040f%3A0x94761e0a2d5a065e!2sRiyadh%2C%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1699294467053!5m2!1sen!2sus"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      {/* Contact Content */}
      <div className="contact-content">
        <div className="contact-form">
          <h3>{t('contact.form.title')}</h3>
          {/* Display Success or Error Messages */}
          {success && (
            <div className={`alert ${success.type}`}>
              {success.message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder={t('contact.form.namePlaceholder')}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder={t('contact.form.emailPlaceholder')}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder={t('contact.form.phonePlaceholder')}
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder={t('contact.form.messagePlaceholder')}
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit" disabled={loading}>
              {loading ? t('contact.form.submitting') : t('contact.form.submitButton')}
            </button>
          </form>
        </div>

        <div className="contact-info">
          <h3>{t('contact.info.title')}</h3>
          <p>
            <strong>{t('contact.info.addressLabel')}:</strong>{' '}
            {t('contact.info.address')}
          </p>
          <p>
            <strong>{t('contact.info.emailLabel')}:</strong> Contactus@happiness.sa
          </p>
          <p>
          </p>
          <div className="social-icons">
            <a href="https://x.com/saadah_me?s=21" className="social-icon" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.instagram.com/saadah.me?igsh=Mjk2Z291MzQ2eGJ0" className="social-icon" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
