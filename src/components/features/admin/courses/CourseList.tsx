import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCourse } from '@/services/courseService';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/utils';
import { useAdminStore } from '@/services/adminStore';
import '../Admin.css';

export default function CourseList() {
  const { courses, loadingCourses: loading, fetchCourses, invalidateCourses } = useAdminStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadCourses = async (force = false) => {
    try {
      await fetchCourses(force);
    } catch (err) {
      console.error(err);
      toast('Failed to load courses.', 'error');
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course specialization from the database permanently?')) {
      const success = await deleteCourse(id);
      if (success) {
        toast('Course deleted successfully', 'success');
        invalidateCourses();
        loadCourses(true);
      } else {
        toast('Failed to delete course', 'error');
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Active Courses</h1>
        <p className="admin-page-subtitle">Inspect, edit, or remove academic curriculum offerings from the website.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => navigate('/admin/courses/add')} className="activity-book-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span> Add New Course
          </button>
        </div>

        <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', color: '#001943' }}>Current Catalog</h3>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '12px 8px' }}>Title</th>
                <th style={{ padding: '12px 8px' }}>Duration</th>
                <th style={{ padding: '12px 8px' }}>Price</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map((item) => (
                  <tr key={item} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '60%' }} /></td>
                    <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '30%' }} /></td>
                    <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '20%' }} /></td>
                    <td style={{ padding: '16px 8px', textAlign: 'right' }}><div className="skeleton-line" style={{ width: '40%', float: 'right' }} /></td>
                  </tr>
                ))
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No courses found in database.</td>
                </tr>
              ) : (
                courses.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 8px', fontWeight: 500, color: '#001943' }}>{c.title}</td>
                    <td style={{ padding: '16px 8px', color: '#64748b' }}>{c.stats?.duration || 'N/A'}</td>
                    <td style={{ padding: '16px 8px', color: '#001943', fontWeight: 600 }}>{formatCurrency(c.price)}</td>
                    <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => navigate(`/admin/courses/edit/${c.id}`)}
                          style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
