import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { AdminSkeleton } from '../components/ui/Skeletons';

export default function ProtectedRoute() {
  const { isAuthenticated, user, isInitialized, clearAuth } = useAuthStore();

  // Show a premium loading state while verifying tokens or refreshing session
  if (!isInitialized) {
    return <AdminSkeleton />;
  }

  // Strictly check authentication and role-based access control (RBAC)
  if (!isAuthenticated || !user || user.role !== 'admin') {
    clearAuth();
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
