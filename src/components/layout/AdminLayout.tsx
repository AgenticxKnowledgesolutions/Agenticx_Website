import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../features/admin/Admin.css';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="admin-layout">
      {/* Mobile Overlay */}
      {isSidebarOpen && <div className="admin-sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">AgenticX Admin</div>
          <button className="admin-close-btn" onClick={closeSidebar}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" onClick={closeSidebar} className={({isActive}) => isActive ? "admin-nav-link active" : "admin-nav-link"}>
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
              <NavLink to="/admin/courses" onClick={closeSidebar} end className={({isActive}) => isActive ? "admin-sub-link active" : "admin-sub-link"}>
                View Courses
              </NavLink>
              <NavLink to="/admin/courses/add" onClick={closeSidebar} className={({isActive}) => isActive ? "admin-sub-link active" : "admin-sub-link"}>
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
              <NavLink to="/admin/activities" onClick={closeSidebar} end className={({isActive}) => isActive ? "admin-sub-link active" : "admin-sub-link"}>
                View Activities
              </NavLink>
              <NavLink to="/admin/activities/add" onClick={closeSidebar} className={({isActive}) => isActive ? "admin-sub-link active" : "admin-sub-link"}>
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
              <NavLink to="/admin/reviews" onClick={closeSidebar} end className={({isActive}) => isActive ? "admin-sub-link active" : "admin-sub-link"}>
                View Reviews
              </NavLink>
              <NavLink to="/admin/reviews/add" onClick={closeSidebar} className={({isActive}) => isActive ? "admin-sub-link active" : "admin-sub-link"}>
                Add Review
              </NavLink>
            </div>
          </div>

          <NavLink to="/admin/leads" onClick={closeSidebar} className={({isActive}) => isActive ? "admin-nav-link active" : "admin-nav-link"}>
            <span className="material-symbols-outlined">leaderboard</span> Leads
          </NavLink>
          <NavLink to="/admin/content" onClick={closeSidebar} className={({isActive}) => isActive ? "admin-nav-link active" : "admin-nav-link"}>
            <span className="material-symbols-outlined">description</span> Content
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Top Navbar for Mobile/Hamburger */}
        <header className="admin-topbar">
          <button className="admin-menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="admin-topbar-profile">
            <span className="material-symbols-outlined">account_circle</span>
          </div>
        </header>

        <div className="admin-content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
