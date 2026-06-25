import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';

import DashboardLayout from '../components/layout/DashboardLayout';
import StudentsPage from '../pages/StudentsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/students" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Module 2: Student Management Dashboard (Direct preview enabled) */}
      <Route 
        path="/students" 
        element={
          <DashboardLayout>
            <StudentsPage />
          </DashboardLayout>
        } 
      />

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/students" replace />} />
    </Routes>
  );
};

export default AppRoutes;
