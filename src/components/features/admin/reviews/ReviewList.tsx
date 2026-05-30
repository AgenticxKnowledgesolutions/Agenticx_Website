import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Review } from '@/types/review';
import { getReviews, saveReviews } from '@/services/reviewsService';
import '../Admin.css';

export default function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadReviews = async () => {
      const data = await getReviews();
      setReviews(data);
    };
    loadReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      const stored = localStorage.getItem('reviews');
      let fullReviews: Review[] = [];
      if (stored) {
        try {
          fullReviews = JSON.parse(stored);
        } catch (err) {
          fullReviews = [];
        }
      }
      const updatedFull = fullReviews.filter(r => r.id !== id);
      await saveReviews(updatedFull);

      const sortedFiltered = await getReviews();
      setReviews(sortedFiltered);
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
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No reviews found matching quality pipeline filters.</td>
                </tr>
              ) : (
                reviews.map(rev => (
                  <tr key={rev.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 8px', fontWeight: 500, color: '#001943', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={rev.image || `https://i.pravatar.cc/150?img=${rev.name.length}`} alt={rev.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
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
                      <button
                        onClick={() => handleDelete(rev.id)}
                        style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                      >
                        Delete
                      </button>
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
