import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchEvents } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./EventsPage.css";

function EventsPage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getEvents = async () => {
      const data = await fetchEvents();
      setEvents(data);
      setFilteredEvents(data);
    };

    getEvents();
  }, []);

  const handleFilter = () => {
    let filtered = events;

    if (filterCategory) {
      filtered = filtered.filter((event) => event.category === filterCategory);
    }

    if (filterDate) {
      filtered = filtered.filter(
        (event) =>
          new Date(event.dateOfEvent).toLocaleDateString() ===
          new Date(filterDate).toLocaleDateString()
      );
    }

    if (search) {
      filtered = filtered.filter((event) =>
        event.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  const handleClearFilters = () => {
    setFilterCategory("");
    setFilterDate("");
    setSearch("");
    setFilteredEvents(events);
  };

  const handleViewDetails = (id) => {
    navigate(`/event/${id}`);
  };

  return (
    <div className="events-page-container">
      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder={t("eventsPage.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
      </div>

      <div className="events-content"> 
         {/* Events List */}
        <div className="events-list-container">
          {filteredEvents.map((event) => (
            <div className="events-card" key={event._id}>
              <div className="events-card-date">
                <p className="date-day">
                  {new Date(event.dateOfEvent).toLocaleDateString("en", { day: "2-digit" })}
                </p>
                <p className="date-month">
                  {new Date(event.dateOfEvent).toLocaleDateString("en", { month: "short" })}
                </p>
                <p className="date-time">
                  {new Date(event.dateOfEvent).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="events-card-details">
                <h3 className="event-category">{event.category}</h3>
                <h2 className="event-title">{event.name}</h2>
                <p className="event-location">{event.city}</p>
                <p className="event-price">
                  {t("eventsPage.eventCard.price")} {event.price} {event.currency}
                </p>
                <div className="event-buttons">
                  <button
                    className="book-button"
                    onClick={() => handleViewDetails(event._id)}
                  >
                    {t("eventsPage.eventCard.bookNow")}
                  </button>
                  <button
                    className="details-button"
                    onClick={() => handleViewDetails(event._id)}
                  >
                    {t("eventsPage.eventCard.details")}
                  </button>
                </div>
              </div>

              <div className="events-card-image-container">
                <img
                  src={event.image || "/assets/default-event.jpg"}
                  alt={event.name}
                  className="event-image"
                />
              </div>
            </div>
          ))}
        </div>
        {/* Filter Box */}
        <div className="events-filter-box">
          <h3>{t("eventsPage.filter.title")}</h3>
          <div className="filter-options">
            <label>{t("eventsPage.filter.category")}</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">{t("eventsPage.filter.selectCategory")}</option>
              <option value="Sports">{t("eventsPage.filter.categories.sports")}</option>
              <option value="Theatre">{t("eventsPage.filter.categories.theatre")}</option>
            </select>
            <label>{t("eventsPage.filter.date")}</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <button className="filter-button" onClick={handleFilter}>
              {t("eventsPage.filter.apply")}
            </button>
            <button className="clear-button" onClick={handleClearFilters}>
              {t("eventsPage.filter.clear")}
            </button>
          </div>
        </div>

      
        
      </div>
    </div>
  );
}

export default EventsPage;
