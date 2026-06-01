import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Review } from '@/types/review';
import { saveReviews } from '@/services/reviewsService';
import '../Admin.css';

export default function ReviewAdd() {
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState('');
  const [source, setSource] = useState<'google' | 'internal'>('internal');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();

    // Colorized Avatar Fallback if not uploaded
    const finalImage = image || `https://i.pravatar.cc/150?img=${(name.length % 70) + 1}`;

    const newReview: Review = {
      id: Date.now().toString(),
      name,
      rating,
      review: reviewText,
      role: role || undefined,
      image: finalImage,
      source
    };

    const stored = localStorage.getItem('reviews');
    let fullReviews: Review[] = [];
    if (stored) {
      try {
        fullReviews = JSON.parse(stored);
      } catch (err) {
        fullReviews = [];
      }
    }
    
    const updatedFull = [...fullReviews, newReview];
    await saveReviews(updatedFull);

    navigate('/admin/reviews');
  };

  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Add Testimonial</h1>
        <p className="admin-page-subtitle">Publish a new student review or import external client feedback.</p>
      </div>

      <div className="admin-kpi-card glass-panel" style={{ maxWidth: '600px', margin: '0 auto', display: 'block', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#001943' }}>Create New Testimonial</h3>
          <button onClick={() => navigate('/admin/reviews')} className="admin-back-btn" style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span> Back
          </button>
        </div>

        <form onSubmit={handleAddReview} className="admin-login-form">
          <div className="admin-form-group">
            <label>Reviewer Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              placeholder="Rohan Sharma" 
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
            />
          </div>

          <div className="admin-form-group">
            <label>Role / Professional Title</label>
            <input 
              type="text" 
              value={role} 
              onChange={e => setRole(e.target.value)} 
              placeholder="ML Platform Engineer at Amazon" 
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label>Review Source origin</label>
              <select value={source} onChange={e => setSource(e.target.value as 'google' | 'internal')} style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '40px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}>
                <option value="internal">Website (Internal Form Submission)</option>
                <option value="google">Google Review API Import</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Quality Star Rating</label>
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className="material-symbols-outlined"
                    style={{ color: star <= rating ? '#fbbf24' : '#cbd5e1', fontSize: '28px', fontVariationSettings: "'FILL' 1" }}
                    onClick={() => setRating(star)}
                  >
                    star
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Profile Avatar / Picture Upload</label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ flex: 1, background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', padding: '6px' }} />
              {image && <img src={image} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />}
            </div>
          </div>

          <div className="admin-form-group">
            <label>Review Content Text</label>
            <textarea 
              value={reviewText} 
              onChange={e => setReviewText(e.target.value)} 
              required 
              placeholder="The hands-on curriculum on multi-agent systems and model deployment completely transformed my engineering approach. Highly recommended program!" 
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', minHeight: '80px', borderRadius: '8px', padding: '10px', outline: 'none' }}
            ></textarea>
          </div>

          <button type="submit" className="activity-book-btn" style={{ marginTop: '10px', borderRadius: '8px', width: '100%' }}>Create & Publish Review</button>
        </form>
      </div>
    </div>
  );
}
