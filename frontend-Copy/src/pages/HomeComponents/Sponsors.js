import React from 'react';
import './Sponsors.css';
import sponsor1 from '../assets/sponsors/sponsor1.png'; // Replace with the actual paths
import sponsor2 from '../assets/sponsors/sponsor2.png';
import sponsor3 from '../assets/sponsors/sponsor3.png';
import sponsor4 from '../assets/sponsors/sponsor4.png';
import sponsor5 from '../assets/sponsors/sponsor5.png';

const Sponsors = ({ t }) => {
  return (
    <section id="sponsors">
      <div className="sponsors-container">
        <h2 className="sponsors-title">{t('sponsors.title')}</h2>
        <div className="sponsors-background">
          {/* Decorative background elements */}
        </div>
        <div className="sponsors-logos">
          <img src={sponsor1} alt="Sponsor 1" className="sponsor-logo" />
          <img src={sponsor2} alt="Sponsor 2" className="sponsor-logo" />
          <img src={sponsor3} alt="Sponsor 3" className="sponsor-logo" />
          <img src={sponsor4} alt="Sponsor 4" className="sponsor-logo" />
          <img src={sponsor5} alt="Sponsor 5" className="sponsor-logo" />
        </div>
      </div>   
             <div className="background-image bg-right"></div>
          
          <div className="background-image bg-left"></div>

    </section>
  );
};

export default Sponsors;
