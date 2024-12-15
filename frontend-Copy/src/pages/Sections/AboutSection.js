import React from 'react';
import { useTranslation } from 'react-i18next';
import AboutSaada from './HomeComponents/AboutSaada';
import Sponsors from './HomeComponents/Sponsors';

/**
 * AboutSection Component
 * Combines the About Saada and Sponsors sections into a unified layout.
 */
function AboutSection() {
  const { t, i18n } = useTranslation(); // Translation hook for multi-language support

  return (
    <section className={`about-section ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* About Saada Section */}
      <AboutSaada t={t} />

      {/* Sponsors Section */}
      <Sponsors t={t} />
    </section>
  );
}

export default AboutSection;
