import './Admin.css';
import { dashboardStats } from '@/data/mockAdminData';
export default function Dashboard() {
  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Admin Dashboard</h1>
        <p className="admin-page-subtitle">Welcome back, Admin</p>
      </div>

      <div className="admin-kpi-grid">
        <div className="admin-kpi-card glass-panel">
          <div className="kpi-icon"><span className="material-symbols-outlined">group</span></div>
          <div className="kpi-content">
            <h3>Total Students</h3>
            <p className="kpi-value">{dashboardStats.totalStudents.toLocaleString()}</p>
          </div>
        </div>

        <div className="admin-kpi-card glass-panel">
          <div className="kpi-icon"><span className="material-symbols-outlined">library_books</span></div>
          <div className="kpi-content">
            <h3>Total Courses</h3>
            <p className="kpi-value">{dashboardStats.totalCourses.toLocaleString()}</p>
          </div>
        </div>

        <div className="admin-kpi-card glass-panel">
          <div className="kpi-icon"><span className="material-symbols-outlined">trending_up</span></div>
          <div className="kpi-content">
            <h3>Leads</h3>
            <p className="kpi-value">{dashboardStats.leads.toLocaleString()}</p>
          </div>
        </div>

        <div className="admin-kpi-card glass-panel">
          <div className="kpi-icon"><span className="material-symbols-outlined">reviews</span></div>
          <div className="kpi-content">
            <h3>Reviews</h3>
            <p className="kpi-value">{dashboardStats.reviews}/5</p>
          </div>
        </div>
      </div>
    </div>
  );
}
