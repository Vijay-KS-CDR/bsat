import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';

import DashboardLayout from '../components/layout/DashboardLayout';
import StudentsPage from '../pages/StudentsPage';
import TeachersPage from '../pages/TeachersPage';
import SubjectsPage from '../pages/SubjectsPage';
import QuestionsPage from '../pages/QuestionsPage';

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

      {/* Module 3: Teacher Management (Direct preview enabled) */}
      <Route 
        path="/teachers" 
        element={
          <DashboardLayout>
            <TeachersPage />
          </DashboardLayout>
        } 
      />
      <Route 
        path="/teachers/add" 
        element={
          <DashboardLayout>
            <TeachersPage />
          </DashboardLayout>
        } 
      />
      <Route 
        path="/teachers/:id" 
        element={
          <DashboardLayout>
            <TeachersPage />
          </DashboardLayout>
        } 
      />
      <Route 
        path="/teachers/:id/edit" 
        element={
          <DashboardLayout>
            <TeachersPage />
          </DashboardLayout>
        } 
      />

      {/* Module 4: Subject Management (Direct preview enabled) */}
      <Route 
        path="/subjects" 
        element={
          <DashboardLayout>
            <SubjectsPage />
          </DashboardLayout>
        } 
      />
      <Route 
        path="/subjects/add" 
        element={
          <DashboardLayout>
            <SubjectsPage />
          </DashboardLayout>
        } 
      />
      <Route 
        path="/subjects/:id" 
        element={
          <DashboardLayout>
            <SubjectsPage />
          </DashboardLayout>
        } 
      />
      <Route 
        path="/subjects/:id/edit" 
        element={
          <DashboardLayout>
            <SubjectsPage />
          </DashboardLayout>
        } 
      />

      {/* Module 5: Question Bank Frontend */}
      <Route 
        path="/question-bank" 
        element={
          <DashboardLayout>
            <QuestionsPage />
          </DashboardLayout>
        } 
      />
      <Route 
        path="/question-bank/add" 
        element={
          <DashboardLayout>
            <QuestionsPage />
          </DashboardLayout>
        } 
      />
      <Route 
        path="/question-bank/:id" 
        element={
          <DashboardLayout>
            <QuestionsPage />
          </DashboardLayout>
        } 
      />
      <Route 
        path="/question-bank/:id/edit" 
        element={
          <DashboardLayout>
            <QuestionsPage />
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
