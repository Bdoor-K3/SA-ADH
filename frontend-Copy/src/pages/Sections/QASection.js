import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './QASection.css';

/**
 * QASection Component
 * Displays a list of FAQs with expandable answers.
 */
function QASection() {
  const { t, i18n } = useTranslation(); // Translation hook with support for language direction
  const [activeIndex, setActiveIndex] = useState(null); // Tracks the currently active FAQ

  // FAQ data
  const faqs = [
    {
      question: t('qaSection.faqs.howToBuyTicket.question'),
      answer: t('qaSection.faqs.howToBuyTicket.answer'),
    },
    {
      question: t('qaSection.faqs.howToCreateEvent.question'),
      answer: t('qaSection.faqs.howToCreateEvent.answer'),
    },
    {
      question: t('qaSection.faqs.howToSetNameAndDate.question'),
      answer: t('qaSection.faqs.howToSetNameAndDate.answer'),
    },
    {
      question: t('qaSection.faqs.howToSetPrice.question'),
      answer: t('qaSection.faqs.howToSetPrice.answer'),
    },
  ];

  /**
   * Toggles the active FAQ item.
   * @param {number} index - The index of the clicked FAQ item.
   */
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Collapse if the same item is clicked
  };

  return (
    <section className={`qa-section ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="container">
        {/* Section title and subtitle */}
        <h2 className="qa-title">{t('qaSection.title')}</h2>
        <h3 className="qa-subtitle">{t('qaSection.subtitle')}</h3>

        {/* FAQ list */}
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              {/* Question */}
              <div
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span className="faq-toggle-icon">
                  {activeIndex === index ? '▲' : '▼'}
                </span>
              </div>

              {/* Answer */}
              {activeIndex === index && (
                <div className="faq-answer">
                  <strong>{t('qaSection.answerLabel')}</strong>
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
