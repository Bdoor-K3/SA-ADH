import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchEvents, createEvent, updateEvent, deleteEvent, fetchOrganizers } from '../../../services/api';
import './EventsTab.css';

function EventsTab() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dateOfEvent: '',
    price: '',
    currency: 'SAR', // Default currency
    ticketsAvailable: '',
    purchaseStartDate: '',
    purchaseEndDate: '',
    organizers: [],
  });
  const [editEventId, setEditEventId] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        console.error(t('eventsTab.alerts.fetchError'), error);
      }
    };

    const loadOrganizers = async () => {
      try {
        const data = await fetchOrganizers();
        setOrganizers(data);
      } catch (error) {
        console.error(t('eventsTab.alerts.fetchOrganizersError'), error);
      }
    };

    loadEvents();
    loadOrganizers();
  }, [t]);

  const handleEventSubmit = async (e) => {
    e.preventDefault();

    if (formData.organizers.length === 0) {
      alert(t('eventsTab.alerts.selectOrganizer'));
      return;
    }

    try {
      if (editEventId) {
        await updateEvent(editEventId, formData);
        alert(t('eventsTab.alerts.updated'));
      } else {
        await createEvent(formData);
        alert(t('eventsTab.alerts.created'));
      }

      setFormData({
        name: '',
        description: '',
        dateOfEvent: '',
        price: '',
        currency: 'SAR',
        ticketsAvailable: '',
        purchaseStartDate: '',
        purchaseEndDate: '',
        organizers: [],
      });

      setEditEventId(null);
      const updatedEvents = await fetchEvents();
      setEvents(updatedEvents);
    } catch (error) {
      console.error(t('eventsTab.alerts.submitError'), error);
    }
  };

  const handleEditEvent = (event) => {
    setEditEventId(event._id);
    setFormData({
      name: event.name,
      description: event.description,
      dateOfEvent: event.dateOfEvent.slice(0, 10),
      price: event.price,
      currency: event.currency,
      ticketsAvailable: event.ticketsAvailable,
      purchaseStartDate: event.purchaseStartDate.slice(0, 10),
      purchaseEndDate: event.purchaseEndDate.slice(0, 10),
      organizers: event.organizers,
    });
  };

  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id);
      alert(t('eventsTab.alerts.deleted'));
      setEvents(events.filter((event) => event._id !== id));
    } catch (error) {
      console.error(t('eventsTab.alerts.deleteError'), error);
    }
  };

  const handleOrganizerSelection = (organizerId) => {
    setFormData((prevFormData) => {
      const organizers = prevFormData.organizers.includes(organizerId)
        ? prevFormData.organizers.filter((id) => id !== organizerId)
        : [...prevFormData.organizers, organizerId];
      return { ...prevFormData, organizers };
    });
  };

  return (
    <div className="events-tab">
      <h2 className="tab-title">{t(editEventId ? 'eventsTab.title.edit' : 'eventsTab.title.create')}</h2>
      <form className="event-form" onSubmit={handleEventSubmit}>
        <input
          type="text"
          placeholder={t('eventsTab.form.eventName')}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <textarea
          placeholder={t('eventsTab.form.description')}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
        <input
          type="date"
          value={formData.dateOfEvent}
          onChange={(e) => setFormData({ ...formData, dateOfEvent: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder={t('eventsTab.form.price')}
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <select
          value={formData.currency}
          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
          required
        >
          <option value="SAR">SAR</option>
          <option value="AED">AED</option>
          <option value="KWD">KWD</option>
          <option value="BHD">BHD</option>
          <option value="OMR">OMR</option>
          <option value="QAR">QAR</option>
        </select>
        <input
          type="number"
          placeholder={t('eventsTab.form.ticketsAvailable')}
          value={formData.ticketsAvailable}
          onChange={(e) => setFormData({ ...formData, ticketsAvailable: e.target.value })}
          required
        />
        <input
          type="date"
          value={formData.purchaseStartDate}
          onChange={(e) => setFormData({ ...formData, purchaseStartDate: e.target.value })}
          required
        />
        <input
          type="date"
          value={formData.purchaseEndDate}
          onChange={(e) => setFormData({ ...formData, purchaseEndDate: e.target.value })}
          required
        />
        <div className="organizers-container">
          <label>{t('eventsTab.form.organizers')}</label>
          {organizers.map((organizer) => (
            <div key={organizer._id} className="organizer-item">
              <input
                type="checkbox"
                value={organizer._id}
                checked={formData.organizers.includes(organizer._id)}
                onChange={() => handleOrganizerSelection(organizer._id)}
              />
              <span>
                {organizer.fullName} ({organizer.email})
              </span>
            </div>
          ))}
        </div>
        <button type="submit" className="submit-button">
          {t(editEventId ? 'eventsTab.form.submit.update' : 'eventsTab.form.submit.create')}
        </button>
      </form>

      <h2 className="tab-title">{t('eventsTab.title.existing')}</h2>
      <ul className="events-list">
        {events.map((event) => (
          <li key={event._id} className="event-item">
            <h3>{event.name}</h3>
            <p>{t('eventsTab.event.currency')}: {event.currency}</p>
            <button onClick={() => handleEditEvent(event)} className="edit-button">
              {t('eventsTab.actions.edit')}
            </button>
            <button onClick={() => handleDeleteEvent(event._id)} className="delete-button">
              {t('eventsTab.actions.delete')}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsTab;
