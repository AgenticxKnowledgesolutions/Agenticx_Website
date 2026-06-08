import { useEffect, useState } from 'react';
import { type Activity, getActivities } from '@/services/activityService';
import NeuralCanvas from '@/components/ui/NeuralCanvas';
import './LiveActivities.css';

export default function LiveActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const data = await getActivities();
      setActivities(data);
    };
    fetchActivities();
  }, []);

  if (activities.length === 0) return null;

  return (
    <section className="live-activities-section">
      <NeuralCanvas />
      
      <div className="live-activities-content">
        <div className="container">
          <div className="live-activities-header">
            <h2 className="live-activities-title">Live Activities & Events</h2>
            <p className="live-activities-subtitle">
              Join our expert-led webinars, interactive workshops, and intensive bootcamps to accelerate your career.
            </p>
          </div>

          <div className="live-activities-container">
            {activities.map((activity) => (
              <div className="activity-card" key={activity.id}>
                <div className="activity-image-wrapper">
                  {activity.image ? (
                    <img src={activity.image} alt={activity.title} className="activity-image" loading="lazy" />
                  ) : (
                    <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, #0f172a, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>event</span>
                    </div>
                  )}
                  {activity.isFree ? (
                    <span className="activity-badge free">FREE</span>
                  ) : (
                    <span className="activity-badge paid">
                      {activity.price ? `₹${Number(activity.price)}` : 'FREE'}
                    </span>
                  )}
                </div>
                
                <div className="activity-content">
                  <h3 className="activity-title">{activity.title || 'Untitled Activity'}</h3>
                  <p className="activity-desc">
                    {activity.description || 'Join us for this exciting live interactive event organized by AgenticX.'}
                  </p>
                  
                  <div className="activity-meta">
                    <span className="material-symbols-outlined activity-meta-icon">schedule</span>
                    <span>{activity.duration || 'TBD'}</span>
                  </div>
                  
                  <div className="activity-footer">
                    <button className="activity-book-btn">
                      Book Now <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
