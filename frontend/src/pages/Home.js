import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../services/api";
import Slider from "react-slick";
import "./Home.css";

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
        console.error("Error fetching events:", error);
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
        <h2>{t("home.sections.eventsSlider.title")}</h2>
        <Slider {...sliderSettings}>
          {events.map((event) => (
            <div key={event._id} className="slider-card">
              <img
                src={event.image || "/assets/default-event.jpg"} // Use the event image or fallback
                alt={event.name}
                className="event-image"
              />
              <div className="slider-content">
                <h3>{event.name}</h3>
                <p>{event.description}</p>
                <p>
                  {t("home.sections.eventsSlider.date")}:{" "}
                  {new Date(event.dateOfEvent).toLocaleDateString()}
                </p>
                <button onClick={() => handleViewDetails(event._id)}>
                  {t("home.sections.eventsSlider.moreDetails")}
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Additional Static Sections */}
      <section id="about">
        <h2>{t("home.sections.about.title")}</h2>
        <p>{t("home.sections.about.content")}</p>
      </section>

      <section id="contact">
        <h2>{t("home.sections.contact.title")}</h2>
        <p>{t("home.sections.contact.content")}</p>
      </section>
    </div>
  );
}

export default Home;
