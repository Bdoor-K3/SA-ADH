import React from 'react';
import './AboutSection.css';

function AboutSection() {
  return (
    <section className="about-section">
      <div className="container">
        <h2 className="about-title">About Us</h2>
        <nav className="breadcrumb">
          <span>Home</span> &gt; <span>About Us</span>
        </nav>

        <div className="tabs">
          <button className="tab active">Who are we?</button>
          <button className="tab">Why choose us?</button>
          <button className="tab">Our vision</button>
        </div>

        <div className="tab-content">
          <div className="content-left">
            <h3>Who are we?</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div className="content-right">
            <img
              src="https://via.placeholder.com/300"
              alt="About Us"
              className="about-image"
            />
          </div>
        </div>

        <div className="stats">
          <h3>Awesome Facts</h3>
          <p>
            This section includes some awesome statistics and little information
            about our platform and its real data.
          </p>
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-number">401</span>
              <span className="stat-label">Events</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">9999</span>
              <span className="stat-label">Tickets Sold</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">6</span>
              <span className="stat-label">Category Count</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">Party Operators</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
