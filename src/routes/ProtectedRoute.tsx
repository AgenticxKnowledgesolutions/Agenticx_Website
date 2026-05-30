import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const isAdmin = localStorage.getItem('isAdmin');
  const token = localStorage.getItem('admin_token');

  if (!isAdmin || !token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
