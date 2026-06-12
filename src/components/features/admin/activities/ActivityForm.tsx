import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivityById, createActivity, updateActivity } from '@/services/activityService';
import FileUploader from '@/components/admin/FileUploader';
import { useToast } from '@/components/ui/Toast';
import { useAdminStore } from '@/services/adminStore';
import '../Admin.css';

interface ActivityFormProps {
  mode: 'create' | 'edit';
  activityId?: string;
}

export default function ActivityForm({ mode, activityId }: ActivityFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(mode === 'edit');
  const [isDirty, setIsDirty] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [isFree, setIsFree] = useState(true);
  const [registrationUrl, setRegistrationUrl] = useState('');

  // Load Activity data in Edit mode
  useEffect(() => {
    if (mode === 'edit' && activityId) {
      const loadActivity = async () => {
        try {
          const act = await getActivityById(activityId);
          if (act) {
            setTitle(act.title);
            setDescription(act.description || '');
            setImage(act.image || '');
            setDuration(act.duration || '');
            setIsFree(act.isFree);
            setPrice(act.price !== undefined ? act.price : '');
            setRegistrationUrl(act.registrationUrl || '');
          } else {
            toast('Activity not found', 'error');
            navigate('/admin/activities');
          }
        } catch (err) {
          console.error(err);
          toast('Failed to load activity details', 'error');
        } finally {
          setFetching(false);
        }
      };
      loadActivity();
    }
  }, [mode, activityId, navigate, toast]);

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

    if (registrationUrl && !/^https?:\/\/.+/i.test(registrationUrl)) {
      toast('Please enter a valid Registration Form URL starting with http:// or https://', 'error');
      setLoading(false);
      return;
    }

    const payload = {
      title,
      description: description || null,
      image_url: image || null,
      duration,
      is_free: isFree,
      price: isFree ? null : Number(price),
      registration_url: registrationUrl || null
    };

    const { invalidateActivities } = useAdminStore.getState();
    try {
      if (mode === 'create') {
        const success = await createActivity(payload);
        if (success) {
          toast('Activity published successfully!', 'success');
          invalidateActivities();
          setIsDirty(false);
          navigate('/admin/activities');
        } else {
          toast('Failed to publish activity.', 'error');
        }
      } else if (mode === 'edit' && activityId) {
        const success = await updateActivity(activityId, payload);
        if (success) {
          toast('Activity updated successfully!', 'success');
          invalidateActivities();
          setIsDirty(false);
          navigate('/admin/activities');
        } else {
          toast('Failed to update activity.', 'error');
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
          {mode === 'create' ? 'Create New Activity / Event' : 'Edit Activity / Event Details'}
        </h3>
        <button 
          onClick={() => {
            if (!isDirty || window.confirm('Discard unsaved changes?')) {
              setIsDirty(false);
              navigate('/admin/activities');
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
          <label>Activity Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={e => { setTitle(e.target.value); setIsDirty(true); }} 
            required 
            placeholder="e.g. Next.js 15 & Server Components Deep Dive" 
            style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
          />
        </div>

        <div className="admin-form-group">
          <label>Event Description</label>
          <textarea 
            value={description} 
            onChange={e => { setDescription(e.target.value); setIsDirty(true); }} 
            required 
            placeholder="Provide a detailed description of what attendees will learn in this session..." 
            style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', minHeight: '80px', borderRadius: '8px', padding: '10px', outline: 'none' }}
          ></textarea>
        </div>

        <FileUploader 
          label="Upload Activity Banner" 
          folder="activities/banners" 
          type="image" 
          currentValue={image} 
          onUploadSuccess={url => { setImage(url); setIsDirty(true); }}
          onRemove={() => { setImage(''); setIsDirty(true); }}
        />

        <div className="admin-form-group" style={{ marginTop: '16px' }}>
          <label>Session Duration</label>
          <input 
            type="text" 
            value={duration} 
            onChange={e => { setDuration(e.target.value); setIsDirty(true); }} 
            required 
            placeholder="2 Hours Live Masterclass" 
            style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
          />
        </div>

        <div className="admin-form-group">
          <label>Registration Form URL</label>
          <input 
            type="text" 
            value={registrationUrl} 
            onChange={e => { setRegistrationUrl(e.target.value); setIsDirty(true); }} 
            placeholder="https://forms.google.com/..." 
            style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
          />
        </div>

        <div className="admin-form-row" style={{ alignItems: 'center' }}>
          <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
            <input 
              type="checkbox" 
              checked={isFree} 
              onChange={e => { setIsFree(e.target.checked); setIsDirty(true); }} 
              style={{ width: 'auto' }} 
              id="freeToggle" 
            />
            <label htmlFor="freeToggle" style={{ margin: 0, color: '#001943', cursor: 'pointer' }}>Free Event?</label>
          </div>

          {!isFree && (
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Registration Ticket Price (₹)</label>
              <input 
                type="number" 
                value={price} 
                onChange={e => { setPrice(e.target.value === '' ? '' : Number(e.target.value)); setIsDirty(true); }} 
                required 
                placeholder="49.00" 
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
              />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="activity-book-btn" 
          style={{ marginTop: '20px', borderRadius: '8px', width: '100%', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {loading && <div className="admin-loading-spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />}
          {mode === 'create' ? 'Publish Event' : 'Save Event Changes'}
        </button>
      </form>
    </div>
  );
}
