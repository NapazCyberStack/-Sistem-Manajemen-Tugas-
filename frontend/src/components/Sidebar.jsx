import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ isOpen, isCollapsed, onCloseMobile }) => {
  const { user } = useAuth();

  return (
    <div 
      className={`sidebar-container ${isOpen ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* Sidebar Header */}
      <div 
        className="d-flex align-items-center justify-content-between px-4 border-bottom border-secondary-subtle"
        style={{ height: '70px', minHeight: '70px' }}
      >
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-layers-half text-primary fs-3"></i>
          {!isCollapsed && (
            <span className="fs-5 fw-bold text-white tracking-wide">TaskManager</span>
          )}
        </div>
        {/* Mobile Close Button */}
        <button 
          onClick={onCloseMobile} 
          className="btn text-white p-0 border-0 d-lg-none"
          style={{ width: '32px', height: '32px' }}
        >
          <i className="bi bi-x-lg fs-5"></i>
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-grow-1 py-4 overflow-y-auto">
        <NavLink 
          to="/" 
          end
          onClick={onCloseMobile}
          className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-grid fs-5"></i>
          {!isCollapsed && <span className="sidebar-text">Dashboard</span>}
        </NavLink>

        <NavLink 
          to="/tasks" 
          onClick={onCloseMobile}
          className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-check2-square fs-5"></i>
          {!isCollapsed && <span className="sidebar-text">Daftar Tugas</span>}
        </NavLink>

        {user?.role === 'Admin' && (
          <div className="mt-4 px-4 py-2 border-top border-secondary border-opacity-25">
            {!isCollapsed && (
              <small className="text-secondary fw-semibold text-uppercase tracking-wider" style={{ fontSize: '11px' }}>
                Administrator
              </small>
            )}
            <div className="mt-2 text-info d-flex align-items-center gap-2 px-1">
              <i className="bi bi-shield-check fs-6"></i>
              {!isCollapsed && <span style={{ fontSize: '13px' }}>Mode Kelola Data</span>}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-top border-secondary border-opacity-25 bg-dark bg-opacity-25 text-center text-secondary">
        {!isCollapsed ? (
          <div style={{ fontSize: '12px' }}>
            <p className="m-0">Tugas UAS Pemrograman Web</p>
            <strong className="text-white-50">Node.js + React JS</strong>
          </div>
        ) : (
          <i className="bi bi-info-circle fs-5"></i>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
