import { useState } from 'react';

function ViewToggle({ onViewChange }) {
  const [currentView, setCurrentView] = useState('auto');

  const handleViewChange = (view) => {
    setCurrentView(view);
    onViewChange(view);
  };

  return (
    <div className="view-toggle">
      <div className="toggle-buttons">
        <button
          className={`toggle-btn ${currentView === 'auto' ? 'active' : ''}`}
          onClick={() => handleViewChange('auto')}
        >
          <span className="icon">📱💻</span>
          Auto
        </button>
        <button
          className={`toggle-btn ${currentView === 'mobile' ? 'active' : ''}`}
          onClick={() => handleViewChange('mobile')}
        >
          <span className="icon">📱</span>
          Mobile
        </button>
        <button
          className={`toggle-btn ${currentView === 'desktop' ? 'active' : ''}`}
          onClick={() => handleViewChange('desktop')}
        >
          <span className="icon">💻</span>
          Desktop
        </button>
      </div>
    </div>
  );
}

export default ViewToggle; 