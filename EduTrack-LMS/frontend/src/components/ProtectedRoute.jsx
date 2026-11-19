
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

function ProtectedRoute({ children, allowedRole }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    const correctDashboard =
      user.role === 'ADMIN'
        ? '/admin-dashboard'
        : '/student-dashboard';

    return <Navigate to={correctDashboard} replace />;
  }

  return children;
}

export default ProtectedRoute;
