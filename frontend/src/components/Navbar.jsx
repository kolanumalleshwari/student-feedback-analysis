import React from 'react';
import { Menu, Sparkles } from 'lucide-react';

export default function Navbar({ toggleSidebar, pageTitle }) {
  return (
    <header className="navbar">
      <div className="navbar-title-section">
        <button 
          className="mobile-menu-btn" 
          onClick={toggleSidebar}
          aria-label="Toggle Navigation"
        >
          <Menu size={22} />
        </button>
        <span className="navbar-title">{pageTitle || 'Student Feedback Analysis System'}</span>
      </div>

      <div className="navbar-badge">
        <Sparkles size={14} />
        <span>Rule-Based Sentiment AI Engine</span>
      </div>
    </header>
  );
}
