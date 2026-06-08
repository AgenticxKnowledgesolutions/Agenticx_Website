import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../features/admin/Admin.css';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Component */}
      <main className="admin-main">
        {/* Navbar Component */}
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="admin-content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
