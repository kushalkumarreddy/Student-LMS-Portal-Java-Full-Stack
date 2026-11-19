
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CourseLearning from './pages/CourseLearning';

import ProtectedRoute from './components/ProtectedRoute';
import { getCurrentUser } from './services/authService';

function HomeRoute() {
  const user = getCurrentUser();

  if (!user) {
    return <Login />;
  }

  return (
    <Navigate
      to={
        user.role === 'ADMIN'
          ? '/admin-dashboard'
          : '/student-dashboard'
      }
      replace
    />
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course-learning"
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <CourseLearning />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
