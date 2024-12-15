import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { submitContactForm } from '../../services/api'; // Adjust the path to your api.js
import './ContactSection.css';

/**
 * ContactSection Component
 * Displays a contact form, Google map, and contact information with social media links.
 */
function ContactSection() {
  const { t, i18n } = useTranslation(); // Translation hook for multi-language support
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false); // Tracks the loading state during form submission
  const [success, setSuccess] = useState(null); // Tracks success or error messages

  /**
   * Handles input changes and updates form data.
   * @param {Object} e - The input change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  /**
   * Validates the input fields.
   * Ensures all fields meet basic criteria before submission.
   * @returns {boolean} - True if all validations pass, false otherwise.
   */
  const validateForm = () => {
    if (!formData.name.trim()) {
      setSuccess({ message: t('contact.form.validation.name'), type: 'error' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setSuccess({ message: t('contact.form.validation.email'), type: 'error' });
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setSuccess({ message: t('contact.form.validation.phone'), type: 'error' });
      return false;
    }
    if (!formData.message.trim()) {
      setSuccess({ message: t('contact.form.validation.message'), type: 'error' });
      return false;
    }
    return true;
  };

  /**
   * Handles form submission and sends data to the server.
   * Displays success or error messages based on the server response.
   * @param {Object} e - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await submitContactForm(formData);
      setSuccess({ message: response.message, type: 'success' });
      setFormData({ name: '', email: '', phone: '', message: '' }); // Clear the form
    } catch (error) {
      setSuccess({
        message: error.response?.data?.message || t('contact.form.submissionError'),
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
        {/* Contact Form */}
        <div className="contact-form">
          <h3>{t('contact.form.title')}</h3>
          {/* Display Success or Error Messages */}
          {success && (
            <div className={`alert ${success.type}`}>
              {success.message}
            </div>
          )}
          <form onSubmit={handleSubmit} noValidate>
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

        {/* Contact Information */}
        <div className="contact-info">
          <h3>{t('contact.info.title')}</h3>
          <p>
            <strong>{t('contact.info.addressLabel')}:</strong>{' '}
            {t('contact.info.address')}
          </p>
          <p>
            <strong>{t('contact.info.emailLabel')}:</strong> Contactus@happiness.sa
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
