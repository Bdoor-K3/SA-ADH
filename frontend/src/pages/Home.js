import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents } from '../services/api';
import EventsSection from './Sections/EventsSection';
import AboutSection from './Sections/AboutSection';
import ContactSection from './Sections/ContactSection';
import QASection from './Sections/QASection';
import './Home.css';
import Slider from 'react-slick';

function Home() {
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
<div className="home">
      {/* Events Slider Section */}
      <section id="events-slider">
        <h2>Upcoming Events</h2>
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
                <p>Date: {new Date(event.dateOfEvent).toLocaleDateString()}</p>
                <button onClick={() => handleViewDetails(event._id)}>
                  More Details
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </section>
    </div>
       <AboutSection />
      <ContactSection />
      <QASection />
    </div>
  );
}

export default Home;
