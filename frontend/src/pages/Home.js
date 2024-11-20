import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { fetchEvents } from '../services/api';
import AboutSection from './Sections/AboutSection';
import ContactSection from './Sections/ContactSection';
import QASection from './Sections/QASection';
import Slider from 'react-slick';
import './Home.css';

function Home() {
  const { t } = useTranslation();
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
    <div className="home">
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
      </section>

      {/* Other Sections */}
      <AboutSection />
      <QASection />
      <ContactSection />
    </div>
  );
}

export default Home;
