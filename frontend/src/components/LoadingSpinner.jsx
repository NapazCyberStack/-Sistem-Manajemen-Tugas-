import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Memuat...' }) => {
  const sizeMap = { sm: '1rem', md: '2rem', lg: '3.5rem' };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5 gap-3">
      <div
        className="spinner-border text-primary"
        role="status"
        style={{ width: sizeMap[size], height: sizeMap[size] }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <p className="text-secondary mb-0" style={{ fontSize: '14px' }}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
