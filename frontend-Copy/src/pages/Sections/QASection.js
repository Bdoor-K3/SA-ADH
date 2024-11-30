import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './QASection.css';

function QASection() {
  const { t, i18n } = useTranslation(); // Added i18n for direction handling
  const [activeIndex, setActiveIndex] = useState(null);

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

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={`qa-section ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="container">
        <h2 className="qa-title">{t('qaSection.title')}</h2>
        <h3 className="qa-subtitle">{t('qaSection.subtitle')}</h3>

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
