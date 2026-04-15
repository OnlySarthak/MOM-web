import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { dashboardForRole } from './auth.js';

/**
 * Layout-route guard. If not authenticated → /login.
 * If authenticated but wrong role → redirect to correct dashboard.
 * Renders <Outlet /> for nested routes when access is granted.
 */
export default function ProtectedRoute({ allowedRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={dashboardForRole(user.role)} replace />;
  }

  return <Outlet />;
}
