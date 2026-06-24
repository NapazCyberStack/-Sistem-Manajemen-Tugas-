import React from 'react';
import { useAuth } from '../hooks/useAuth';

const TaskCard = ({ task, onEdit, onDelete, onView }) => {
  const { user } = useAuth();

  const { _id, title, description, status, priority, dueDate, userId } = task;

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if date is overdue
  const isOverdue = (dateString) => {
    if (!dateString || status === 'Completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateString);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  // Get status badge styling class
  const getStatusBadgeClass = (statusStr) => {
    const s = (statusStr || '').toLowerCase();
    if (s === 'pending') return 'badge-pending';
    if (s === 'in progress' || s === 'inprogress') return 'badge-in-progress';
    if (s === 'completed') return 'badge-completed';
    return 'bg-secondary';
  };

  // Get priority badge styling class
  const getPriorityBadgeClass = (priorityStr) => {
    const p = (priorityStr || '').toLowerCase();
    if (p === 'low') return 'badge-low';
    if (p === 'medium') return 'badge-medium';
    if (p === 'high') return 'badge-high';
    return 'bg-secondary';
  };

  // Check authorization to edit/delete
  const taskOwnerId = userId?._id ? userId._id.toString() : userId.toString();
  const isAuthorized = user?.role === 'Admin' || user?.id === taskOwnerId;

  return (
    <div className="custom-card p-4 h-100 d-flex flex-column animate-fade-in">
      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
        {/* Status Badge */}
        <span className={`badge ${getStatusBadgeClass(status)} px-3 py-2 rounded-pill`} style={{ fontSize: '12px' }}>
          {status}
        </span>
        
        {/* Priority Badge */}
        <span className={`badge ${getPriorityBadgeClass(priority)} px-2.5 py-1.5 rounded`} style={{ fontSize: '11px', fontWeight: '500' }}>
          <i className="bi bi-flag-fill me-1"></i> {priority}
        </span>
      </div>

      {/* Task Title */}
      <h5 className="card-title fw-bold text-dark mt-2 mb-2 text-truncate" title={title}>
        {title}
      </h5>

      {/* Description */}
      <p className="card-text text-muted flex-grow-1 mb-3" style={{ 
        fontSize: '14px', 
        display: '-webkit-box', 
        WebkitLineClamp: 3, 
        WebkitBoxOrient: 'vertical', 
        overflow: 'hidden', 
        minHeight: '60px' 
      }}>
        {description || <em className="text-secondary opacity-50">Tidak ada deskripsi.</em>}
      </p>

      {/* Meta details (Due date and Owner) */}
      <div className="border-top pt-3 mt-auto">
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* Due Date */}
          <div className="d-flex align-items-center gap-1.5" style={{ fontSize: '13px' }}>
            <i className={`bi bi-calendar-event ${isOverdue(dueDate) ? 'text-danger fw-bold' : 'text-secondary'}`}></i>
            <span className={isOverdue(dueDate) ? 'text-danger fw-bold' : 'text-secondary'}>
              Batas: {formatDate(dueDate)}
              {isOverdue(dueDate) && <span className="ms-1">(Terlewat!)</span>}
            </span>
          </div>

          {/* Task Owner Profile avatar summary */}
          {user?.role === 'Admin' && (
            <div className="d-flex align-items-center gap-1 text-secondary" style={{ fontSize: '13px' }} title={`Pembuat: ${userId?.username || 'Unknown'}`}>
              <i className="bi bi-person"></i>
              <span className="text-truncate" style={{ maxWidth: '80px' }}>
                {userId?.username || 'Unknown'}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2">
          {/* Detail View Button */}
          <button 
            onClick={() => onView(task)} 
            className="btn btn-outline-secondary btn-sm flex-grow-1 py-1.5 rounded-3"
          >
            <i className="bi bi-eye me-1"></i> Detail
          </button>

          {isAuthorized && (
            <>
              {/* Edit Button */}
              <button 
                onClick={() => onEdit(task)} 
                className="btn btn-outline-primary btn-sm rounded-3 px-3"
                title="Edit Tugas"
              >
                <i className="bi bi-pencil"></i>
              </button>
              {/* Delete Button */}
              <button 
                onClick={() => onDelete(_id)} 
                className="btn btn-outline-danger btn-sm rounded-3 px-3"
                title="Hapus Tugas"
              >
                <i className="bi bi-trash"></i>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
