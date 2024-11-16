import React, { useState, useEffect } from 'react';
import { fetchEvents, createEvent, updateEvent, deleteEvent, fetchOrganizers } from '../../../services/api';

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

    // Validate that at least one organizer is selected
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

      // Reset form after submission
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
      organizers: event.organizers, // Ensure organizers are directly mapped as IDs
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
        ? prevFormData.organizers.filter((id) => id !== organizerId) // Remove organizer if unchecked
        : [...prevFormData.organizers, organizerId]; // Add organizer if checked
      return { ...prevFormData, organizers };
    });
  };

  return (
    <div>
      <h2>{editEventId ? 'Edit Event' : 'Create Event'}</h2>
      <form onSubmit={handleEventSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
        <input
          type="date"
          name="dateOfEvent"
          value={formData.dateOfEvent}
          onChange={(e) => setFormData({ ...formData, dateOfEvent: e.target.value })}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <input
          type="number"
          name="ticketsAvailable"
          placeholder="Tickets Available"
          value={formData.ticketsAvailable}
          onChange={(e) => setFormData({ ...formData, ticketsAvailable: e.target.value })}
          required
        />
        <input
          type="date"
          name="purchaseStartDate"
          value={formData.purchaseStartDate}
          onChange={(e) => setFormData({ ...formData, purchaseStartDate: e.target.value })}
          required
        />
        <input
          type="date"
          name="purchaseEndDate"
          value={formData.purchaseEndDate}
          onChange={(e) => setFormData({ ...formData, purchaseEndDate: e.target.value })}
          required
        />
        <div>
          <label>Organizers:</label>
          {organizers.map((organizer) => (
            <div key={organizer._id}>
              <input
                type="checkbox"
                value={organizer._id}
                checked={formData.organizers.includes(organizer._id)} // Check if the organizer is already selected
                onChange={() => handleOrganizerSelection(organizer._id)} // Handle the change event
              />
              <label>
                {organizer.fullName} ({organizer.email})
              </label>
            </div>
          ))}
        </div>
        <button type="submit">{editEventId ? 'Update Event' : 'Create Event'}</button>
      </form>

      <h2>Existing Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <h3>{event.name}</h3>
            <button onClick={() => handleEditEvent(event)}>Edit</button>
            <button onClick={() => handleDeleteEvent(event._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsTab;
