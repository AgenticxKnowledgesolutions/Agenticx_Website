import { useState, useEffect } from 'react';
import { type Activity, getActivities, saveActivities } from '@/services/activityService';
import './Admin.css';

export default function ActivitiesAdmin() {
  const [activities, setActivities] = useState<Activity[]>([]);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [isFree, setIsFree] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      const data = await getActivities();
      setActivities(data);
    };
    loadActivities();
  }, []);

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newActivity: Activity = {
      id: Date.now().toString(),
      title,
      description,
      image: image || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80",
      duration,
      isFree,
      price: isFree ? undefined : Number(price)
    };

    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    await saveActivities(updatedActivities);

    // Reset form
    setTitle('');
    setDescription('');
    setImage('');
    setDuration('');
    setPrice('');
    setIsFree(true);
  };

  const handleDelete = async (id: string) => {
    const updatedActivities = activities.filter(a => a.id !== id);
    setActivities(updatedActivities);
    await saveActivities(updatedActivities);
  };

  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Manage Activities</h1>
        <p className="admin-page-subtitle">Add, edit or remove live webinars, events, and workshops.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
        
        {/* ADD ACTIVITY FORM */}
        <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', color: '#001943' }}>[ + Add Activity ]</h3>
          
          <form onSubmit={handleAddActivity} className="admin-login-form">
            <div className="admin-form-group">
              <label>Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. AI Webinar" style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} />
            </div>

            <div className="admin-form-group">
              <label>Description</label>
              <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} />
            </div>

            <div className="admin-form-group">
              <label>Image URL</label>
              <input type="text" value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} />
            </div>

            <div className="admin-form-group">
              <label>Duration</label>
              <input type="text" value={duration} onChange={e => setDuration(e.target.value)} required placeholder="e.g. 2 hrs" style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} />
            </div>

            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)} style={{ width: 'auto' }} id="freeToggle" />
              <label htmlFor="freeToggle" style={{ margin: 0, color: '#001943', cursor: 'pointer' }}>Is Free Activity?</label>
            </div>

            {!isFree && (
              <div className="admin-form-group">
                <label>Price (₹)</label>
                <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required placeholder="499" style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} />
              </div>
            )}

            <button type="submit" className="activity-book-btn" style={{ marginTop: '10px', borderRadius: '8px' }}>Add Activity</button>
          </form>
        </div>

        {/* ACTIVITIES LIST */}
        <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', color: '#001943' }}>Active Events</h3>
          
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
