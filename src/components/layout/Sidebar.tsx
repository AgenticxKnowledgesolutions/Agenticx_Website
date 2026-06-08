import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isActivitiesOpen, setIsActivitiesOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_refresh_token");
    navigate("/admin/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="admin-sidebar-overlay" 
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 999
          }}
        />
      )}

      {/* Sidebar aside */}
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">AgenticX Admin</div>
          <button className="admin-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="admin-nav">
          <NavLink 
            to="/admin/dashboard" 
            onClick={onClose} 
            className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}
          >
            <span className="material-symbols-outlined">dashboard</span> Dashboard
          </NavLink>

          {/* Courses Collapsible Group */}
          <div className="admin-nav-group">
            <button className="admin-nav-link dropdown-toggle" onClick={() => setIsCoursesOpen(!isCoursesOpen)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined">school</span> Courses
              </div>
              <span className={`material-symbols-outlined chevron ${isCoursesOpen ? 'rotated' : ''}`}>expand_more</span>
            </button>
            <div className={`admin-submenu ${isCoursesOpen ? 'open' : ''}`}>
              <NavLink 
                to="/admin/courses" 
                onClick={onClose} 
                end 
                className={({ isActive }) => isActive ? "admin-sub-link active" : "admin-sub-link"}
              >
                View Courses
              </NavLink>
              <NavLink 
                to="/admin/courses/add" 
                onClick={onClose} 
                className={({ isActive }) => isActive ? "admin-sub-link active" : "admin-sub-link"}
              >
                Add Course
              </NavLink>
            </div>
          </div>

          {/* Activities Collapsible Group */}
          <div className="admin-nav-group">
            <button className="admin-nav-link dropdown-toggle" onClick={() => setIsActivitiesOpen(!isActivitiesOpen)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined">event</span> Activities
              </div>
              <span className={`material-symbols-outlined chevron ${isActivitiesOpen ? 'rotated' : ''}`}>expand_more</span>
            </button>
            <div className={`admin-submenu ${isActivitiesOpen ? 'open' : ''}`}>
              <NavLink 
                to="/admin/activities" 
                onClick={onClose} 
                end 
                className={({ isActive }) => isActive ? "admin-sub-link active" : "admin-sub-link"}
              >
                View Activities
              </NavLink>
              <NavLink 
                to="/admin/activities/add" 
                onClick={onClose} 
                className={({ isActive }) => isActive ? "admin-sub-link active" : "admin-sub-link"}
              >
                Add Activity
              </NavLink>
            </div>
          </div>

          {/* Reviews Collapsible Group */}
          <div className="admin-nav-group">
            <button className="admin-nav-link dropdown-toggle" onClick={() => setIsReviewsOpen(!isReviewsOpen)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined">star</span> Reviews
              </div>
              <span className={`material-symbols-outlined chevron ${isReviewsOpen ? 'rotated' : ''}`}>expand_more</span>
            </button>
            <div className={`admin-submenu ${isReviewsOpen ? 'open' : ''}`}>
              <NavLink 
                to="/admin/reviews" 
                onClick={onClose} 
                end 
                className={({ isActive }) => isActive ? "admin-sub-link active" : "admin-sub-link"}
              >
                View Reviews
              </NavLink>
              <NavLink 
                to="/admin/reviews/add" 
                onClick={onClose} 
                className={({ isActive }) => isActive ? "admin-sub-link active" : "admin-sub-link"}
              >
                Add Review
              </NavLink>
            </div>
          </div>

          <NavLink 
            to="/admin/leads" 
            onClick={onClose} 
            className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}
          >
            <span className="material-symbols-outlined">leaderboard</span> Leads
          </NavLink>
          
          <NavLink 
            to="/admin/settings" 
            onClick={onClose} 
            className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}
          >
            <span className="material-symbols-outlined">settings</span> Company Settings
          </NavLink>

          <button className="admin-logout-btn" onClick={handleLogout} style={{ marginTop: '16px' }}>
            <span className="material-symbols-outlined">logout</span> Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
