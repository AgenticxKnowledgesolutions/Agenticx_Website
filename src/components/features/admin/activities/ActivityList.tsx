import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Activity, getActivities, saveActivities } from '@/services/activityService';
import '../Admin.css';

export default function ActivityList() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadActivities = async () => {
      const data = await getActivities();
      setActivities(data);
    };
    loadActivities();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      const updatedActivities = activities.filter(a => a.id !== id);
      setActivities(updatedActivities);
      await saveActivities(updatedActivities);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Active Events & Webinars</h1>
        <p className="admin-page-subtitle">Inspect, moderate, or remove scheduled live seminar sessions.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => navigate('/admin/activities/add')} className="activity-book-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span> Add New Activity
          </button>
        </div>

        <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', color: '#001943' }}>Scheduled Seminars</h3>

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
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No activities found.</td>
                </tr>
              ) : (
                activities.map(act => (
                  <tr key={act.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 8px', fontWeight: 500, color: '#001943' }}>{act.title}</td>
                    <td style={{ padding: '16px 8px', color: '#64748b' }}>{act.duration}</td>
                    <td style={{ padding: '16px 8px' }}>
                      {act.isFree ? (
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>FREE</span>
                      ) : (
                        <span style={{ color: '#001943', fontWeight: 600 }}>₹{act.price}</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDelete(act.id)}
                        style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
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
