import React from 'react';
import './Sponsors.css';
import sponsor1 from '../assets/sponsors/sponsor1.png';
import sponsor2 from '../assets/sponsors/sponsor2.jpg';
import sponsor3 from '../assets/sponsors/sponsor3.jpg';
import sponsor4 from '../assets/sponsors/sponsor4.jpg';
import sponsor5 from '../assets/sponsors/sponsor5.jpg';
import sponsor6 from '../assets/sponsors/sponsor6.jpg';
import sponsor7 from '../assets/sponsors/sponsor7.jpg';
import sponsor8 from '../assets/sponsors/sponsor8.jpg';
import sponsor9 from '../assets/sponsors/sponsor9.jpg';
import sponsor10 from '../assets/sponsors/sponsor10.jpg';
import sponsor11 from '../assets/sponsors/sponsor11.jpg';
import sponsor12 from '../assets/sponsors/sponsor12.png';

const Sponsors = ({ t }) => {
  const sponsors = [
    sponsor1,
    sponsor2,
    sponsor3,
    sponsor4,
    sponsor5,
    sponsor6,
    sponsor7,
    sponsor8,
    sponsor9,
    sponsor10,
    sponsor11,
    sponsor12,
  ];

  return (
    <section id="sponsors">
      <h2 className="sponsors-title">{t('sponsors.title')}</h2>
      <div className="sponsors-slider">
        <div className="sponsors-track">
          {sponsors.map((sponsor, index) => (
            <div key={index} className="sponsor-card">
              <img
                src={sponsor}
                alt={`Sponsor ${index + 1}`}
                className="sponsor-logo"
              />
            </div>
          ))}
          {/* Duplicate the logos for infinite loop */}
          {sponsors.map((sponsor, index) => (
            <div key={index + sponsors.length} className="sponsor-card">
              <img
                src={sponsor}
                alt={`Sponsor ${index + 1}`}
                className="sponsor-logo"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
