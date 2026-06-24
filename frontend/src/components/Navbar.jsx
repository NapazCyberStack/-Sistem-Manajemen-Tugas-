import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Navbar = ({ onToggleSidebar, sidebarCollapsed }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4" style={{ height: '70px', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
        
        {/* Toggle Sidebar Button */}
        <button 
          onClick={onToggleSidebar} 
          className="btn btn-light border-0 me-3 d-flex align-items-center justify-content-center"
          style={{ width: '40px', height: '40px', borderRadius: '8px' }}
          aria-label="Toggle Sidebar"
        >
          <i className={`bi bi-${sidebarCollapsed ? 'indent' : 'dedent'} fs-5 text-secondary`}></i>
        </button>

        {/* Brand / Context Title */}
        <h4 className="m-0 fw-semibold text-secondary d-none d-sm-block">Sistem Manajemen Tugas</h4>

        {/* User profile dropdown & actions */}
        <div className="d-flex align-items-center gap-3">
          <div className="text-end d-none d-md-block">
            <div className="fw-semibold text-dark m-0">{user?.username}</div>
            <span className={`badge ${user?.role === 'Admin' ? 'bg-danger' : 'bg-primary'} rounded-pill`} style={{ fontSize: '10px' }}>
              {user?.role}
            </span>
          </div>

          {/* User Avatar Circle */}
          <div 
            className="d-flex align-items-center justify-content-center bg-light text-primary border border-primary-subtle rounded-circle fw-bold" 
            style={{ width: '40px', height: '40px', fontSize: '16px' }}
          >
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="vr d-none d-md-block"></div>

          {/* Logout Button */}
          <button 
            onClick={logout} 
            className="btn btn-outline-danger btn-sm border-0 d-flex align-items-center gap-2 py-2 px-3 rounded-3"
          >
            <i className="bi bi-box-arrow-right"></i>
            <span className="d-none d-lg-inline">Keluar</span>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
