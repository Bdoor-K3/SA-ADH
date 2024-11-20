import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Tathaker</h3>
          <ul>
            <li>📍 8273 Riyadh, Saudi Arabia</li>
            <li>📧 info@tathaker.net</li>
            <li>📞 +59 123456789121</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Direct Links</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Social Media</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>©2019 <a href="https://tathaker.net">Tathaker.com</a>. All rights reserved</p>
        <p>Powered by <span role="img" aria-label="heart">❤️</span> Your Vision</p>
      </div>
    </footer>
  );
}

export default Footer;
