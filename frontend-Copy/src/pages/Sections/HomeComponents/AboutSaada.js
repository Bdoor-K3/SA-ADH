import React from 'react';
import './AboutSaada.css';
import logo from '../../assets/saada.png'; // Replace with the actual path to your logo
import ticketImage from '../../assets/Ticket 2.png'; // Replace with the actual path to your ticket image

/**
 * AboutSaada Component
 * Displays information about Saada with statistics and visuals.
 */
const AboutSaada = ({ t }) => {
  return (
    <section id="about-saada">
      {/* About Section */}
      <div className="about-container">
        <div className="about-content">
          <img src={logo} alt={t('about.saada.logoAlt')} className="about-logo" />
          <h2 className="about-title">{t('about.saada.title')}</h2>
          <p className="about-description">
            {t('about.saada.description')}
          </p>
        </div>
        <div className="about-image">
          <img src={ticketImage} alt={t('about.saada.ticketAlt')} />
        </div>
      </div>

      {/* Statistics Section */}
      <div className="statistics-section">
        <img src={logo} alt={t('about.saada.logoAlt')} className="statistics-logo" />
        <h3 className="statistics-title">{t('about.saada.numbersTitle')}</h3>
        <div className="statistics-numbers">
          {/* Events Statistic */}
          <div className="stat-item">
            <div className="stat-circle">
              <span className="stat-value">22</span>
            </div>
            <p className="stat-label">{t('about.saada.events')}</p>
          </div>
          {/* Clients Statistic */}
          <div className="stat-item">
            <div className="stat-circle">
              <span className="stat-value">5000</span>
            </div>
            <p className="stat-label">{t('about.saada.clients')}</p>
          </div>
          {/* Partners Statistic */}
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
