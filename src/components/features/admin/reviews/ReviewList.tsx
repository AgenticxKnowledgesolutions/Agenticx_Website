import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteReview } from '@/services/reviewsService';
import { useToast } from '@/components/ui/Toast';
import { useAdminStore } from '@/services/adminStore';
import '../Admin.css';

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    const first = parts[0].charAt(0).toUpperCase();
    const last = parts[parts.length - 1].charAt(0).toUpperCase();
    return `${first}${last}`;
  }
  return parts[0] ? parts[0].charAt(0).toUpperCase() : "";
};

export default function ReviewList() {
  const { reviews, loadingReviews: loading, fetchReviews, invalidateReviews } = useAdminStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadReviews = async (force = false) => {
    try {
      await fetchReviews(force);
    } catch (err) {
      console.error(err);
      toast('Failed to load reviews.', 'error');
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student review from the database permanently?')) {
      const success = await deleteReview(id);
      if (success) {
        toast('Review deleted successfully', 'success');
        invalidateReviews();
        loadReviews(true);
      } else {
        toast('Failed to delete review', 'error');
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Testimonials & Reviews</h1>
        <p className="admin-page-subtitle">Inspect, moderate, or remove student success testimonials showing in the carousel.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => navigate('/admin/reviews/add')} className="activity-book-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span> Add New Review
          </button>
        </div>

        <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', color: '#001943' }}>Active Testimonials</h3>

          <div className="dashboard-table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '12px 8px' }}>Name</th>
                  <th style={{ padding: '12px 8px' }}>Rating</th>
                  <th style={{ padding: '12px 8px' }}>Source</th>
                  <th style={{ padding: '12px 8px' }}>Role</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1, 2, 3].map((item) => (
                    <tr key={item} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '50%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '20%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '20%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '35%' }} /></td>
                      <td style={{ padding: '16px 8px', textAlign: 'right' }}><div className="skeleton-line" style={{ width: '50%', float: 'right' }} /></td>
                    </tr>
                  ))
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No reviews found matching quality pipeline filters.</td>
                  </tr>
                ) : (
                  reviews.map(rev => (
                    <tr key={rev.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 8px', fontWeight: 500, color: '#001943', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#e2e8f0',
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          fontSize: '12px'
                        }}>
                          {getInitials(rev.name)}
                        </div>
                        {rev.name}
                      </td>
                      <td style={{ padding: '16px 8px' }}>
                        <span style={{ color: '#fbbf24', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {rev.rating} <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>star</span>
                        </span>
                      </td>
                      <td style={{ padding: '16px 8px' }}>
                        <span style={{ background: rev.source === 'google' ? '#dbeafe' : '#f3e8ff', color: rev.source === 'google' ? '#1e40af' : '#6b21a8', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {rev.source}
                        </span>
                      </td>
                      <td style={{ padding: '16px 8px', color: '#64748b', fontSize: '13px' }}>{rev.role || 'Student'}</td>
                      <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => navigate(`/admin/reviews/edit/${rev.id}`)}
                            style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(rev.id)}
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
    </div>
  );
}
