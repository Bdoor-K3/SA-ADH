import React, { useState } from 'react';
import './QASection.css';

function QASection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'How to Buy a Ticket?',
      answer:
        'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
    },
    {
      question: 'How to make a new event?',
      answer:
        'To make a new event, go to your dashboard, click on "Create Event," and fill out the required details.',
    },
    {
      question: 'How to set the event name & date?',
      answer:
        'Event names and dates can be set while creating or editing an event from the organizer’s dashboard.',
    },
    {
      question: 'Set price for ticket?',
      answer:
        'Ticket prices can be added during the event creation process or updated later from the event management tab.',
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="qa-section">
      <div className="container">
        <h2 className="qa-title">Find Your Answers</h2>
        <h3 className="qa-subtitle">Tathaker FAQs</h3>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                {faq.question}
                <span className="faq-toggle-icon">
                  {activeIndex === index ? '▲' : '▼'}
                </span>
              </div>
              {activeIndex === index && (
                <div className="faq-answer">
                  <strong>Answer</strong>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default QASection;
