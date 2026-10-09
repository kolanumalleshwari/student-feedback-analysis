import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert alert-error" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
        <AlertTriangle size={18} />
        <span>Error Loading Data</span>
      </div>
      <p style={{ fontSize: '0.85rem' }}>
        {message || 'Could not connect to the backend server. Please check your MySQL database connection and backend API status.'}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="btn btn-secondary" 
          style={{ padding: '6px 12px', fontSize: '0.8rem', marginTop: '4px' }}
        >
          <RefreshCw size={14} /> Retry Connection
        </button>
      )}
    </div>
  );
}
