import React from 'react';
import './Categories.css';

// Import category images
import musicImage from '../../assets/categories/Music.png';
import sportsImage from '../../assets/categories/sports.png';
import theaterImage from '../../assets/categories/Theater.png';
import adventureImage from '../../assets/categories/Adventure.png';

/**
 * Categories Component
 * Displays a list of event categories as clickable cards.
 * @param {Function} handleCategoryClick - Function to handle category selection.
 * @param {Function} t - Translation function for multi-language support.
 */
const Categories = ({ handleCategoryClick, t }) => {
  const categories = [
    { name: 'Music', image: musicImage },
    { name: 'Sports', image: sportsImage },
    { name: 'Theater', image: theaterImage },
    { name: 'Adventure', image: adventureImage },
  ];

  /**
   * Handles category click and ensures valid data is passed.
   * @param {string} categoryName - The name of the selected category.
   */
  const onCategoryClick = (categoryName) => {
    if (typeof handleCategoryClick === 'function') {
      handleCategoryClick(categoryName);
    } else {
      console.error('handleCategoryClick is not a valid function');
    }
  };

  return (
    <section id="categories">
      {/* Section Title */}
      <h2 className="categories-title">{t('home.exploreCategories')}</h2>

      {/* Category Cards */}
      <div className="category-cards">
        {categories.map((category) => (
          <div
            key={category.name}
            className="category-card"
            onClick={() => onCategoryClick(category.name)}
            role="button"
            tabIndex="0"
            onKeyPress={(e) => {
              if (e.key === 'Enter') onCategoryClick(category.name);
            }}
          >
            <div className="category-image-container">
              <img
                src={category.image}
                alt={t(`home.categories.${category.name}`)}
                className="category-image"
              />
            </div>
            <h3 className="category-name">
              {t(`home.categories.${category.name}`)}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
