import { useEffect, useState } from 'react';
import { type Activity, getActivities } from '@/services/activityService';
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
                <img src={activity.image} alt={activity.title} className="activity-image" loading="lazy" />
                {activity.isFree ? (
                  <span className="activity-badge free">FREE</span>
                ) : (
                  <span className="activity-badge paid">₹{activity.price}</span>
                )}
              </div>
              
              <div className="activity-content">
                <h3 className="activity-title">{activity.title}</h3>
                {activity.description && <p className="activity-desc">{activity.description}</p>}
                
                <div className="activity-meta">
                  <span className="material-symbols-outlined activity-meta-icon">schedule</span>
                  <span>{activity.duration}</span>
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
    </section>
  );
}
