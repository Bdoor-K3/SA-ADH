import React from 'react';
import { useTranslation } from 'react-i18next';
import './AboutSection.css';

function AboutSection() {
  const { t } = useTranslation();

  return (
    <section className="about-section">
      <div className="container">
        <h2 className="about-title">{t('about.title')}</h2>
        <nav className="breadcrumb">
          <span>{t('about.breadcrumb.home')}</span> &gt; <span>{t('about.breadcrumb.aboutUs')}</span>
        </nav>

        <div className="tabs">
          <button className="tab active">{t('about.tabs.whoWeAre')}</button>
          <button className="tab">{t('about.tabs.whyChooseUs')}</button>
          <button className="tab">{t('about.tabs.ourVision')}</button>
        </div>

        <div className="tab-content">
          <div className="content-left">
            <h3>{t('about.tabs.whoWeAre')}</h3>
            <p>{t('about.content.whoWeAre.part1')}</p>
            <p>{t('about.content.whoWeAre.part2')}</p>
          </div>
          <div className="content-right">
            <img
              src="/images/about-us.jpg" // Replace with your actual image
              alt={t('about.imageAlt')}
              className="about-image"
            />
          </div>
        </div>

        <div className="stats">
          <h3>{t('about.stats.title')}</h3>
          <p>{t('about.stats.description')}</p>
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-number">500</span>
              <span className="stat-label">{t('about.stats.events')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">12,000+</span>
              <span className="stat-label">{t('about.stats.ticketsSold')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">8</span>
              <span className="stat-label">{t('about.stats.categories')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10</span>
              <span className="stat-label">{t('about.stats.partyOperators')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
