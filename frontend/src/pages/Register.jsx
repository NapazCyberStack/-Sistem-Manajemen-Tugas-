import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Alert } from '../components/Toast';

const Register = () => {
  const { register, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    // Reset errors
    if (validationError) setValidationError('');
    clearError();
  };

  // Perform form validation
  const validateForm = () => {
    if (!formData.username.trim()) {
      setValidationError('Nama pengguna (username) wajib diisi.');
      return false;
    }
    if (formData.username.trim().length < 3) {
      setValidationError('Nama pengguna minimal harus 3 karakter.');
      return false;
    }

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
    if (formData.password.length < 6) {
      setValidationError('Kata sandi minimal harus 6 karakter.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Konfirmasi kata sandi tidak cocok.');
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
      await register(
        formData.username.trim(), 
        formData.email.trim(), 
        formData.password
      );
      // Redirect to dashboard on success
      navigate('/');
    } catch (err) {
      console.error('Registrasi gagal:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-4 p-md-5 animate-fade-in">
      <div className="text-center mb-4">
        <i className="bi bi-person-plus text-primary" style={{ fontSize: '3rem' }}></i>
        <h2 className="fw-bold mt-2 text-dark">Daftar Akun</h2>
        <p className="text-muted">Buat akun untuk mengelola tugas Anda</p>
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
        {/* Username */}
        <div className="form-floating mb-3">
          <input
            type="text"
            id="register-username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control rounded-3"
            placeholder="Username"
            disabled={loading}
            required
          />
          <label htmlFor="register-username">Nama Pengguna (Username)</label>
        </div>

        {/* Email */}
        <div className="form-floating mb-3">
          <input
            type="email"
            id="register-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control rounded-3"
            placeholder="nama@email.com"
            disabled={loading}
            required
          />
          <label htmlFor="register-email">Alamat Email</label>
        </div>

        {/* Password */}
        <div className="form-floating mb-3">
          <input
            type="password"
            id="register-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control rounded-3"
            placeholder="Kata sandi"
            disabled={loading}
            required
          />
          <label htmlFor="register-password">Kata Sandi (Min 6 Karakter)</label>
        </div>

        {/* Confirm Password */}
        <div className="form-floating mb-4">
          <input
            type="password"
            id="register-confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-control rounded-3"
            placeholder="Konfirmasi Kata sandi"
            disabled={loading}
            required
          />
          <label htmlFor="register-confirmPassword">Konfirmasi Kata Sandi</label>
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
              <span>Mendaftarkan...</span>
            </>
          ) : (
            <>
              <i className="bi bi-person-check"></i>
              <span>Daftar Sekarang</span>
            </>
          )}
        </button>
      </form>

      {/* Link to Login */}
      <div className="text-center mt-4 border-top pt-3">
        <p className="text-muted m-0" style={{ fontSize: '14px' }}>
          Sudah punya akun? <Link to="/login" className="text-primary fw-semibold text-decoration-none">Masuk di Sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
