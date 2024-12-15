import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchEvents } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import "./EventsPage.css";

/**
 * EventsPage Component
 * Displays a list of events with search, filter, and navigation functionalities.
 */
function EventsPage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]); // Original list of events
  const [filteredEvents, setFilteredEvents] = useState([]); // Filtered list of events
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const navigate = useNavigate();

  /**
   * Fetches events from the API on component mount.
   * Handles errors gracefully.
   */
  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEvents();
        if (Array.isArray(data)) {
          setEvents(data);
          setFilteredEvents(data);
        } else {
          console.error("Unexpected data format from API", data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    getEvents();
  }, []);

  /**
   * Filters events based on search, category, date, and price.
   */
  const handleFilter = () => {
    let filtered = events;

    if (filterCategory) {
      filtered = filtered.filter(
        (event) => event.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    if (filterDate) {
      filtered = filtered.filter(
        (event) =>
          new Date(event.dateOfEvent).toLocaleDateString() ===
          new Date(filterDate).toLocaleDateString()
      );
    }

    if (filterPrice) {
      const price = parseFloat(filterPrice);
      if (!isNaN(price)) {
        filtered = filtered.filter(
          (event) =>
            event.tickets &&
            event.tickets.some((ticket) => ticket.price <= price)
        );
      }
    }

    if (search) {
      filtered = filtered.filter((event) =>
        event.name.toLowerCase().includes(search.toLowerCase()) ||
        event.category.toLowerCase().includes(search.toLowerCase()) ||
        event.city.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  /**
   * Clears all filters and resets the event list.
   */
  const handleClearFilters = () => {
    setFilterCategory("");
    setFilterDate("");
    setFilterPrice("");
    setSearch("");
    setFilteredEvents(events);
  };

  /**
   * Navigates to the event details page.
   * Ensures a valid event ID is passed.
   * @param {string} id - The ID of the event.
   */
  const handleViewDetails = (id) => {
    if (!id) {
      console.error("Invalid event ID");
      return;
    }
    navigate(`/event/${id}`);
  };

  /**
   * Toggles the visibility of the filter popup.
   */
  const toggleFilterPopup = () => {
    setShowFilterPopup((prev) => !prev);
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

        {/* Filter Icon Button for Mobile Users */}
        <div className="filter-icon-container">
          <button className="filter-icon-button" onClick={toggleFilterPopup}>
            <i className="fa fa-filter"></i>
          </button>
        </div>
      </div>

      <div className="events-content">
        {/* Filter Popup */}
        {showFilterPopup && (
          <div className="filter-popup">
            <div className="filter-popup-content">
              <h3>{t("eventsPage.filter.title")}</h3>
              <div className="filter-options">
                <label>{t("eventsPage.filter.category")}</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">
                    {t("eventsPage.filter.selectCategory")}
                  </option>
                  <option value="Sports">
                    {t("eventsPage.filter.categories.sports")}
                  </option>
                  <option value="Theatre">
                    {t("eventsPage.filter.categories.theatre")}
                  </option>
                </select>
                <label>{t("eventsPage.filter.date")}</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
                <label>{t("eventsPage.filter.price")}</label>
                <input
                  type="number"
                  placeholder={t("eventsPage.filter.maxPrice")}
                  value={filterPrice}
                  onChange={(e) => setFilterPrice(e.target.value)}
                  className="search-bar"
                />
                <button
                  className="filter-button"
                  onClick={() => {
                    handleFilter();
                    toggleFilterPopup();
                  }}
                >
                  {t("eventsPage.filter.apply")}
                </button>
                <button
                  className="clear-button"
                  onClick={() => {
                    handleClearFilters();
                    toggleFilterPopup();
                  }}
                >
                  {t("eventsPage.filter.clear")}
                </button>
                <button
                  className="close-popup-button"
                  onClick={toggleFilterPopup}
                >
                  {t("eventsPage.filter.close")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="events-list-container">
          {filteredEvents.map((event) => (
            <div className="events-card" key={event._id}>
              <div className="events-card-date">
                <p className="date-day">
                  {new Date(event.dateOfEvent).toLocaleDateString("en", {
                    day: "2-digit",
                  })}
                </p>
                <p className="date-month">
                  {new Date(event.dateOfEvent).toLocaleDateString("en", {
                    month: "short",
                  })}
                </p>
                <p className="date-time">
                  {event.timeStart}-{event.timeEnd}
                </p>
              </div>
              <div className="events-card-details">
                <h3 className="event-category">{event.category}</h3>
                <h2 className="event-title">{event.name}</h2>
                <p className="event-location">{event.city}</p>
                <p className="event-price">
                  {t("eventsPage.eventCard.price")} {" "}
                  {event.tickets && event.tickets.length > 0
                    ? Math.min(...event.tickets.map((ticket) => ticket.price))
                    : t("eventsPage.eventCard.noPrice")} {" "}
                  {event.currency}
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
                  src={event.mainImage || "/assets/default-event.jpg"}
                  alt={event.name}
                  className="event-image"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Filter Box for Desktop Users */}
        <div className="events-filter-box">
          <h3>{t("eventsPage.filter.title")}</h3>
          <div className="filter-options">
            <label>{t("eventsPage.filter.category")}</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">
                {t("eventsPage.filter.selectCategory")}
              </option>
              <option value="Sports">
                {t("eventsPage.filter.categories.sports")}
              </option>
              <option value="Theatre">
                {t("eventsPage.filter.categories.theatre")}
              </option>
            </select>
            <label>{t("eventsPage.filter.date")}</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <label>{t("eventsPage.filter.price")}</label>
            <input
              type="number"
              placeholder={t("eventsPage.filter.maxPrice")}
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
              className="search-bar"
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
