import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlacedStudentById, createPlacedStudent, updatePlacedStudent } from '@/services/placedStudentService';
import FileUploader from '@/components/admin/FileUploader';
import { useToast } from '@/components/ui/Toast';
import '../Admin.css';

interface PlacedStudentFormProps {
  mode: 'create' | 'edit';
  studentId?: string;
}

export default function PlacedStudentForm({ mode, studentId }: PlacedStudentFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(mode === 'edit');
  const [isDirty, setIsDirty] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [photo, setPhoto] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Load student data in Edit mode
  useEffect(() => {
    if (mode === 'edit' && studentId) {
      const loadStudent = async () => {
        try {
          const student = await getPlacedStudentById(studentId);
          if (student) {
            setName(student.name);
            setCompanyName(student.companyName);
            setRole(student.role);
            setPhoto(student.photo);
            setDisplayOrder(student.displayOrder ?? 0);
            setIsActive(student.isActive);
          } else {
            toast('Placed student record not found', 'error');
            navigate('/admin/placed-students');
          }
        } catch (err) {
          console.error(err);
          toast('Failed to load student details', 'error');
        } finally {
          setFetching(false);
        }
      };
      loadStudent();
    }
  }, [mode, studentId, navigate, toast]);

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
    if (!name.trim()) {
      toast('Student Name is required', 'error');
      return;
    }
    if (!companyName.trim()) {
      toast('Company Name is required', 'error');
      return;
    }
    if (!role.trim()) {
      toast('Job Role is required', 'error');
      return;
    }
    if (!photo) {
      toast('Please upload a student photo.', 'error');
      return;
    }
    setLoading(true);

    const payload = {
      name,
      companyName,
      role,
      photo,
      displayOrder: Number(displayOrder),
      isActive
    };

    try {
      if (mode === 'create') {
        const success = await createPlacedStudent(payload);
        if (success) {
          toast('Placed student created successfully!', 'success');
          setIsDirty(false);
          navigate('/admin/placed-students');
        } else {
          toast('Failed to create placed student.', 'error');
        }
      } else if (mode === 'edit' && studentId) {
        const success = await updatePlacedStudent(studentId, payload);
        if (success) {
          toast('Placed student updated successfully!', 'success');
          setIsDirty(false);
          navigate('/admin/placed-students');
        } else {
          toast('Failed to update placed student.', 'error');
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
          {mode === 'create' ? 'Add Placed Student' : 'Edit Placed Student Details'}
        </h3>
        <button 
          type="button"
          onClick={() => {
            if (!isDirty || window.confirm('Discard unsaved changes?')) {
              setIsDirty(false);
              navigate('/admin/placed-students');
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
          <label>Student Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => { setName(e.target.value); setIsDirty(true); }} 
            required 
            placeholder="e.g. Arjun Kumar" 
            style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
          />
        </div>

        <div className="admin-form-group">
          <label>Company Name</label>
          <input 
            type="text" 
            value={companyName} 
            onChange={e => { setCompanyName(e.target.value); setIsDirty(true); }} 
            required 
            placeholder="e.g. KeyValue Software Systems" 
            style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
          />
        </div>

        <div className="admin-form-group">
          <label>Job Role</label>
          <input 
            type="text" 
            value={role} 
            onChange={e => { setRole(e.target.value); setIsDirty(true); }} 
            required 
            placeholder="e.g. AI Engineer" 
            style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
          />
        </div>

        <FileUploader 
          label="Student Photo" 
          folder="placed_students" 
          type="image" 
          currentValue={photo} 
          onUploadSuccess={url => { setPhoto(url); setIsDirty(true); }}
          onRemove={() => { setPhoto(''); setIsDirty(true); }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
          <div className="admin-form-group">
            <label>Display Order</label>
            <input 
              type="number" 
              value={displayOrder} 
              onChange={e => { setDisplayOrder(Number(e.target.value)); setIsDirty(true); }} 
              required 
              min={0}
              placeholder="e.g. 1" 
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
            />
          </div>

          <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
            <input 
              type="checkbox" 
              checked={isActive} 
              onChange={e => { setIsActive(e.target.checked); setIsDirty(true); }} 
              style={{ width: 'auto' }} 
              id="activeToggle" 
            />
            <label htmlFor="activeToggle" style={{ margin: 0, color: '#001943', cursor: 'pointer' }}>Active (shows on site)?</label>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="activity-book-btn" 
          style={{ marginTop: '30px', borderRadius: '8px', width: '100%', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {loading && <div className="admin-loading-spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />}
          {mode === 'create' ? 'Create Placed Student' : 'Save Student Changes'}
        </button>
      </form>
    </div>
  );
}
