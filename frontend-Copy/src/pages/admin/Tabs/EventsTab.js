import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchEvents, createEvent, updateEvent, deleteEvent, fetchOrganizers } from '../../../services/api';
import './EventsTab.css';

function EventsTab() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]); // Ensure events is initialized as an array
  const [organizers, setOrganizers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dateOfEvent: '',
    timeStart: '', // New field for start time
    timeEnd: '',   // New field for end time    price: '',
    currency: 'SAR',
    ticketsAvailable: '',
    purchaseStartDate: '',
    purchaseEndDate: '',
    organizers: [],
    category: '',
    location: '',
    city: '',
    image: null,
  });
  const [editEventId, setEditEventId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error('Expected array but got:', data);
          setEvents([]); // Fallback to an empty array
        }
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

    const eventData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'organizers') {
        formData.organizers.forEach((organizer, index) => {
          eventData.append(`organizers[${index}]`, organizer);
        });
      } else {
        eventData.append(key, formData[key]);
      }
    });

    setLoading(true);
    try {
      const response = await (editEventId
        ? updateEvent(editEventId, eventData)
        : createEvent(eventData));

      if (Array.isArray(response)) {
        setEvents(response);
      } else {
        console.error('Expected array but got:', response);
      }
      alert(editEventId ? t('eventsTab.alerts.updated') : t('eventsTab.alerts.created'));
      resetForm();
    } catch (error) {
      console.error(t('eventsTab.alerts.submitError'), error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      dateOfEvent: '',
      timeStart: '', // Reset start time
      timeEnd: '',   // Reset end time      price: '',
      currency: 'SAR',
      ticketsAvailable: '',
      purchaseStartDate: '',
      purchaseEndDate: '',
      organizers: [],
      category: '',
      location: '',
      city: '',
      image: null,
    });
    setEditEventId(null);
  };

  const handleEditEvent = (event) => {
    setEditEventId(event._id);
    setFormData({
      name: event.name,
      description: event.description,
      dateOfEvent: event.dateOfEvent.slice(0, 10),
      timeStart: event.timeStart || '', // Set start time if it exists
      timeEnd: event.timeEnd || '',     // Set end time if it exists    
        price: event.price,
      currency: event.currency,
      ticketsAvailable: event.ticketsAvailable,
      purchaseStartDate: event.purchaseStartDate.slice(0, 10),
      purchaseEndDate: event.purchaseEndDate.slice(0, 10),
      organizers: event.organizers,
      category: event.category,
      location: event.location,
      city: event.city,
      image: null,
    });
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm(t('eventsTab.alerts.confirmDelete'))) return;
    setLoading(true);
    try {
      await deleteEvent(id);
      alert(t('eventsTab.alerts.deleted'));
      setEvents(events.filter((event) => event._id !== id));
    } catch (error) {
      console.error(t('eventsTab.alerts.deleteError'), error);
    } finally {
      setLoading(false);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
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
          type="text"
          placeholder={t('eventsTab.form.category')}
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
        <input
          type="text"
          placeholder={t('eventsTab.form.location')}
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
        <input
          type="text"
          placeholder={t('eventsTab.form.city')}
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />
        {/* New fields for time */}
        <input
          type="time"
          value={formData.timeStart}
          onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })}
          required
        />
        <input
          type="time"
          value={formData.timeEnd}
          onChange={(e) => setFormData({ ...formData, timeEnd: e.target.value })}
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
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {formData.image && (
          <div className="image-preview">
            <p>{formData.image.name}</p>
          </div>
        )}
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
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? t('eventsTab.alerts.loading') : t(editEventId ? 'eventsTab.form.submit.update' : 'eventsTab.form.submit.create')}
        </button>
      </form>

      <h2 className="tab-title">{t('eventsTab.title.existing')}</h2>
      {Array.isArray(events) ? (
        <ul className="events-list">
          {events.map((event) => (
            <li key={event._id} className="event-item">
              <img
                src={event.image || '/default-image.jpg'}
                alt={event.name}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <h3>{event.name}</h3>
              <p>{t('eventsTab.event.category')}: {event.category}</p>
              <p>{t('eventsTab.event.location')}: {event.location}</p>
              <p>{t('eventsTab.event.city')}: {event.city}</p>
              <button onClick={() => handleEditEvent(event)} className="edit-button">
                {t('eventsTab.actions.edit')}
              </button>
              <button onClick={() => handleDeleteEvent(event._id)} className="delete-button">
                {t('eventsTab.actions.delete')}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>{t('eventsTab.alerts.noEvents')}</p>
      )}
    </div>
  );
}

export default EventsTab;
