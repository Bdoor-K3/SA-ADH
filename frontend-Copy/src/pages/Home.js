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
  };

  return (
    <div className={`home ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
<section id="events-slider">
  <Slider {...sliderSettings}>
    {events.map((event) => (
      <div key={event._id} className="slider-card">
        {/* Ticket Container */}
        <div className="Home-ticket-container">
          <div className="ticket-content">
            <h3 className="event-name">{event.name}</h3>
            <p className="event-description">{event.description}</p>
            <div className="event-details">
              <span className="event-date">
                <i className="fas fa-calendar-alt"></i> {new Date(event.dateOfEvent).toLocaleDateString()}
              </span>
              <span className="event-time">
                <i className="fas fa-clock"></i> {event.time}
              </span>
            </div>
            <button className="book-button" onClick={() => handleViewDetails(event._id)}>
              {t('home.bookNow')}
            </button>
          </div>
          <div className="ticket-image">
            <img src={event.image} alt={event.name} className="event-image" />
          </div>
        </div>
      </div>
    ))}
  </Slider>
</section>
{/* Events List Section */}
<section id="event-list">
  <h2 className="section-title">{t('home.latestEvents')}</h2>
  <div className="event-cards">
    {events.map((event) => (
      <div key={event._id} >
        <div className="ticket-card">
          {/* Event Image with Cutouts */}
          <div className="event-image-container">
            <img src={event.image} alt={event.name} className="event-image" />
          </div>
          {/* Event Details */}
          <div className="ticket-content">
            <h3 className="event-title">{event.name}</h3>
            <p className="event-date">
              <i className="fas fa-calendar-alt"></i>{' '}
              {new Date(event.dateOfEvent).toLocaleDateString()}
            </p>
            <p className="event-location">
              <i className="fas fa-map-marker-alt"></i> {event.location}
            </p>
          </div>
          {/* Book Button */}
          <button className="book-button" onClick={() => handleViewDetails(event._id)}>
            {t('home.bookNow')}
          </button>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* Categories Section */}
      <section id="categories">
        <h2>{t('home.exploreCategories')}</h2>
        <div className="category-cards">
          {['Music', 'Sports', 'Theater', 'Adventure'].map((category) => (
            <div
              key={category}
              className="category-card"
              onClick={() => handleCategoryClick(category)}
            >
              <img src={`/assets/categories/${category.toLowerCase()}.png`} alt={category} />
              <h3>{t(`home.categories.${category}`)}</h3>
            </div>
          ))}
        </div>
      </section>
{/* About Saada Section */}
<section id="about-saada">
  <div className="about-container">
    <div className="about-logo"></div>
    <div className="about-content">
      <h2 className="about-title">{t('about.saada.title')}</h2>
      <p className="about-description">
        موقع "سعادة" هو منصة مبتكرة تتيح للمستخدمين حجز التذاكر للفعاليات والمناسبات بسهولة وسرعة.
        يوفر الموقع مجموعة واسعة من الفعاليات الترفيهية والثقافية والرياضية، مع واجهة مستخدم بسيطة وتجربة مريحة.
        يهدف "سعادة" إلى تسهيل الوصول إلى الفعاليات المميزة في المملكة العربية السعودية، مع خيارات دفع آمنة وخدمة عملاء متميزة.
        اكتشف عالمك المفضل واحجز مكانك في لحظات لا تُنسى!
      </p>
    </div>
    <div className="about-icon"></div>
  </div>
</section>

{/* Sponsors/Partners Section */}
<section id="sponsors">
  <div className="sponsors-container">
    <h2 className="sponsors-title">{t('sponsors.title')}</h2>
    <div className="sponsors-logos">
      <div className="sponsor-logo sponsor1"></div>
      <div className="sponsor-logo sponsor2"></div>
      <div className="sponsor-logo sponsor3"></div>
      <div className="sponsor-logo sponsor4"></div>
      <div className="sponsor-logo sponsor5"></div>
    </div>
  </div>
</section>


    </div>
  );
}

export default Home;
