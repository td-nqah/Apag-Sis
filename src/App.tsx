// ==========================================================================
// APAG SIS | Hệ thống cố vấn thông minh - Main Application Router & Entry
// ==========================================================================

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';

// Public Pages
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));

// Student Pages
const StudentDashboard = lazy(() => import('./pages/student/Dashboard').then(m => ({ default: m.StudentDashboard })));
const StudentProfile = lazy(() => import('./pages/student/Profile').then(m => ({ default: m.StudentProfile })));
const StudentProgress = lazy(() => import('./pages/student/Progress').then(m => ({ default: m.StudentProgress })));
const StudentCurriculum = lazy(() => import('./pages/student/Curriculum').then(m => ({ default: m.StudentCurriculum })));
const StudentGrades = lazy(() => import('./pages/student/Grades').then(m => ({ default: m.StudentGrades })));
const StudentLearningPath = lazy(() => import('./pages/student/LearningPath').then(m => ({ default: m.StudentLearningPath })));
const StudentTimetable = lazy(() => import('./pages/student/Timetable').then(m => ({ default: m.StudentTimetable })));
const StudentAlerts = lazy(() => import('./pages/student/Alerts').then(m => ({ default: m.StudentAlerts })));
const StudentAiAssistant = lazy(() => import('./pages/student/AiAssistant').then(m => ({ default: m.StudentAiAssistant })));
const StudentNotifications = lazy(() => import('./pages/student/Notifications').then(m => ({ default: m.StudentNotifications })));
const StudentSettings = lazy(() => import('./pages/student/Settings').then(m => ({ default: m.StudentSettings })));

// Advisor Pages
const AdvisorDashboard = lazy(() => import('./pages/advisor/Dashboard').then(m => ({ default: m.AdvisorDashboard })));
const AdvisorStudents = lazy(() => import('./pages/advisor/Students').then(m => ({ default: m.AdvisorStudents })));
const AdvisorStudentDetail = lazy(() => import('./pages/advisor/StudentDetail').then(m => ({ default: m.AdvisorStudentDetail })));
const AdvisorProgress = lazy(() => import('./pages/advisor/Progress').then(m => ({ default: m.AdvisorProgress })));
const AdvisorLearningPaths = lazy(() => import('./pages/advisor/LearningPaths').then(m => ({ default: m.AdvisorLearningPaths })));
const AdvisorAlerts = lazy(() => import('./pages/advisor/Alerts').then(m => ({ default: m.AdvisorAlerts })));
const AdvisorReports = lazy(() => import('./pages/advisor/Reports').then(m => ({ default: m.AdvisorReports })));
const AdvisorAiAssistant = lazy(() => import('./pages/advisor/AiAssistant').then(m => ({ default: m.AdvisorAiAssistant })));
const AdvisorNotifications = lazy(() => import('./pages/advisor/Notifications').then(m => ({ default: m.AdvisorNotifications })));
const AdvisorSettings = lazy(() => import('./pages/advisor/Settings').then(m => ({ default: m.AdvisorSettings })));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard })));
const AdminStudents = lazy(() => import('./pages/admin/Students').then(m => ({ default: m.AdminStudents })));
const AdminCourses = lazy(() => import('./pages/admin/Courses').then(m => ({ default: m.AdminCourses })));
const AdminCurriculum = lazy(() => import('./pages/admin/Curriculum').then(m => ({ default: m.AdminCurriculum })));
const AdminUsers = lazy(() => import('./pages/admin/Users').then(m => ({ default: m.AdminUsers })));
const AdminKnowledgeBase = lazy(() => import('./pages/admin/KnowledgeBase').then(m => ({ default: m.AdminKnowledgeBase })));
const AdminRegulations = lazy(() => import('./pages/admin/Regulations').then(m => ({ default: m.AdminRegulations })));
const AdminAiAgent = lazy(() => import('./pages/admin/AiAgent').then(m => ({ default: m.AdminAiAgent })));
const AdminReports = lazy(() => import('./pages/admin/Reports').then(m => ({ default: m.AdminReports })));
const AdminSystem = lazy(() => import('./pages/admin/System').then(m => ({ default: m.AdminSystem })));
const AdminSettings = lazy(() => import('./pages/admin/Settings').then(m => ({ default: m.AdminSettings })));

/**
 * Smart Root Redirector based on user role and session state
 */
const RootRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--background)' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/assets/images/apag-logo.png" alt="APAG" style={{ height: '40px', marginBottom: '16px' }} />
          <div className="text-secondary" style={{ fontSize: '0.875rem' }}>Đang nạp dữ liệu APAG...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'advisor') return <Navigate to="/advisor/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--background)' }}>
            <div className="text-secondary" style={{ fontSize: '0.875rem' }}>Đang nạp APAG...</div>
          </div>
        }>
          <Routes>
            {/* Public Authentication Route */}
            <Route path="/login" element={<Login />} />
            <Route path="/pages/login.html" element={<Navigate to="/login" replace />} />

          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Authenticated Application Shell */}
          <Route element={<AppLayout />}>
            {/* Student Module */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/progress" element={<StudentProgress />} />
            <Route path="/student/curriculum" element={<StudentCurriculum />} />
            <Route path="/student/grades" element={<StudentGrades />} />
            <Route path="/student/learning-path" element={<StudentLearningPath />} />
            <Route path="/student/timetable" element={<StudentTimetable />} />
            <Route path="/student/alerts" element={<StudentAlerts />} />
            <Route path="/student/ai-assistant" element={<StudentAiAssistant />} />
            <Route path="/student/notifications" element={<StudentNotifications />} />
            <Route path="/student/settings" element={<StudentSettings />} />

            {/* Advisor Module */}
            <Route path="/advisor/dashboard" element={<AdvisorDashboard />} />
            <Route path="/advisor/students" element={<AdvisorStudents />} />
            <Route path="/advisor/student-detail" element={<AdvisorStudentDetail />} />
            <Route path="/advisor/progress" element={<AdvisorProgress />} />
            <Route path="/advisor/learning-paths" element={<AdvisorLearningPaths />} />
            <Route path="/advisor/alerts" element={<AdvisorAlerts />} />
            <Route path="/advisor/reports" element={<AdvisorReports />} />
            <Route path="/advisor/ai-assistant" element={<AdvisorAiAssistant />} />
            <Route path="/advisor/notifications" element={<AdvisorNotifications />} />
            <Route path="/advisor/settings" element={<AdvisorSettings />} />

            {/* Admin Module */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/curriculum" element={<AdminCurriculum />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/knowledge-base" element={<AdminKnowledgeBase />} />
            <Route path="/admin/regulations" element={<AdminRegulations />} />
            <Route path="/admin/ai-agent" element={<AdminAiAgent />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/system" element={<AdminSystem />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* Legacy HTML Aliases for backwards compatibility */}
            <Route path="/pages/student/dashboard.html" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="/pages/student/profile.html" element={<Navigate to="/student/profile" replace />} />
            <Route path="/pages/student/progress.html" element={<Navigate to="/student/progress" replace />} />
            <Route path="/pages/student/curriculum.html" element={<Navigate to="/student/curriculum" replace />} />
            <Route path="/pages/student/grades.html" element={<Navigate to="/student/grades" replace />} />
            <Route path="/pages/student/learning-path.html" element={<Navigate to="/student/learning-path" replace />} />
            <Route path="/pages/student/alerts.html" element={<Navigate to="/student/alerts" replace />} />
            <Route path="/pages/student/ai-assistant.html" element={<Navigate to="/student/ai-assistant" replace />} />
            <Route path="/pages/student/notifications.html" element={<Navigate to="/student/notifications" replace />} />
            <Route path="/pages/student/settings.html" element={<Navigate to="/student/settings" replace />} />

            <Route path="/pages/advisor/dashboard.html" element={<Navigate to="/advisor/dashboard" replace />} />
            <Route path="/pages/advisor/students.html" element={<Navigate to="/advisor/students" replace />} />
            <Route path="/pages/advisor/student-detail.html" element={<Navigate to="/advisor/student-detail" replace />} />
            <Route path="/pages/advisor/progress.html" element={<Navigate to="/advisor/progress" replace />} />
            <Route path="/pages/advisor/learning-paths.html" element={<Navigate to="/advisor/learning-paths" replace />} />
            <Route path="/pages/advisor/alerts.html" element={<Navigate to="/advisor/alerts" replace />} />
            <Route path="/pages/advisor/reports.html" element={<Navigate to="/advisor/reports" replace />} />
            <Route path="/pages/advisor/ai-assistant.html" element={<Navigate to="/advisor/ai-assistant" replace />} />
            <Route path="/pages/advisor/notifications.html" element={<Navigate to="/advisor/notifications" replace />} />
            <Route path="/pages/advisor/settings.html" element={<Navigate to="/advisor/settings" replace />} />

            <Route path="/pages/admin/dashboard.html" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/pages/admin/students.html" element={<Navigate to="/admin/students" replace />} />
            <Route path="/pages/admin/courses.html" element={<Navigate to="/admin/courses" replace />} />
            <Route path="/pages/admin/curriculum.html" element={<Navigate to="/admin/curriculum" replace />} />
            <Route path="/pages/admin/users.html" element={<Navigate to="/admin/users" replace />} />
            <Route path="/pages/admin/knowledge-base.html" element={<Navigate to="/admin/knowledge-base" replace />} />
            <Route path="/pages/admin/regulations.html" element={<Navigate to="/admin/regulations" replace />} />
            <Route path="/pages/admin/ai-agent.html" element={<Navigate to="/admin/ai-agent" replace />} />
            <Route path="/pages/admin/reports.html" element={<Navigate to="/admin/reports" replace />} />
            <Route path="/pages/admin/system.html" element={<Navigate to="/admin/system" replace />} />
            <Route path="/pages/admin/settings.html" element={<Navigate to="/admin/settings" replace />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
