import { useEffect, useState } from 'react';
import './AppLoader.css';

const LOADING_MESSAGES = [
  "Building Your Future.",
  "Loading courses...",
  "Syncing opportunities...",
  "Connecting to AgenticX services..."
];

interface AppLoaderProps {
  isFadeOut: boolean;
}

export default function AppLoader({ isFadeOut }: AppLoaderProps) {
  const [messageIdx, setMessageIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMessageIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
        setVisible(true);
      }, 400); // Wait for fade out to complete before changing text
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`app-loader-overlay ${isFadeOut ? 'fade-out' : ''}`}
      role="progressbar"
      aria-busy={!isFadeOut}
      aria-live="polite"
      aria-label="Loading AgenticX Knowledge Solutions..."
    >
      <div className="app-loader-content">
        {/* Animated centerpiece: Premium AI Liquid Orb & Rings */}
        <div className="ai-orb-container">
          <div className="ai-orb-glow" />
          <div className="ai-orb-ring ring-outer" />
          <div className="ai-orb-ring ring-inner" />
          <div className="ai-orb-blob" />
        </div>

        {/* Branding Title */}
        <div className="loader-brand">
          <h2 className="loader-logo-text">AgenticX</h2>
          <span className="loader-subtitle">Knowledge Solutions</span>
        </div>

        {/* Dynamic Rotating Message */}
        <div className="loader-message-container">
          <p className={`loading-message ${visible ? 'visible' : ''}`}>
            {LOADING_MESSAGES[messageIdx]}
          </p>
        </div>
      </div>
    </div>
  );
}
