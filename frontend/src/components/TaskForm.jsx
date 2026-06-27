import React, { useState, useEffect } from 'react';

const TaskForm = ({ task, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: ''
  });

  const [errors, setErrors] = useState({});
  const [proofImageFile, setProofImageFile] = useState(null);
  const [proofImagePreview, setProofImagePreview] = useState('');

  // Populate form if editing an existing task
  useEffect(() => {
    if (task) {
      // Format ISO Date to YYYY-MM-DD for HTML input
      let formattedDate = '';
      if (task.dueDate) {
        formattedDate = new Date(task.dueDate).toISOString().split('T')[0];
      }

      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Pending',
        priority: task.priority || 'Medium',
        dueDate: formattedDate
      });
      setProofImageFile(null);
      setProofImagePreview(task.proofImage || '');
    } else {
      // Reset form
      setFormData({
        title: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
        dueDate: ''
      });
      setProofImageFile(null);
      setProofImagePreview('');
    }
    setErrors({});
  }, [task]);

  // Handle inputs change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error message for this field if any
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Perform frontend form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Judul tugas wajib diisi';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Judul tidak boleh melebihi 100 karakter';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Tenggat waktu wajib diisi';
    } else {
      const selectedDate = new Date(formData.dueDate);
      if (isNaN(selectedDate.getTime())) {
        newErrors.dueDate = 'Format tanggal tidak valid';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImageFile(file);
      setProofImagePreview(URL.createObjectURL(file));
    } else {
      setProofImageFile(null);
      setProofImagePreview(task?.proofImage || '');
    }
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submissionData = new FormData();
      submissionData.append('title', formData.title);
      submissionData.append('description', formData.description || '');
      submissionData.append('status', formData.status);
      submissionData.append('priority', formData.priority);
      submissionData.append('dueDate', formData.dueDate);
      if (proofImageFile) {
        submissionData.append('proofImage', proofImageFile);
      }
      onSubmit(submissionData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation">
      <div className="mb-3">
        <label htmlFor="task-title" className="form-label fw-semibold text-secondary">
          Judul Tugas <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="task-title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`form-control form-control-lg rounded-3 ${errors.title ? 'is-invalid' : ''}`}
          placeholder="Masukkan judul tugas..."
          disabled={loading}
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="task-description" className="form-label fw-semibold text-secondary">
          Deskripsi Tugas
        </label>
        <textarea
          id="task-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="form-control rounded-3"
          placeholder="Detail/deskripsi tugas..."
          disabled={loading}
        ></textarea>
      </div>

      <div className="mb-3">
        <label htmlFor="task-proofImage" className="form-label fw-semibold text-secondary">
          Foto Bukti Tugas
        </label>
        <input
          type="file"
          id="task-proofImage"
          name="proofImage"
          accept="image/*"
          onChange={handleFileChange}
          className="form-control rounded-3"
          disabled={loading}
        />
        {proofImagePreview && (
          <div className="mt-3">
            <p className="mb-2 text-secondary small">Pratinjau bukti foto saat ini:</p>
            <img
              src={proofImagePreview}
              alt="Bukti tugas"
              className="img-fluid rounded-3"
              style={{ maxHeight: '220px', objectFit: 'cover', width: '100%' }}
            />
          </div>
        )}
      </div>

      <div className="row g-3 mb-4">
        {/* Status */}
        <div className="col-md-6 col-12">
          <label htmlFor="task-status" className="form-label fw-semibold text-secondary">Status</label>
          <select
            id="task-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select rounded-3"
            disabled={loading}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Priority */}
        <div className="col-md-6 col-12">
          <label htmlFor="task-priority" className="form-label fw-semibold text-secondary">Prioritas</label>
          <select
            id="task-priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="form-select rounded-3"
            disabled={loading}
          >
            <option value="Low">Low (Rendah)</option>
            <option value="Medium">Medium (Sedang)</option>
            <option value="High">High (Tinggi)</option>
          </select>
        </div>

        {/* Due Date */}
        <div className="col-12">
          <label htmlFor="task-dueDate" className="form-label fw-semibold text-secondary">
            Tenggat Waktu <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            id="task-dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className={`form-control rounded-3 ${errors.dueDate ? 'is-invalid' : ''}`}
            disabled={loading}
          />
          {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-end gap-2 border-top pt-3">
        <button 
          type="button" 
          onClick={onCancel} 
          className="btn btn-light rounded-3 px-4 py-2"
          disabled={loading}
        >
          Batal
        </button>
        <button 
          type="submit" 
          className="btn btn-primary bg-gradient-primary border-0 rounded-3 px-4 py-2 d-flex align-items-center gap-2"
          disabled={loading}
        >
          {loading && (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          )}
          <i className="bi bi-check-circle"></i>
          {task ? 'Simpan Perubahan' : 'Buat Tugas'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
