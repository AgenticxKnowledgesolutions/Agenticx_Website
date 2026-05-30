import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Activity, getActivities, saveActivities } from '@/services/activityService';
import '../Admin.css';

export default function ActivityAdd() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const navigate = useNavigate();

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
    await saveActivities(updatedActivities);

    navigate('/admin/activities');
  };

  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Add Activity</h1>
        <p className="admin-page-subtitle">Schedule a new live seminar, webinar event, or workshop.</p>
      </div>

      <div className="admin-kpi-card glass-panel" style={{ maxWidth: '600px', margin: '0 auto', display: 'block', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#001943' }}>Create New Event</h3>
          <button onClick={() => navigate('/admin/activities')} className="admin-back-btn" style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span> Back
          </button>
        </div>

        <form onSubmit={handleAddActivity} className="admin-login-form">
          <div className="admin-form-group">
            <label>Event Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
              placeholder="Generative AI for Product Managers" 
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
            />
          </div>

          <div className="admin-form-group">
            <label>Event Description</label>
            <input 
              type="text" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Learn to design, evaluate, and launch AI-driven features in modern web platforms." 
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
            />
          </div>

          <div className="admin-form-group">
            <label>Featured Image URL</label>
            <input 
              type="text" 
              value={image} 
              onChange={e => setImage(e.target.value)} 
              placeholder="https://images.unsplash.com/photo-1591453089816-0fbb971b454c" 
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
            />
          </div>

          <div className="admin-form-group">
            <label>Session Duration</label>
            <input 
              type="text" 
              value={duration} 
              onChange={e => setDuration(e.target.value)} 
              required 
              placeholder="2 Hours" 
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
            />
          </div>

          <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)} style={{ width: 'auto' }} id="freeToggle" />
            <label htmlFor="freeToggle" style={{ margin: 0, color: '#001943', cursor: 'pointer' }}>Is this activity free of cost?</label>
          </div>

          {!isFree && (
            <div className="admin-form-group">
              <label>Registration Fee (₹)</label>
              <input 
                type="number" 
                value={price} 
                onChange={e => setPrice(Number(e.target.value))} 
                required 
                placeholder="499" 
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
              />
            </div>
          )}

          <button type="submit" className="activity-book-btn" style={{ marginTop: '10px', borderRadius: '8px', width: '100%' }}>Create Event & Publish</button>
        </form>
      </div>
    </div>
  );
}
