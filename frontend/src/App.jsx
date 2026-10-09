import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import HomeDashboard from './pages/HomeDashboard';
import SubmitFeedback from './pages/SubmitFeedback';
import ViewFeedback from './pages/ViewFeedback';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case '/': return 'Home Dashboard';
      case '/submit': return 'Submit Student Feedback';
      case '/view': return 'View All Feedbacks';
      case '/analytics': return 'Analytics & Insights';
      case '/reports': return 'Reports & CSV Export';
      default: return 'Student Feedback Analysis System';
    }
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="main-wrapper">
        <Navbar 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          pageTitle={getPageTitle(location.pathname)} 
        />

        <main className="content-area">
          <Routes>
            <Route path="/" element={<HomeDashboard />} />
            <Route path="/submit" element={<SubmitFeedback />} />
            <Route path="/view" element={<ViewFeedback />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<HomeDashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
