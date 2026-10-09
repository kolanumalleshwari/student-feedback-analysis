import React from 'react';

export default function LoadingSpinner({ message = 'Loading feedback data...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}
