import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const isAdmin = localStorage.getItem('isAdmin');

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
