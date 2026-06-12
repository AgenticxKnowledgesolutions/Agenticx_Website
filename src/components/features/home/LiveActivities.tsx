import { useEffect, useState } from 'react';
import { type Activity, getActivities } from '@/services/activityService';
import NeuralCanvas from '@/components/ui/NeuralCanvas';
import { ActivityCardSkeleton } from '@/components/ui/Skeletons';
import { useToast } from '@/components/ui/Toast';
import CollapsibleDescription from '@/components/ui/CollapsibleDescription';
import './LiveActivities.css';

export default function LiveActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getActivities();
        setActivities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  const handleBookNow = (activity: Activity) => {
    if (activity.registrationUrl) {
      window.open(activity.registrationUrl, "_blank", "noopener,noreferrer");
    } else {
      toast("Registration link not available yet.", "info");
    }
  };

  if (loading) {
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
              {Array.from({ length: 3 }).map((_, i) => (
                <ActivityCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

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

          <div className={`live-activities-container ${activities.length === 1 ? 'single-card' : ''}`}>
            {activities.map((activity) => (
              <div className="activity-card" key={activity.id}>
                <div 
                  className="activity-image-wrapper"
                  onClick={() => activity.image && setSelectedImage(activity.image)}
                  style={activity.image ? { cursor: 'pointer' } : undefined}
                >
                  {activity.image ? (
                    <>
                      <img src={activity.image} alt="" className="activity-image-bg" loading="lazy" />
                      <img src={activity.image} alt={activity.title} className="activity-image" loading="lazy" />
                    </>
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
                  
                  <CollapsibleDescription 
                    description={activity.description || 'Join us for this exciting live interactive event organized by AgenticX.'} 
                    textColor="#64748b"
                  />
                  
                  <div className="activity-meta">
                    <span className="material-symbols-outlined activity-meta-icon">schedule</span>
                    <span>{activity.duration || 'TBD'}</span>
                  </div>
                  
                  <div className="activity-footer">
                    <button onClick={() => handleBookNow(activity)} className="activity-book-btn">
                      Book Now <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="image-viewer-modal" onClick={() => setSelectedImage(null)}>
          <button className="image-viewer-close" onClick={() => setSelectedImage(null)}>
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className="image-viewer-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Full view" className="image-viewer-img" />
          </div>
        </div>
      )}
    </section>
  );
}
