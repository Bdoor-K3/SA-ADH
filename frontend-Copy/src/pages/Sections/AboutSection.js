import React from 'react';
import { useTranslation } from 'react-i18next';
import AboutSaada from '../HomeComponents/AboutSaada';
import Sponsors from '../HomeComponents/Sponsors';

function AboutSection() {
  const { t, i18n } = useTranslation(); // For language direction handling

  return (
    <section className={`about-section ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
        {/* About Saada Component */}
        <AboutSaada t={t} />
        {/* Sponsors Component */}
        <Sponsors t={t} />
    </section>
  );
}

export default AboutSection;
