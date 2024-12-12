import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n'; // Import i18n configuration
import '@fortawesome/fontawesome-free/css/all.min.css';

import { useTranslation } from 'react-i18next';

// Wrapper to handle global direction change
function AppWithDirection() {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'; // Set the direction based on language
  }, [i18n.language]);

  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWithDirection />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
