import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchEventsAdmin, createEvent, updateEvent, deleteEvent, fetchOrganizers } from '../../../services/api';
import './EventsTab.css';

function EventsTab() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dateOfEvent: '',
    timeStart: '',
    timeEnd: '',
    price: '',
    currency: 'SAR',
    ticketsAvailable: '',
    purchaseStartDate: '',
    purchaseEndDate: '',
    organizers: [],
    category: '',
    location: '',
    city: '',
    bannerImage: null,
    mainImage: null,
    eventListImage: null,
    isAlphantom: false,
    hide: false, // Add this field to formData

  });
  const [editEventId, setEditEventId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEventsAdmin();
        setEvents(data || []);
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

      setEvents(response);
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
      timeStart: '',
      timeEnd: '',
      price: '',
      currency: 'SAR',
      ticketsAvailable: '',
      purchaseStartDate: '',
      purchaseEndDate: '',
      organizers: [],
      category: '',
      location: '',
      city: '',
      bannerImage: null,
      mainImage: null,
      eventListImage: null,
      isAlphantom: false,
    });
    setEditEventId(null);
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [field]: file });
  };

  const handleEditEvent = (event) => {
    setEditEventId(event._id);
    setFormData({
      name: event.name,
      description: event.description,
      dateOfEvent: event.dateOfEvent.slice(0, 10),
      timeStart: event.timeStart || '',
      timeEnd: event.timeEnd || '',
      price: event.price,
      currency: event.currency,
      ticketsAvailable: event.ticketsAvailable,
      purchaseStartDate: event.purchaseStartDate.slice(0, 10),
      purchaseEndDate: event.purchaseEndDate.slice(0, 10),
      organizers: event.organizers,
      category: event.category,
      location: event.location,
      city: event.city,
      bannerImage: null,
      mainImage: null,
      eventListImage: null,
      isAlphantom: event.isAlphantom || false,
      hide: event.hide || false, // Add this to handle the hide field

    });
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm(t('eventsTab.alerts.confirmDelete'))) return;
    setLoading(true);
    try {
      await deleteEvent(id);
      setEvents(events.filter((event) => event._id !== id));
      alert(t('eventsTab.alerts.deleted'));
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

  return (
    <div className="events-tab">
      <h2 className="tab-title">{t(editEventId ? 'eventsTab.title.edit' : 'eventsTab.title.create')}</h2>
      <form className="event-form" onSubmit={handleEventSubmit}>
        <label>{t('eventsTab.form.eventName')}</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <label>{t('eventsTab.form.description')}</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />

        <label>{t('eventsTab.form.category')}</label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />

        <label>{t('eventsTab.form.location')}</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />

        <label>{t('eventsTab.form.city')}</label>
        <input
          type="text"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />

        <label>{t('eventsTab.form.timeStart')}</label>
        <input
          type="time"
          value={formData.timeStart}
          onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })}
          required
        />

        <label>{t('eventsTab.form.timeEnd')}</label>
        <input
          type="time"
          value={formData.timeEnd}
          onChange={(e) => setFormData({ ...formData, timeEnd: e.target.value })}
          required
        />

        <label>{t('eventsTab.form.dateOfEvent')}</label>
        <input
          type="date"
          value={formData.dateOfEvent}
          onChange={(e) => setFormData({ ...formData, dateOfEvent: e.target.value })}
          required
        />

        <label>{t('eventsTab.form.price')}</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />

        <label>{t('eventsTab.form.currency')}</label>
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

        <label>{t('eventsTab.form.ticketsAvailable')}</label>
        <input
          type="number"
          value={formData.ticketsAvailable}
          onChange={(e) => setFormData({ ...formData, ticketsAvailable: e.target.value })}
          required
        />

        <label>{t('eventsTab.form.purchaseStartDate')}</label>
        <input
          type="date"
          value={formData.purchaseStartDate}
          onChange={(e) => setFormData({ ...formData, purchaseStartDate: e.target.value })}
          required
        />

        <label>{t('eventsTab.form.purchaseEndDate')}</label>
        <input
          type="date"
          value={formData.purchaseEndDate}
          onChange={(e) => setFormData({ ...formData, purchaseEndDate: e.target.value })}
          required
        />

        <label>{t('eventsTab.form.bannerImage')}</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'bannerImage')} />
        {formData.bannerImage && <p>{formData.bannerImage.name}</p>}

        <label>{t('eventsTab.form.mainImage')}</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'mainImage')} />
        {formData.mainImage && <p>{formData.mainImage.name}</p>}

        <label>{t('eventsTab.form.eventListImage')}</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'eventListImage')} />
        {formData.eventListImage && <p>{formData.eventListImage.name}</p>}

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

        <label>
          <input
            type="checkbox"
            checked={formData.isAlphantom}
            onChange={(e) => setFormData({ ...formData, isAlphantom: e.target.checked })}
          />
          {t('eventsTab.form.isAlphantom')}
        </label>
        <label>
  <input
    type="checkbox"
    checked={formData.hide}
    onChange={(e) => setFormData({ ...formData, hide: e.target.checked })}
  />
  {t('eventsTab.form.hide')} {/* Add translation key for the label */}
</label>


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
