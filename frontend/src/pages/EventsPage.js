import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchEvents } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./EventsPage.css";

function EventsPage() {
  const { t, i18n } = useTranslation(); // Added `i18n` for direction handling
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getEvents = async () => {
      const data = await fetchEvents();
      setEvents(data);
    };

    getEvents();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/event/${id}`);
  };

  return (
    <div className={`events-page ${i18n.language === "ar" ? "rtl" : "ltr"}`}>
      <div className="events-header">
        <h1>{t("eventsPage.title")}</h1>
        <p>
          {events.length} {t("eventsPage.results")}
        </p>
      </div>
      <div className="events-grid">
        {events.map((event) => (
          <div className="event-card" key={event._id}>
            <img
              src={event.image || "/assets/default-event.jpg"} // Add a default image if no image exists
              alt={event.name}
              className="event-image"
            />
            <div className="event-info">
              <h3>{event.name}</h3>
              <p className="event-date">
                {t("eventsPage.eventCard.date")}: {new Date(event.dateOfEvent).toLocaleDateString()}
              </p>
              <p className="event-description">{event.description}</p>
              <button
                onClick={() => handleViewDetails(event._id)}
                className="event-booking-button"
              >
                {t("eventsPage.eventCard.booking")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsPage;
