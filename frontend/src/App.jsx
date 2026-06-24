import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          
          {/* Guest Routes (Redirects to / if already logged in) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Authenticated Routes (Redirects to /login if not logged in) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
          </Route>

          {/* Catch-all redirect to Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
