import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import taskService from '../services/taskService';
import { Alert, Toast } from '../components/Toast';

const TaskDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await taskService.getTaskById(id);
        setTask(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      setDeleteLoading(true);
      try {
        await taskService.deleteTask(id);
        setToastMessage('Tugas berhasil dihapus!');
        setTimeout(() => {
          navigate('/tasks');
        }, 1500);
      } catch (err) {
        setError(err.message);
        setDeleteLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (statusStr) => {
    const s = (statusStr || '').toLowerCase();
    if (s === 'pending') return 'badge-pending';
    if (s === 'in progress' || s === 'inprogress') return 'badge-in-progress';
    if (s === 'completed') return 'badge-completed';
    return 'bg-secondary';
  };

  const getPriorityBadge = (priorityStr) => {
    const p = (priorityStr || '').toLowerCase();
    if (p === 'low') return 'badge-low';
    if (p === 'medium') return 'badge-medium';
    if (p === 'high') return 'badge-high';
    return 'bg-secondary';
  };

  const taskOwnerId = task?.userId?._id ? task.userId._id.toString() : task?.userId?.toString();
  const isAuthorized = user?.role === 'Admin' || user?.id === taskOwnerId;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Toast Notification */}
      <Toast 
        type="warning" 
        message={toastMessage} 
        onClose={() => setToastMessage('')} 
      />

      <div className="mb-4">
        <Link to="/tasks" className="btn btn-link text-decoration-none text-secondary p-0 d-inline-flex align-items-center gap-1">
          <i className="bi bi-arrow-left"></i> Kembali ke Daftar Tugas
        </Link>
      </div>

      {error && (
        <Alert 
          type="danger" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}

      {task && (
        <div className="custom-card p-4 p-md-5">
          {/* Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
            <span className={`badge ${getStatusBadge(task.status)} px-3 py-2 rounded-pill`} style={{ fontSize: '13px' }}>
              {task.status}
            </span>
            <span className={`badge ${getPriorityBadge(task.priority)} px-3 py-2 rounded`} style={{ fontSize: '12px' }}>
              Prioritas: {task.priority}
            </span>
          </div>

          {/* Title */}
          <h1 className="fw-bold text-dark mb-4">{task.title}</h1>

          {/* Description */}
          <h5 className="fw-semibold text-secondary mb-2">Deskripsi</h5>
          <div className="bg-light rounded-3 p-4 mb-4 text-secondary border" style={{ whiteSpace: 'pre-wrap', minHeight: '120px', fontSize: '15px' }}>
            {task.description || <em className="opacity-50">Tidak ada deskripsi untuk tugas ini.</em>}
          </div>

          {/* Task Info Grid */}
          <div className="row g-3 border-top pt-4 mb-4 text-secondary">
            <div className="col-12 col-sm-6">
              <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                <i className="bi bi-calendar-check text-primary fs-3"></i>
                <div>
                  <small className="d-block text-muted" style={{ fontSize: '11px' }}>TENGGAT WAKTU</small>
                  <strong className="text-dark">{formatDate(task.dueDate)}</strong>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                <i className="bi bi-person-badge text-primary fs-3"></i>
                <div>
                  <small className="d-block text-muted" style={{ fontSize: '11px' }}>PEMILIK TUGAS</small>
                  <strong className="text-dark">{task.userId?.username || 'Guest'}</strong>
                  {task.userId?.role && (
                    <span className="badge bg-secondary-subtle text-secondary ms-2" style={{ fontSize: '10px' }}>{task.userId.role}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                <i className="bi bi-clock text-primary fs-3"></i>
                <div>
                  <small className="d-block text-muted" style={{ fontSize: '11px' }}>DIBUAT PADA</small>
                  <strong className="text-dark">{formatDate(task.createdAt)}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          {isAuthorized && (
            <div className="d-flex justify-content-end gap-2 border-top pt-4 mt-4">
              <button 
                onClick={() => navigate(`/tasks?id=${task._id}`)} 
                className="btn btn-primary bg-gradient-primary border-0 rounded-3 px-4 py-2"
                disabled={deleteLoading}
              >
                <i className="bi bi-pencil-square me-2"></i> Edit Tugas
              </button>
              <button 
                onClick={handleDelete} 
                className="btn btn-outline-danger rounded-3 px-4 py-2"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <i className="bi bi-trash me-2"></i> Hapus Tugas
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default TaskDetail;
