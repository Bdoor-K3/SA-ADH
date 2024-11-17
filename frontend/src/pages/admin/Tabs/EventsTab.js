import React, { useState, useEffect } from 'react';
import { fetchEvents, createEvent, updateEvent, deleteEvent, fetchOrganizers } from '../../../services/api';
import './EventsTab.css';

function EventsTab() {
  const [events, setEvents] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dateOfEvent: '',
    price: '',
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
        console.error('Error fetching events:', error);
      }
    };

    const loadOrganizers = async () => {
      try {
        const data = await fetchOrganizers();
        setOrganizers(data);
      } catch (error) {
        console.error('Error fetching organizers:', error);
      }
    };

    loadEvents();
    loadOrganizers();
  }, []);

  const handleEventSubmit = async (e) => {
    e.preventDefault();

    if (formData.organizers.length === 0) {
      alert('Please select at least one organizer for the event.');
      return;
    }

    try {
      if (editEventId) {
        await updateEvent(editEventId, formData);
        alert('Event updated successfully!');
      } else {
        await createEvent(formData);
        alert('Event created successfully!');
      }

      setFormData({
        name: '',
        description: '',
        dateOfEvent: '',
        price: '',
        ticketsAvailable: '',
        purchaseStartDate: '',
        purchaseEndDate: '',
        organizers: [],
      });

      setEditEventId(null);
      const updatedEvents = await fetchEvents();
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error creating/updating event:', error);
    }
  };

  const handleEditEvent = (event) => {
    setEditEventId(event._id);
    setFormData({
      name: event.name,
      description: event.description,
      dateOfEvent: event.dateOfEvent.slice(0, 10),
      price: event.price,
      ticketsAvailable: event.ticketsAvailable,
      purchaseStartDate: event.purchaseStartDate.slice(0, 10),
      purchaseEndDate: event.purchaseEndDate.slice(0, 10),
      organizers: event.organizers,
    });
  };

  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id);
      alert('Event deleted successfully!');
      setEvents(events.filter((event) => event._id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
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
      <h2 className="tab-title">{editEventId ? 'Edit Event' : 'Create Event'}</h2>
      <form className="event-form" onSubmit={handleEventSubmit}>
        <input
          type="text"
          placeholder="Event Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
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
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Tickets Available"
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
          <label>Organizers:</label>
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
          {editEventId ? 'Update Event' : 'Create Event'}
        </button>
      </form>

      <h2 className="tab-title">Existing Events</h2>
      <ul className="events-list">
        {events.map((event) => (
          <li key={event._id} className="event-item">
            <h3>{event.name}</h3>
            <button onClick={() => handleEditEvent(event)} className="edit-button">
              Edit
            </button>
            <button onClick={() => handleDeleteEvent(event._id)} className="delete-button">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsTab;
