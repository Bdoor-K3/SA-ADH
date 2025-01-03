import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchEventsAdmin, createEvent, updateEvent, deleteEvent, fetchOrganizers } from '../../../services/api';
import './EventsTab.css';

function EventsTab() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]); // Stores events data
  const [organizers, setOrganizers] = useState([]); // Stores organizers data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dateOfEvent: '',
    timeStart: '',
    timeEnd: '',
    tickets: [],
    currency: 'SAR',
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
    hide: false,
  });
  const [editEventId, setEditEventId] = useState(null); // Holds ID for editing events
  const [loading, setLoading] = useState(false); // Indicates if a request is loading

  // Fetch events and organizers data on component mount
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

  // Handles form submission for creating or updating an event
  const handleEventSubmit = async (e) => {
    e.preventDefault();

    if (formData.organizers.length === 0) {
      alert(t('eventsTab.alerts.selectOrganizer'));
      return;
    }

    const eventData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'tickets') {
        eventData.append(key, JSON.stringify(formData[key]));
      } else if (key === 'organizers') {
        formData.organizers.forEach((organizer, index) => {
          eventData.append(`organizers[${index}]`, organizer);
        });
      } else if (['bannerImage', 'mainImage', 'eventListImage'].includes(key) && formData[key]) {
        eventData.append(key, formData[key]);
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

  // Resets the form to its initial state
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      dateOfEvent: '',
      timeStart: '',
      timeEnd: '',
      tickets: [],
      currency: 'SAR',
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
      hide: false,
    });
    setEditEventId(null);
  };

  // Handles file input changes
  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [field]: file });
  };

  // Populates the form with an existing event's data for editing
  const handleEditEvent = (event) => {
    setEditEventId(event._id);
    setFormData({
      name: event.name,
      description: event.description,
      dateOfEvent: event.dateOfEvent.slice(0, 10),
      timeStart: event.timeStart || '',
      timeEnd: event.timeEnd || '',
      tickets: event.tickets || [],
      currency: event.currency,
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
      hide: event.hide || false,
    });
  };

  // Deletes an event after confirmation
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

  // Toggles selection of an organizer
  const handleOrganizerSelection = (organizerId) => {
    setFormData((prevFormData) => {
      const organizers = prevFormData.organizers.includes(organizerId)
        ? prevFormData.organizers.filter((id) => id !== organizerId)
        : [...prevFormData.organizers, organizerId];
      return { ...prevFormData, organizers };
    });
  };

  // Updates tickets array based on user input
  const handleTicketsChange = (index, field, value) => {
    setFormData((prevFormData) => {
      const updatedTickets = [...prevFormData.tickets];
      updatedTickets[index] = { ...updatedTickets[index], [field]: value };
      return { ...prevFormData, tickets: updatedTickets };
    });
  };

  // Adds a new ticket to the tickets array
  const addTicket = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      tickets: [...prevFormData.tickets, { name: '', price: 0, quantity: 0 }],
    }));
  };

  // Removes a ticket from the tickets array
  const removeTicket = (index) => {
    setFormData((prevFormData) => {
      const updatedTickets = [...prevFormData.tickets];
      updatedTickets.splice(index, 1);
      return { ...prevFormData, tickets: updatedTickets };
    });
  };

  return (
    <div className="events-tab">
      <h2 className="tab-title">{t(editEventId ? 'eventsTab.title.edit' : 'eventsTab.title.create')}</h2>
      <form className="event-form" onSubmit={handleEventSubmit}>
        {/* Form inputs for event details */}
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

        {/* Tickets management */}
        <label>{t('eventsTab.form.tickets')}</label>
        {formData.tickets.map((ticket, index) => (
          <div key={index} className="ticket-item">
            <input
              type="text"
              placeholder="Name"
              value={ticket.name}
              onChange={(e) => handleTicketsChange(index, 'name', e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={ticket.price}
              onChange={(e) => handleTicketsChange(index, 'price', parseFloat(e.target.value))}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={ticket.quantity}
              onChange={(e) => handleTicketsChange(index, 'quantity', parseInt(e.target.value, 10))}
            />
            <button type="button" onClick={() => removeTicket(index)}>
              {t('eventsTab.actions.removeTicket')}
            </button>
          </div>
        ))}
        <button type="button" onClick={addTicket}>
          {t('eventsTab.actions.addTicket')}
        </button>

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

        {/* File upload inputs */}
        <label>{t('eventsTab.form.bannerImage')}</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'bannerImage')} />
        {formData.bannerImage && <p>{formData.bannerImage.name}</p>}

        <label>{t('eventsTab.form.mainImage')}</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'mainImage')} />
        {formData.mainImage && <p>{formData.mainImage.name}</p>}

        <label>{t('eventsTab.form.eventListImage')}</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'eventListImage')} />
        {formData.eventListImage && <p>{formData.eventListImage.name}</p>}

        {/* Organizers selection */}
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

        {/* Additional options */}
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
          {t('eventsTab.form.hide')}
        </label>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? t('eventsTab.alerts.loading') : t(editEventId ? 'eventsTab.form.submit.update' : 'eventsTab.form.submit.create')}
        </button>
      </form>

      {/* Display existing events */}
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
