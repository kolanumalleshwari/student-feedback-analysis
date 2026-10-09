import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquarePlus, 
  Table, 
  BarChart3, 
  FileSpreadsheet,
  GraduationCap 
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const navItems = [
    { label: 'Home Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Submit Feedback', path: '/submit', icon: MessageSquarePlus },
    { label: 'View Feedback', path: '/view', icon: Table },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Reports', path: '/reports', icon: FileSpreadsheet }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="mobile-backdrop"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 45
          }}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="sidebar-logo-text">FeedbackPro</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Student Analysis System</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div>© {new Date().getFullYear()} FeedbackPro System</div>
          <div style={{ marginTop: '2px', color: '#475569' }}>v1.0.0 • College Analytics</div>
        </div>
      </aside>
    </>
  );
}
