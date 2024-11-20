import React from 'react';
import './ContactSection.css';

function ContactSection() {
  return (
    <section className="contact-section">
      <div className="container">
        <h2 className="contact-title">Contact Us</h2>
        <nav className="breadcrumb">
          <span>Home</span> &gt; <span>Contact Us</span>
        </nav>

        <div className="map-container">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224346.2641786824!2d46.572522783181834!3d24.77426568084008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f02857f56040f%3A0x94761e0a2d5a065e!2sRiyadh%2C%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1699294467053!5m2!1sen!2sus"
            width="100%"
            height="400"
            style={{ border: '0' }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        <div className="contact-content">
          <div className="contact-form">
            <h3>Get in touch With Us</h3>
            <form>
              <input type="text" placeholder="Your Name *" required />
              <input type="email" placeholder="Email Address *" required />
              <input type="text" placeholder="Phone Number *" required />
              <textarea placeholder="Message *" required></textarea>
              <button type="submit">Contact Us</button>
            </form>
          </div>

          <div className="contact-info">
            <h3>Our Contact Info</h3>
            <p>
              <strong>Address:</strong> 8273 Riyadh, Saudi Arabia
            </p>
            <p>
              <strong>Email:</strong> info@Tathazer.net
            </p>
            <p>
              <strong>Phone:</strong> +59 123456789121
            </p>
            <div className="social-icons">
              <a href="#facebook" className="social-icon">Facebook</a>
              <a href="#twitter" className="social-icon">Twitter</a>
              <a href="#instagram" className="social-icon">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
