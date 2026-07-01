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
import TestsPage from '../pages/TestsPage';
import EvaluationDashboard from '../pages/EvaluationDashboard';
import AnswerReviewPage from '../pages/AnswerReviewPage';
import FinalResultsPage from '../pages/FinalResultsPage';

// Student Portal Imports
import StudentPortalLayout from '../components/layout/StudentPortalLayout';
import StudentDashboardPage from '../pages/student/StudentDashboardPage';
import StudentTestsPage from '../pages/student/StudentTestsPage';
import StudentTestDetailPage from '../pages/student/StudentTestDetailPage';
import StudentResultsPage from '../pages/student/StudentResultsPage';
import StudentResultDetailPage from '../pages/student/StudentResultDetailPage';
import ExamInstructionsPage from '../pages/student/ExamInstructionsPage';
import ExamScreenPage from '../pages/student/ExamScreenPage';
import ExamSubmittedPage from '../pages/student/ExamSubmittedPage';
import ResultReviewPage from '../pages/ResultReviewPage';
import { useAuth } from '../context/AuthContext';

const DashboardWrapper = () => {
  const { user } = useAuth();
  if (user?.role === 'STUDENT') {
    return <Navigate to="/student/dashboard" replace />;
  }
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard — wrapped in DashboardLayout so sidebar/topnav are always present */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardWrapper />
          </ProtectedRoute>
        }
      />

      {/* Module 2: Student Management Dashboard */}
      <Route 
        path="/students" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout>
              <StudentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* Module 3: Teacher Management */}
      <Route 
        path="/teachers" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout>
              <TeachersPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teachers/add" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout>
              <TeachersPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teachers/:id" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout>
              <TeachersPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teachers/:id/edit" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout>
              <TeachersPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* Module 4: Subject Management */}
      <Route 
        path="/subjects" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
            <DashboardLayout>
              <SubjectsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/subjects/add" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
            <DashboardLayout>
              <SubjectsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/subjects/:id" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
            <DashboardLayout>
              <SubjectsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/subjects/:id/edit" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
            <DashboardLayout>
              <SubjectsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* Module 5: Question Bank Frontend */}
      <Route 
        path="/question-bank" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
            <DashboardLayout>
              <QuestionsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/question-bank/add" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
            <DashboardLayout>
              <QuestionsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/question-bank/:id" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
            <DashboardLayout>
              <QuestionsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/question-bank/:id/edit" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
            <DashboardLayout>
              <QuestionsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* Module 6: Test Creation Frontend */}
      <Route 
        path="/tests" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
            <DashboardLayout>
              <TestsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tests/add" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
            <DashboardLayout>
              <TestsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tests/:id" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
            <DashboardLayout>
              <TestsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tests/:id/edit" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
            <DashboardLayout>
              <TestsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* Module 9: Evaluation Dashboard */}
      <Route 
        path="/evaluations" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
            <DashboardLayout>
              <EvaluationDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/evaluations/attempt/:attemptId" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
            <DashboardLayout>
              <AnswerReviewPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* Results Module */}
      <Route 
        path="/results" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
            <DashboardLayout>
              <FinalResultsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/results/:attemptId/review" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
            <DashboardLayout>
              <ResultReviewPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* Analytics Module */}
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout>
              {null}
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* Settings Module */}
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout>
              {null}
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* Student Portal Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentPortalLayout>
              <StudentDashboardPage />
            </StudentPortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/tests"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentPortalLayout>
              <StudentTestsPage />
            </StudentPortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/tests/:id"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentPortalLayout>
              <StudentTestDetailPage />
            </StudentPortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/tests/:id/instructions"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentPortalLayout>
              <ExamInstructionsPage />
            </StudentPortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/tests/:id/exam"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <ExamScreenPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/tests/:id/submitted"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <ExamSubmittedPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/results"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentPortalLayout>
              <StudentResultsPage />
            </StudentPortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/results/:id"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentPortalLayout>
              <StudentResultDetailPage />
            </StudentPortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/results/:attemptId/review"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentPortalLayout>
              <ResultReviewPage />
            </StudentPortalLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
