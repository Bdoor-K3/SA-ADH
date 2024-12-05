import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { fetchEvents } from '../services/api';
import EventsSlider from './HomeComponents/EventsSlider';
import EventList from './HomeComponents/EventList';
import Categories from './HomeComponents/Categories';
import AboutSaada from './HomeComponents/AboutSaada';
import Sponsors from './HomeComponents/Sponsors';
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

  const handleCategoryClick = (category) => {
    navigate(`/events?category=${category}`);
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
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className={`home ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
      <EventsSlider
        events={events}
        handleViewDetails={handleViewDetails}
        sliderSettings={sliderSettings}
        t={t}
      />
      <EventList events={events} handleViewDetails={handleViewDetails} t={t} />
      <Categories handleCategoryClick={handleCategoryClick} t={t} />
      <AboutSaada t={t} />
      <Sponsors t={t} />
    </div>
  );
}

export default Home;
