import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './AboutSection.css';

function AboutSection() {
  const { t, i18n } = useTranslation(); // Added i18n for direction handling
  const [activeTab, setActiveTab] = useState('whoWeAre');

  // Tabs content mapping
  const tabs = [
    {
      id: 'whoWeAre',
      icon: 'fas fa-users', // FontAwesome Icon
      title: t('about.tabs.whoWeAre'),
      content: [t('about.content.whoWeAre.part1'), t('about.content.whoWeAre.part2')],
    },
    {
      id: 'whyChooseUs',
      icon: 'fas fa-thumbs-up',
      title: t('about.tabs.whyChooseUs'),
      content: [t('about.content.whyChooseUs.part1'), t('about.content.whyChooseUs.part2')],
    },
    {
      id: 'ourVision',
      icon: 'fas fa-eye',
      title: t('about.tabs.ourVision'),
      content: [t('about.content.ourVision.part1'), t('about.content.ourVision.part2')],
    },
  ];

  return (
    <section className={`about-section ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="container">
        <h2 className="about-title">{t('about.title')}</h2>
        <nav className="breadcrumb">
          <span>{t('about.breadcrumb.home')}</span> &gt; <span>{t('about.breadcrumb.aboutUs')}</span>
        </nav>

        {/* Tabs Navigation */}
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`${tab.icon} tab-icon`}></i>
              {tab.title}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <div className="tab-content">
          <div className="content-left">
            <h3>{tabs.find((tab) => tab.id === activeTab).title}</h3>
            {tabs.find((tab) => tab.id === activeTab).content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="content-right">
            <div className={`about-image about-image-${activeTab}`}></div>
          </div>
        </div>

        {/* Statistics Section */}
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
