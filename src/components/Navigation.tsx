import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RetroSoundSynth } from '../utils/RetroSoundSynth';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const handleNavClick = () => {
    RetroSoundSynth.Instance.playEffect('click');
  };

  return (
    <nav className="main-nav">
      <div className="nav-content">
        <Link 
          to="/" 
          className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          onClick={handleNavClick}
        >
          <span className="nav-icon">🏰</span>
          <span className="nav-text">Dashboard</span>
        </Link>

        <Link 
          to="/quests" 
          className={`nav-item ${location.pathname === '/quests' ? 'active' : ''}`}
          onClick={handleNavClick}
        >
          <span className="nav-icon">📜</span>
          <span className="nav-text">Quests</span>
        </Link>

        <Link 
          to="/skills" 
          className={`nav-item ${location.pathname === '/skills' ? 'active' : ''}`}
          onClick={handleNavClick}
        >
          <span className="nav-icon">⚔️</span>
          <span className="nav-text">Skills</span>
        </Link>

        <div className="nav-indicator" style={{
          left: (() => {
            switch (location.pathname) {
              case '/': return '0%';
              case '/quests': return '33.33%';
              case '/skills': return '66.66%';
              default: return '0%';
            }
          })()
        }} />
      </div>

      {/* Settings Button */}
      <button 
        className="settings-button"
        onClick={() => {
          RetroSoundSynth.Instance.playEffect('click');
          // TODO: Implement settings modal
        }}
      >
        <span className="nav-icon">⚙️</span>
      </button>
    </nav>
  );
}; 