import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { fetchEvents } from '../services/api';
import Slider from 'react-slick';
import './Home.css';

function Home() {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    getEvents();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/event/${id}`);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <div className={`home ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Events Slider Section */}
      <section id="events-slider">
        <h2>{t('home.sections.eventsSlider.title')}</h2>
        <Slider {...sliderSettings}>
          {events.map((event) => (
            <div key={event._id} className="slider-card">
              <img
                src={event.image} // Ensure your events have an image property
                alt={event.name}
                className="event-image"
              />
              <div className="slider-content">
                <h3>{event.name}</h3>
                <p>{event.description}</p>
                <p>
                  {t('home.sections.eventsSlider.date')}: {new Date(event.dateOfEvent).toLocaleDateString()}
                </p>
                <button onClick={() => handleViewDetails(event._id)}>
                  {t('home.sections.eventsSlider.moreDetails')}
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Events List Section */}
      <div id="event-list">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <img src={event.image} alt={event.name} />
            <div className="event-content">
              <h3>{event.name}</h3>
              <p>{new Date(event.dateOfEvent).toLocaleDateString()}</p>
              <button onClick={() => handleViewDetails(event._id)}>
                {t('home.sections.eventsSlider.moreDetails')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* About Section */}
      <section className="who-we-are">
        <div className="who-container">
          <div className="who-text">
            <h3>{t('home.sections.whoWeAre.title')}</h3>
            <h2>{t('home.sections.whoWeAre.subTitle')}</h2>
            <p>{t('home.sections.whoWeAre.description1')}</p>
            <p>{t('home.sections.whoWeAre.description2')}</p>
            <div className="signature">
              <span>{t('home.sections.whoWeAre.signature')}</span>
            </div>
          </div>
          <div className="who-images"></div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="sponsors">
        <div className="sponsors-container">
          <h2>{t('home.sponsors.title')}</h2>
          <p className="sponsors-subtitle">{t('home.sponsors.subtitle')}</p>
          <div className="sponsors-grid">
            <div className="sponsor-card">
              <img src="/assets/sponsor1.png" alt="Sponsor 1" />
            </div>
            <div className="sponsor-card">
              <img src="/assets/sponsor2.png" alt="Sponsor 2" />
            </div>
            <div className="sponsor-card">
              <img src="/assets/sponsor3.png" alt="Sponsor 3" />
            </div>
            <div className="sponsor-card">
              <img src="/assets/sponsor4.png" alt="Sponsor 4" />
            </div>
            <div className="sponsor-card">
              <img src="/assets/sponsor5.png" alt="Sponsor 5" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
