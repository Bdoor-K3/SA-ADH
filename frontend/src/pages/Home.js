import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents } from '../services/api';
import './Home.css';

function Home() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    getEvents();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/event/${id}`);
  };

  return (
    <div className="home">
      {/* Events Section */}
      <section id="events">
        <h2>Upcoming Events</h2>
        <div className="event-cards">
          {events.map((event) => (
            <div
              className="event-card"
              key={event._id}
              onClick={() => handleViewDetails(event._id)}
            >
              <div className="card-header">
                <h3>{event.name}</h3>
              </div>
              <div className="card-body">
                <p>{event.description}</p>
                <p>Date: {new Date(event.dateOfEvent).toLocaleDateString()}</p>
                <p>Price: ${event.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about">
        <h2>About Us</h2>
        <p>
          Welcome to Event Ticketing! We provide a platform for seamless ticketing
          solutions for events of all sizes. Whether you're an organizer or a
          customer, we've got you covered.
        </p>
      </section>

      {/* Contact Us Section */}
      <section id="contact">
        <h2>Contact Us</h2>
        <p>Email: support@eventticketing.com</p>
        <p>Phone: +1 234 567 890</p>
        <p>Address: 123 Event Street, Ticket City, TX</p>
      </section>

      {/* Q&A Section */}
      <section id="qa">
        <h2>Q&A</h2>
        <p>Have questions? Visit our FAQ page or contact us for more information.</p>
      </section>
    </div>
  );
}

export default Home;
