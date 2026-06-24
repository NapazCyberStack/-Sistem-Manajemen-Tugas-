import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  const { user, loading } = useAuth();
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [sidebarCollapsedDesktop, setSidebarCollapsedDesktop] = useState(false);

  // Show a blank loading screen while fetching session details
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Handle toggler click based on viewport width
  const handleToggleSidebar = () => {
    if (window.innerWidth < 992) {
      setSidebarOpenMobile(!sidebarOpenMobile);
    } else {
      setSidebarCollapsedDesktop(!sidebarCollapsedDesktop);
    }
  };

  const closeMobileSidebar = () => {
    setSidebarOpenMobile(false);
  };

  return (
    <div className="app-wrapper">
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={sidebarOpenMobile} 
        isCollapsed={sidebarCollapsedDesktop}
        onCloseMobile={closeMobileSidebar} 
      />

      {/* Main Panel */}
      <div className={`main-content ${sidebarCollapsedDesktop ? 'collapsed-margin' : ''}`} style={{
        // Dynamic adjustment for collapsed state
        marginLeft: window.innerWidth >= 992 ? (sidebarCollapsedDesktop ? '75px' : '260px') : '0',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Navbar */}
        <Navbar 
          onToggleSidebar={handleToggleSidebar} 
          sidebarCollapsed={sidebarCollapsedDesktop} 
        />

        {/* Page Content Area */}
        <main className="container-fluid flex-grow-1 p-4">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpenMobile && (
        <div 
          onClick={closeMobileSidebar}
          className="d-lg-none"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1010
          }}
        ></div>
      )}
    </div>
  );
};

export default MainLayout;
