import React from 'react';
import './AboutSaada.css';
import logo from '../assets/saada.png'; // Replace with the actual path to your logo
import ticketImage from '../assets/Ticket 2.png'; // Replace with the actual path to your ticket image

const AboutSaada = ({ t }) => {
  return (
    <section id="about-saada">
      <div className="about-container">
        <div className="about-content">
          <img src={logo} alt="Saada Logo" className="about-logo" />
          <h2 className="about-title">{t('about.saada.title')}</h2>
          <p className="about-description">
            {t('about.saada.description')}
          </p>
        </div>
        <div className="about-image">
          <img src={ticketImage} alt="Ticket" />
        </div>
      </div>

      {/* Statistics Section */}
      <div className="statistics-section">
        <img src={logo} alt="Saada Logo" className="statistics-logo" />
        <h3 className="statistics-title">{t('about.saada.numbersTitle')}</h3>
        <div className="statistics-numbers">
          <div className="stat-item">
            <div className="stat-circle">
              <span className="stat-value">22</span>
            </div>
            <p className="stat-label">{t('about.saada.events')}</p>
          </div>
          <div className="stat-item">
            <div className="stat-circle">
              <span className="stat-value">5000</span>
            </div>
            <p className="stat-label">{t('about.saada.clients')}</p>
          </div>
          <div className="stat-item">
            <div className="stat-circle">
              <span className="stat-value">12</span>
            </div>
            <p className="stat-label">{t('about.saada.partners')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSaada;
