import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchEvents } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./EventsPage.css";

function EventsPage() {
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

  return (
    <div className="events-page">
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
              src={event.image || "/assets/default-event.jpg"} // Use the event image or fallback
              alt={event.name}
              className="event-image"
            />
            <div className="event-info">
              <h3>{event.name}</h3>
              <p className="event-date">
                {t("eventsPage.eventCard.date")}:{" "}
                {new Date(event.dateOfEvent).toLocaleDateString()}
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
