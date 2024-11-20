import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: require('./locales/en/translation.json')
    },
    ar: {
      translation: require('./locales/ar/translation.json')
    }
  },
  lng: 'en', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false // React already escapes by default
  }
});

export default i18n;
