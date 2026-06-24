import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Alert } from '../components/Toast';

const Login = () => {
  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset errors on keystroke
    if (validationError) setValidationError('');
    clearError();
  };

  // Perform form validation
  const validateForm = () => {
    if (!formData.email.trim()) {
      setValidationError('Alamat email wajib diisi.');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setValidationError('Format alamat email tidak valid.');
      return false;
    }

    if (!formData.password) {
      setValidationError('Kata sandi wajib diisi.');
      return false;
    }

    return true;
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setValidationError('');
    try {
      await login(formData.email, formData.password);
      // On success, redirect to dashboard
      navigate('/');
    } catch (err) {
      // Error is stored globally in useAuth, which we display
      console.error('Login gagal:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-4 p-md-5 animate-fade-in">
      <div className="text-center mb-4">
        <i className="bi bi-layers-half text-primary" style={{ fontSize: '3rem' }}></i>
        <h2 className="fw-bold mt-2 text-dark">Selamat Datang</h2>
        <p className="text-muted">Masuk ke Sistem Manajemen Tugas Anda</p>
      </div>

      {/* Error feedback */}
      {(validationError || authError) && (
        <Alert 
          type="danger" 
          message={validationError || authError} 
          onClose={() => {
            setValidationError('');
            clearError();
          }}
        />
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div className="form-floating mb-3">
          <input
            type="email"
            id="login-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-control rounded-3 ${validationError && !formData.email ? 'is-invalid' : ''}`}
            placeholder="nama@email.com"
            disabled={loading}
            required
          />
          <label htmlFor="login-email">Alamat Email</label>
        </div>

        {/* Password */}
        <div className="form-floating mb-4">
          <input
            type="password"
            id="login-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`form-control rounded-3 ${validationError && !formData.password ? 'is-invalid' : ''}`}
            placeholder="Kata sandi"
            disabled={loading}
            required
          />
          <label htmlFor="login-password">Kata Sandi</label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="btn btn-primary bg-gradient-primary border-0 w-100 py-3 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
          style={{ fontSize: '16px' }}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <i className="bi bi-box-arrow-in-right"></i>
              <span>Masuk Sekarang</span>
            </>
          )}
        </button>
      </form>

      {/* Link to Register */}
      <div className="text-center mt-4 border-top pt-3">
        <p className="text-muted m-0" style={{ fontSize: '14px' }}>
          Belum punya akun? <Link to="/register" className="text-primary fw-semibold text-decoration-none">Daftar Akun Baru</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
