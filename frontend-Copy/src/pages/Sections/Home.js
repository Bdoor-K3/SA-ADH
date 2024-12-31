import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { fetchEvents } from '../../services/api';
import EventsSlider from './HomeComponents/EventsSlider';
import EventList from './HomeComponents/EventList';
import Categories from './HomeComponents/Categories';
import AboutSaada from './HomeComponents/AboutSaada';
import Sponsors from './HomeComponents/Sponsors';
import './Home.css';
/**
 * Home Component
 * Renders the homepage with event sliders, event lists, categories, and additional sections.
 */
function Home() {
  const { t, i18n } = useTranslation(); // Translation hook for multi-language support
  const [events, setEvents] = useState([]); // State to store fetched events
  const navigate = useNavigate();

  /**
   * Fetches events data from the API when the component mounts.
   * Uses a try-catch block for error handling.
   */
  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEvents();
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    getEvents();
  }, []);

  /**
   * Navigates to the event details page.
   * Validates the event ID before navigating.
   * @param {string} id - The ID of the event to view.
   */
  const handleViewDetails = (id) => {
    if (!id) {
      console.error('Invalid event ID');
      return;
    }
    navigate(`/event/${id}`);
  };

  /**
   * Navigates to events filtered by category.
   * Ensures the category string is valid before navigating.
   * @param {string} category - The category to filter events by.
   */
  const handleCategoryClick = (category) => {
    if (!category || typeof category !== 'string') {
      console.error('Invalid category');
      return;
    }
    navigate(`/events?category=${category}`);
  };

  /**
   * Configuration for the event slider.
   * Adjusts settings for responsiveness and autoplay.
   */
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
      {/* Event Slider Section */}
      <EventsSlider
        events={events}
        handleViewDetails={handleViewDetails}
        sliderSettings={sliderSettings}
        t={t}
      />

      {/* Event List Section */}
      <EventList events={events} handleViewDetails={handleViewDetails} t={t} />

      {/* Categories Section */}

      {/* About Saada Section */}
      <AboutSaada t={t} />

      {/* Sponsors Section */}
      <Sponsors t={t} />
    </div>
  );
}

export default Home;
  //    <Categories handleCategoryClick={handleCategoryClick} t={t} />
