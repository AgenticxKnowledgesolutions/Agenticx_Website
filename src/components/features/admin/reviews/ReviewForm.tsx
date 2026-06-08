import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getReviewById, createReview, updateReview } from '@/services/reviewsService';
import FileUploader from '@/components/admin/FileUploader';
import { useToast } from '@/components/ui/Toast';
import { useAdminStore } from '@/services/adminStore';
import '../Admin.css';

interface ReviewFormProps {
  mode: 'create' | 'edit';
  reviewId?: string;
}

export default function ReviewForm({ mode, reviewId }: ReviewFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(mode === 'edit');
  const [isDirty, setIsDirty] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState('');
  const [source, setSource] = useState<'google' | 'internal'>('internal');
  const [isFeatured, setIsFeatured] = useState(false);

  // Load Review data in Edit mode
  useEffect(() => {
    if (mode === 'edit' && reviewId) {
      const loadReview = async () => {
        try {
          const rev = await getReviewById(reviewId);
          if (rev) {
            setName(rev.name);
            setRating(rev.rating || 5);
            setReviewText(rev.review);
            setRole(rev.role || '');
            setImage(rev.image || '');
            setSource(rev.source || 'internal');
            // Assuming default is_featured in model
            setIsFeatured(true); // default to edit featured
          } else {
            toast('Review not found', 'error');
            navigate('/admin/reviews');
          }
        } catch (err) {
          console.error(err);
          toast('Failed to load review details', 'error');
        } finally {
          setFetching(false);
        }
      };
      loadReview();
    }
  }, [mode, reviewId, navigate, toast]);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      rating,
      review: reviewText,
      role: role || null,
      image_url: image || null,
      source,
      is_featured: isFeatured
    };

    const { invalidateReviews } = useAdminStore.getState();
    try {
      if (mode === 'create') {
        const success = await createReview(payload);
        if (success) {
          toast('Review published successfully!', 'success');
          invalidateReviews();
          setIsDirty(false);
          navigate('/admin/reviews');
        } else {
          toast('Failed to publish review.', 'error');
        }
      } else if (mode === 'edit' && reviewId) {
        const success = await updateReview(reviewId, payload);
        if (success) {
          toast('Review updated successfully!', 'success');
          invalidateReviews();
          setIsDirty(false);
          navigate('/admin/reviews');
        } else {
          toast('Failed to update review.', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      toast('Operation failed. Please verify fields and try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="admin-page" style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <div className="admin-loading-spinner" />
      </div>
    );
  }

  return (
    <div className="admin-kpi-card glass-panel" style={{ maxWidth: '600px', margin: '0 auto', display: 'block', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#001943' }}>
          {mode === 'create' ? 'Create New Testimonial' : 'Edit Testimonial Details'}
        </h3>
        <button 
          onClick={() => {
            if (!isDirty || window.confirm('Discard unsaved changes?')) {
              setIsDirty(false);
              navigate('/admin/reviews');
            }
          }} 
          className="admin-back-btn" 
          style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-login-form">
        <div className="admin-form-group">
          <label>Reviewer Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => { setName(e.target.value); setIsDirty(true); }} 
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
            onChange={e => { setRole(e.target.value); setIsDirty(true); }} 
            placeholder="ML Platform Engineer at Amazon" 
            style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
          />
        </div>

        <FileUploader 
          label="Reviewer Profile Image" 
          folder="reviews" 
          type="image" 
          currentValue={image} 
          onUploadSuccess={url => { setImage(url); setIsDirty(true); }}
          onRemove={() => { setImage(''); setIsDirty(true); }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
          <div className="admin-form-group">
            <label>Review Source origin</label>
            <select value={source} onChange={e => { setSource(e.target.value as 'google' | 'internal'); setIsDirty(true); }} style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '40px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}>
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
                  onClick={() => { setRating(star); setIsDirty(true); }}
                >
                  star
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
          <input 
            type="checkbox" 
            checked={isFeatured} 
            onChange={e => { setIsFeatured(e.target.checked); setIsDirty(true); }} 
            style={{ width: 'auto' }} 
            id="featuredToggle" 
          />
          <label htmlFor="featuredToggle" style={{ margin: 0, color: '#001943', cursor: 'pointer' }}>Featured Review (shows on homepage)?</label>
        </div>

        <div className="admin-form-group" style={{ marginTop: '10px' }}>
          <label>Review Content Text</label>
          <textarea 
            value={reviewText} 
            onChange={e => { setReviewText(e.target.value); setIsDirty(true); }} 
            required 
            placeholder="The hands-on curriculum on multi-agent systems..." 
            style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', minHeight: '80px', borderRadius: '8px', padding: '10px', outline: 'none' }}
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="activity-book-btn" 
          style={{ marginTop: '20px', borderRadius: '8px', width: '100%', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {loading && <div className="admin-loading-spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />}
          {mode === 'create' ? 'Create & Publish Review' : 'Save Testimonial Changes'}
        </button>
      </form>
    </div>
  );
}
