import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Alert, Toast } from '../components/Toast';

const TaskList = () => {
  const { user } = useAuth();
  const { 
    tasks, 
    loading, 
    error, 
    filters, 
    updateFilters, 
    createTask, 
    updateTask, 
    deleteTask,
    refreshAll,
    clearError
  } = useTasks(true);

  // Modal and state managers
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const location = useLocation();
  const navigate = useNavigate();

  // Check URL query parameters (e.g. if navigated from Dashboard link /tasks?id=xxx)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const taskId = searchParams.get('id');
    if (taskId && tasks.length > 0) {
      const task = tasks.find(t => t._id === taskId);
      if (task) {
        setSelectedTask(task);
        setShowDetailModal(true);
        // Clear query parameters from URL
        navigate('/tasks', { replace: true });
      }
    }
  }, [location.search, tasks, navigate]);

  // Show toast notification helper
  const triggerNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
  };

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    updateFilters({ search: e.target.value });
  };

  // Handle Filter Dropdown Changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    updateFilters({ [name]: value });
  };

  // Open form modal for creation
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setShowFormModal(true);
  };

  // Open form modal for editing
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setShowFormModal(true);
  };

  // Open detail overlay
  const handleOpenDetailModal = (task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  // Handle Create / Edit Submit
  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingTask) {
        // Edit flow
        await updateTask(editingTask._id, formData);
        triggerNotification('Tugas berhasil diperbarui!');
      } else {
        // Create flow
        await createTask(formData);
        triggerNotification('Tugas baru berhasil ditambahkan!');
      }
      setShowFormModal(false);
      setEditingTask(null);
    } catch (err) {
      console.error('Submit form error:', err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteTask = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan.')) {
      try {
        await deleteTask(id);
        triggerNotification('Tugas berhasil dihapus.', 'warning');
        if (showDetailModal && selectedTask?._id === id) {
          setShowDetailModal(false);
        }
      } catch (err) {
        console.error('Gagal menghapus tugas:', err.message);
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

  return (
    <div className="animate-fade-in position-relative">
      
      {/* Toast Notification */}
      <Toast 
        type={toastType} 
        message={toastMessage} 
        onClose={() => setToastMessage('')} 
      />

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Daftar Tugas</h2>
          <p className="text-secondary m-0">Kelola dan awasi progres pekerjaan Anda</p>
        </div>
        <button 
          onClick={handleOpenCreateModal} 
          className="btn btn-primary bg-gradient-primary border-0 rounded-3 px-4 py-2.5 d-flex align-items-center gap-2 fw-semibold shadow-sm"
        >
          <i className="bi bi-plus-circle-fill"></i>
          <span>Tambah Tugas Baru</span>
        </button>
      </div>

      {/* Search and Filters Header */}
      <div className="custom-card p-4 mb-4">
        <div className="row g-3">
          {/* Search Box */}
          <div className="col-12 col-md-5">
            <label htmlFor="search-input" className="form-label text-secondary fw-semibold ps-1 mb-1.5" style={{ fontSize: '12px' }}>Cari Tugas</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-secondary rounded-start-3">
                <i className="bi bi-search"></i>
              </span>
              <input
                id="search-input"
                type="text"
                value={filters.search}
                onChange={handleSearchChange}
                className="form-control border-start-0 rounded-end-3 ps-0"
                placeholder="Cari berdasarkan judul atau deskripsi..."
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="col-6 col-md-3">
            <label htmlFor="status-filter" className="form-label text-secondary fw-semibold ps-1 mb-1.5" style={{ fontSize: '12px' }}>Status</label>
            <select
              id="status-filter"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="form-select rounded-3"
            >
              <option value="">Semua Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="col-6 col-md-3">
            <label htmlFor="priority-filter" className="form-label text-secondary fw-semibold ps-1 mb-1.5" style={{ fontSize: '12px' }}>Prioritas</label>
            <select
              id="priority-filter"
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="form-select rounded-3"
            >
              <option value="">Semua Prioritas</option>
              <option value="Low">Low (Rendah)</option>
              <option value="Medium">Medium (Sedang)</option>
              <option value="High">High (Tinggi)</option>
            </select>
          </div>

          {/* Reset Filters button */}
          <div className="col-12 col-md-1 d-flex align-items-end">
            <button 
              onClick={() => updateFilters({ search: '', status: '', priority: '' })}
              className="btn btn-outline-secondary rounded-3 w-100 py-2 d-flex justify-content-center align-items-center"
              title="Reset Filter"
              disabled={!filters.search && !filters.status && !filters.priority}
            >
              <i className="bi bi-arrow-counterclockwise fs-5"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Errors display */}
      {error && (
        <Alert 
          type="danger" 
          message={error} 
          onClose={clearError} 
        />
      )}

      {/* Main Grid View */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="custom-card p-5 text-center my-4 bg-white">
          <div className="py-4">
            <i className="bi bi-journal-x text-secondary opacity-25" style={{ fontSize: '4.5rem' }}></i>
            <h4 className="fw-bold text-dark mt-3">Tidak Ada Tugas</h4>
            <p className="text-secondary mx-auto" style={{ maxWidth: '400px' }}>
              Tidak ditemukan tugas yang sesuai dengan kriteria pencarian atau filter Anda. Silakan ubah filter Anda atau tambah tugas baru.
            </p>
            <button 
              onClick={handleOpenCreateModal} 
              className="btn btn-primary rounded-3 px-4 py-2 mt-2"
            >
              Buat Tugas Sekarang
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {tasks.map(task => (
            <div key={task._id} className="col-12 col-md-6 col-xl-4">
              <TaskCard 
                task={task} 
                onEdit={handleOpenEditModal} 
                onDelete={handleDeleteTask}
                onView={handleOpenDetailModal}
              />
            </div>
          ))}
        </div>
      )}

      {/* CREATE/EDIT MODAL OVERLAY */}
      {showFormModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-light border-0 py-3 px-4">
                <h5 className="modal-title fw-bold text-dark">
                  {editingTask ? 'Edit Tugas' : 'Tambah Tugas Baru'}
                </h5>
                <button 
                  type="button" 
                  onClick={() => setShowFormModal(false)}
                  className="btn-close" 
                  aria-label="Close"
                  disabled={formLoading}
                ></button>
              </div>
              <div className="modal-body p-4">
                <TaskForm 
                  task={editingTask} 
                  onSubmit={handleFormSubmit} 
                  onCancel={() => setShowFormModal(false)}
                  loading={formLoading}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL OVERLAY */}
      {showDetailModal && selectedTask && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-light border-0 py-3 px-4">
                <h5 className="modal-title fw-bold text-dark">Detail Tugas</h5>
                <button 
                  type="button" 
                  onClick={() => setShowDetailModal(false)}
                  className="btn-close" 
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className={`badge ${
                      selectedTask.status === 'Completed' ? 'badge-completed' :
                      selectedTask.status === 'In Progress' ? 'badge-in-progress' : 'badge-pending'
                    } px-3 py-2 rounded-pill`}>
                      {selectedTask.status}
                    </span>
                    <span className={`badge ${
                      selectedTask.priority === 'High' ? 'badge-high' :
                      selectedTask.priority === 'Medium' ? 'badge-medium' : 'badge-low'
                    } px-2.5 py-1.5 rounded`}>
                      Prioritas: {selectedTask.priority}
                    </span>
                  </div>
                  <h3 className="fw-bold text-dark mb-3">{selectedTask.title}</h3>
                  <div className="bg-light rounded-3 p-3 mb-4 text-secondary" style={{ whiteSpace: 'pre-wrap', minHeight: '100px', fontSize: '14px' }}>
                    {selectedTask.description || <em className="opacity-50">Tidak ada deskripsi.</em>}
                  </div>
                </div>

                <div className="border-top pt-3 text-secondary" style={{ fontSize: '14px' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tenggat Waktu:</span>
                    <strong className="text-dark">{formatDate(selectedTask.dueDate)}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Dibuat pada:</span>
                    <span className="text-dark">{formatDate(selectedTask.createdAt)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Pembuat Tugas:</span>
                    <strong className="text-dark">{selectedTask.userId?.username || 'Guest'}</strong>
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light border-0 py-3 px-4 d-flex gap-2">
                <button 
                  onClick={() => setShowDetailModal(false)} 
                  className="btn btn-secondary rounded-3 px-4"
                >
                  Tutup
                </button>
                {/* Check Authorization to Edit/Delete */}
                {(user?.role === 'Admin' || user?.id === (selectedTask.userId?._id || selectedTask.userId)) && (
                  <>
                    <button 
                      onClick={() => {
                        setShowDetailModal(false);
                        handleOpenEditModal(selectedTask);
                      }} 
                      className="btn btn-primary bg-gradient-primary border-0 rounded-3 px-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteTask(selectedTask._id)} 
                      className="btn btn-danger rounded-3 px-3"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TaskList;
