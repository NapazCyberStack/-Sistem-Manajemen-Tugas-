import React, { useEffect } from 'react';

// Inline Alert Component
export const Alert = ({ type = 'danger', message, onClose }) => {
  if (!message) return null;

  const getAlertIcon = () => {
    switch (type) {
      case 'success': return 'bi-check-circle-fill';
      case 'warning': return 'bi-exclamation-triangle-fill';
      case 'info': return 'bi-info-circle-fill';
      case 'danger':
      default:
        return 'bi-exclamation-circle-fill';
    }
  };

  return (
    <div className={`alert alert-${type} alert-dismissible fade show border-0 rounded-3 shadow-sm d-flex align-items-center gap-3 py-3 px-4 mb-4`} role="alert">
      <i className={`bi ${getAlertIcon()} fs-4 text-${type}`}></i>
      <div className="flex-grow-1 text-dark" style={{ fontSize: '14px', fontWeight: '500' }}>
        {message}
      </div>
      {onClose && (
        <button 
          type="button" 
          onClick={onClose} 
          className="btn-close ms-auto p-3" 
          aria-label="Close"
        ></button>
      )}
    </div>
  );
};

// Auto-dismiss Toast component
export const Toast = ({ type = 'success', message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (message && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgClass = type === 'success' ? 'bg-success' : type === 'danger' ? 'bg-danger' : type === 'warning' ? 'bg-warning' : 'bg-primary';

  return (
    <div 
      className="position-fixed bottom-0 end-0 p-3" 
      style={{ zIndex: 1080 }}
    >
      <div className={`toast show text-white border-0 rounded-3 shadow-lg ${bgClass}`} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex align-items-center justify-content-between p-3">
          <div className="d-flex align-items-center gap-2">
            <i className={`bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} fs-5`}></i>
            <span className="fw-semibold" style={{ fontSize: '14px' }}>{message}</span>
          </div>
          {onClose && (
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-close btn-close-white m-0 p-0" 
              aria-label="Close"
              style={{ boxShadow: 'none' }}
            ></button>
          )}
        </div>
      </div>
    </div>
  );
};
