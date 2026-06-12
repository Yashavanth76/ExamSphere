import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Auth Layout Views
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

// Core Student Workflow Workspace Views
import StudentDashboard from './pages/StudentDashboard/StudentDashboard';
import LiveExam from './pages/LiveExam/LiveExam';
import ResultPage from './pages/ResultPage/ResultPage';

// Shared Profile View (We will build this component next!)
import Profile from './pages/Profile/Profile';

// Teacher & Admin Panels (Placeholders to prevent loading layout crashes)
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default Path Route Initialization Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Public Authentication Node Branches */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Dedicated Student Engine Portals */}
          <Route path="/StudentDashboard" element={<StudentDashboard />} />
          <Route path="/LiveExam" element={<LiveExam />} />
          <Route path="/ResultPage" element={<ResultPage />} />
          
          {/* Shared Common Resource Context Routers */}
          <Route path="/Profile" element={<Profile />} />
          
          {/* Academic Staff & Management Administrative Workspaces */}
          <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          
          {/* Global Catch-All Invalid Route Failback Safety Guard */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}