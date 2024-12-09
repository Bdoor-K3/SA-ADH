import React from 'react';
import './SplashScreen.css';
import logo from './pages/assets/saada.png'; // Path to your logo image

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <img src={logo} alt="Saada Logo" className="splash-logo" />
    </div>
  );
};

export default SplashScreen;
