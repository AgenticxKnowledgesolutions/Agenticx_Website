import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type TechStack, type CurriculumMonth, getCourseById, createCourse, updateCourse } from '@/services/courseService';
import FileUploader from '@/components/admin/FileUploader';
import { useToast } from '@/components/ui/Toast';
import { useAdminStore } from '@/services/adminStore';
import '../Admin.css';

interface CourseFormProps {
  mode: 'create' | 'edit';
  courseId?: string;
}

export default function CourseForm({ mode, courseId }: CourseFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(mode === 'edit');
  const [isDirty, setIsDirty] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [badge, setBadge] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [duration, setDuration] = useState('');
  const [format, setFormat] = useState('');
  const [projects, setProjects] = useState('');
  const [careerSupport, setCareerSupport] = useState('');
  const [nextCohort, setNextCohort] = useState('');
  const [isAiOptimized, setIsAiOptimized] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [brochureUrl, setBrochureUrl] = useState('');

  // Dynamic Tech Stack inputs (tags)
  const [techStack, setTechStack] = useState<TechStack[]>([]);
  const [techInput, setTechInput] = useState('');

  // Dynamic Curriculum inputs
  const [curriculum, setCurriculum] = useState<CurriculumMonth[]>([
    {
      tabTitle: 'Month 1: Foundations',
      sectionTitle: 'Core Learning & Labs',
      modules: [
        { id: '1', title: 'Getting Started', description: 'Introduction to course core concepts.' }
      ]
    }
  ]);

  // Load Course data in Edit mode
  useEffect(() => {
    if (mode === 'edit' && courseId) {
      const loadCourse = async () => {
        try {
          const c = await getCourseById(courseId);
          if (c) {
            setTitle(c.title);
            setSlug(c.slug);
            setBadge(c.badge || '');
            setDescription(c.description);
            setPrice(c.price);
            setDuration(c.stats?.duration || '');
            setFormat(c.stats?.format || '');
            setProjects(c.stats?.projects || '');
            setCareerSupport(c.stats?.careerSupport || '');
            setNextCohort(c.nextCohort || '');
            setIsAiOptimized(c.isAiOptimized || false);
            setCoverImageUrl(c.coverImageUrl || '');
            setBrochureUrl(c.brochureUrl || '');

            if (c.stack && c.stack.length > 0) {
              setTechStack(c.stack);
            }
            if (c.curriculum && c.curriculum.length > 0) {
              setCurriculum(c.curriculum);
            }
          } else {
            toast('Course not found', 'error');
            navigate('/admin/courses');
          }
        } catch (err) {
          console.error(err);
          toast('Failed to load course details', 'error');
        } finally {
          setFetching(false);
        }
      };
      loadCourse();
    }
  }, [mode, courseId, navigate, toast]);

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

  const handleTechInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = techInput.trim();
      if (val) {
        if (!techStack.some(t => t.name.toLowerCase() === val.toLowerCase())) {
          setTechStack([...techStack, { name: val }]);
          setIsDirty(true);
        }
        setTechInput('');
      }
    }
  };

  // Curriculum functions
  const addCurriculumMonth = () => {
    setCurriculum([
      ...curriculum,
      {
        tabTitle: `Month ${curriculum.length + 1}: Topic`,
        sectionTitle: 'New Curriculum Module',
        modules: [{ id: Date.now().toString(), title: 'Core Lesson', description: '' }]
      }
    ]);
    setIsDirty(true);
  };

  const removeCurriculumMonth = (idx: number) => {
    setCurriculum(curriculum.filter((_, i) => i !== idx));
    setIsDirty(true);
  };

  const handleCurriculumMonthChange = (idx: number, field: 'tabTitle' | 'sectionTitle', val: string) => {
    const updated = [...curriculum];
    updated[idx][field] = val;
    setCurriculum(updated);
    setIsDirty(true);
  };

  const addModuleToMonth = (monthIdx: number) => {
    const updated = [...curriculum];
    updated[monthIdx].modules.push({
      id: Date.now().toString(),
      title: 'New Lesson',
      description: ''
    });
    setCurriculum(updated);
    setIsDirty(true);
  };

  const removeModuleFromMonth = (monthIdx: number, moduleIdx: number) => {
    const updated = [...curriculum];
    updated[monthIdx].modules = updated[monthIdx].modules.filter((_, i) => i !== moduleIdx);
    setCurriculum(updated);
    setIsDirty(true);
  };

  const handleModuleChange = (monthIdx: number, moduleIdx: number, field: 'title' | 'description', val: string) => {
    const updated = [...curriculum];
    updated[monthIdx].modules[moduleIdx][field] = val;
    setCurriculum(updated);
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      badge: badge || 'Core Track',
      description,
      price: Number(price) || 0,
      duration: duration || '8 Weeks',
      format: format || 'Online',
      projects: projects || '3 Projects',
      career_support: careerSupport || 'Included',
      cover_image_url: coverImageUrl || null,
      brochure_url: brochureUrl || null,
      next_cohort: nextCohort || 'TBD',
      is_ai_optimized: isAiOptimized,
      stack: techStack
        .filter((item) => item.name.trim() !== '')
        .map((item, idx) => ({
          name: item.name,
          order: idx,
        })),
      curriculum: curriculum.map((month, idx) => ({
        tab_title: month.tabTitle,
        section_title: month.sectionTitle,
        order: idx,
        modules: month.modules.map((mod, modIdx) => ({
          title: mod.title,
          description: mod.description || '',
          order: modIdx,
        })),
      })),
    };

    const { invalidateCourses } = useAdminStore.getState();
    try {
      if (mode === 'create') {
        const success = await createCourse(payload);
        if (success) {
          toast('Course published successfully!', 'success');
          invalidateCourses();
          setIsDirty(false);
          navigate('/admin/courses');
        } else {
          toast('Failed to create course.', 'error');
        }
      } else if (mode === 'edit' && courseId) {
        const success = await updateCourse(courseId, payload);
        if (success) {
          toast('Course updated successfully!', 'success');
          invalidateCourses();
          setIsDirty(false);
          navigate('/admin/courses');
        } else {
          toast('Failed to update course.', 'error');
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
    <div className="admin-kpi-card glass-panel" style={{ maxWidth: '800px', margin: '0 auto', display: 'block', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#001943' }}>
          {mode === 'create' ? 'Create New Course Spec' : 'Edit Specialization Details'}
        </h3>
        <button
          onClick={() => {
            if (!isDirty || window.confirm('Discard unsaved changes?')) {
              setIsDirty(false);
              navigate('/admin/courses');
            }
          }}
          className="admin-back-btn"
          style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-login-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="admin-form-group">
            <label>Course Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => { setTitle(e.target.value); setIsDirty(true); }} 
              required 
              placeholder="e.g. AI & Machine Learning Mastery" 
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
            />
          </div>
          <div className="admin-form-group">
            <label>Slug (URL Identifier)</label>
            <input 
              type="text" 
              value={slug} 
              onChange={e => { setSlug(e.target.value); setIsDirty(true); }} 
              placeholder="ai-ml-mastery" 
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="admin-form-group">
            <label>Badge / Track Type</label>
            <input 
              type="text" 
              value={badge} 
              onChange={e => { setBadge(e.target.value); setIsDirty(true); }} 
              placeholder="Advanced Specialization" 
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
            />
          </div>
          <div className="admin-form-group">
            <label>Course Price (₹)</label>
            <input 
              type="number" 
              value={price} 
              onChange={e => { setPrice(Number(e.target.value)); setIsDirty(true); }} 
              required 
              placeholder="249.00" 
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label>Course Description Summary</label>
          <textarea 
            value={description} 
            onChange={e => { setDescription(e.target.value); setIsDirty(true); }} 
            required 
            placeholder="An advanced program covering large language models..." 
            style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', minHeight: '80px', borderRadius: '8px', padding: '10px', outline: 'none' }}
          ></textarea>
        </div>

        <h4 style={{ margin: '15px 0 10px', color: '#001943', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>Catalog Statistics & Logistics</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="admin-form-group">
            <label>Syllabus Duration</label>
            <input 
              type="text" 
              value={duration} 
              onChange={e => { setDuration(e.target.value); setIsDirty(true); }} 
              placeholder="12 Weeks" 
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
            />
          </div>
          <div className="admin-form-group">
            <label>Cohort Learning Format</label>
            <input 
              type="text" 
              value={format} 
              onChange={e => { setFormat(e.target.value); setIsDirty(true); }} 
              placeholder="Hybrid Online" 
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="admin-form-group">
            <label>Hands-on Projects Count</label>
            <input 
              type="text" 
              value={projects} 
              onChange={e => { setProjects(e.target.value); setIsDirty(true); }} 
              placeholder="8 Capstones" 
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
            />
          </div>
          <div className="admin-form-group">
            <label>Career Support Policy</label>
            <input 
              type="text" 
              value={careerSupport} 
              onChange={e => { setCareerSupport(e.target.value); setIsDirty(true); }} 
              placeholder="1-on-1 Mentorship & Placements Included" 
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
          <div className="admin-form-group">
            <label>Next Cohort Date</label>
            <input 
              type="text" 
              value={nextCohort} 
              onChange={e => { setNextCohort(e.target.value); setIsDirty(true); }} 
              placeholder="Nov 15, 2026" 
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
            />
          </div>
          <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
            <input 
              type="checkbox" 
              checked={isAiOptimized} 
              onChange={e => { setIsAiOptimized(e.target.checked); setIsDirty(true); }} 
              style={{ width: 'auto' }} 
              id="aiOptToggle" 
            />
            <label htmlFor="aiOptToggle" style={{ margin: 0, color: '#001943', cursor: 'pointer' }}>AI-Optimized Learning Path enabled?</label>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
          <FileUploader 
            label="Course Thumbnail Image" 
            folder="courses/thumbnails" 
            type="image" 
            currentValue={coverImageUrl} 
            onUploadSuccess={url => { setCoverImageUrl(url); setIsDirty(true); }}
            onRemove={() => { setCoverImageUrl(''); setIsDirty(true); }}
          />
          <FileUploader 
            label="Course Syllabus / Brochure PDF" 
            folder="courses/brochures" 
            type="pdf" 
            currentValue={brochureUrl} 
            onUploadSuccess={url => { setBrochureUrl(url); setIsDirty(true); }}
            onRemove={() => { setBrochureUrl(''); setIsDirty(true); }}
          />
        </div>

        <h4 style={{ margin: '20px 0 10px', color: '#001943', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>Technologies Taught Stack</h4>
        <div className="admin-form-group" style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px 0' }}>
            Type technology name (e.g. Python, PyTorch, NumPy) and press <strong>Enter</strong> to add a tag. Click <strong>&times;</strong> to remove.
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            padding: '10px',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            minHeight: '48px',
            alignItems: 'center'
          }}>
            {techStack.map((tech, idx) => (
              <div 
                key={idx} 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, #0052fe, #003ec6)',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  gap: '6px'
                }}
              >
                <span>{tech.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setTechStack(techStack.filter((_, i) => i !== idx));
                    setIsDirty(true);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '16px',
                    lineHeight: 1,
                    padding: '0 2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  &times;
                </button>
              </div>
            ))}
            <input
              type="text"
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              onKeyDown={handleTechInputKeyDown}
              placeholder={techStack.length === 0 ? "e.g. Python, PyTorch..." : "Add more..."}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                color: '#001943',
                fontSize: '14px',
                padding: '4px 0',
                minWidth: '120px'
              }}
            />
          </div>
        </div>

        <h4 style={{ margin: '20px 0 10px', color: '#001943', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>Curriculum Syllabus Sections</h4>
        {curriculum.map((month, monthIdx) => (
          <div key={monthIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Month Title (e.g., Month 1: Basics)"
                value={month.tabTitle}
                onChange={e => handleCurriculumMonthChange(monthIdx, 'tabTitle', e.target.value)}
                style={{ flex: 1, background: '#ffffff', color: '#001943', border: '1px solid #cbd5e1', height: '38px', borderRadius: '6px', padding: '0 10px' }}
              />
              <input
                type="text"
                placeholder="Section Title (e.g., Intro to PyTorch)"
                value={month.sectionTitle}
                onChange={e => handleCurriculumMonthChange(monthIdx, 'sectionTitle', e.target.value)}
                style={{ flex: 2, background: '#ffffff', color: '#001943', border: '1px solid #cbd5e1', height: '38px', borderRadius: '6px', padding: '0 10px' }}
              />
              {curriculum.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeCurriculumMonth(monthIdx)} 
                  style={{ background: '#fecaca', color: '#ef4444', border: 'none', height: '38px', width: '38px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                </button>
              )}
            </div>

            {/* Modules list inside this Month */}
            <div style={{ marginLeft: '20px', marginTop: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Modules</label>
              {month.modules.map((mod, modIdx) => (
                <div key={modIdx} style={{ display: 'flex', gap: '10px', margin: '6px 0', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Lesson Title"
                    value={mod.title}
                    onChange={e => handleModuleChange(monthIdx, modIdx, 'title', e.target.value)}
                    style={{ flex: 1, background: '#ffffff', color: '#001943', border: '1px solid #cbd5e1', height: '32px', borderRadius: '6px', padding: '0 8px', fontSize: '13px' }}
                  />
                  <input
                    type="text"
                    placeholder="Lesson Description"
                    value={mod.description}
                    onChange={e => handleModuleChange(monthIdx, modIdx, 'description', e.target.value)}
                    style={{ flex: 2, background: '#ffffff', color: '#001943', border: '1px solid #cbd5e1', height: '32px', borderRadius: '6px', padding: '0 8px', fontSize: '13px' }}
                  />
                  {month.modules.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeModuleFromMonth(monthIdx, modIdx)} 
                      style={{ background: '#fee2e2', color: '#ef4444', border: 'none', height: '32px', width: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => addModuleToMonth(monthIdx)} 
                style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px', marginTop: '4px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span> Add Lesson Module
              </button>
            </div>
          </div>
        ))}
        <button 
          type="button" 
          onClick={addCurriculumMonth} 
          style={{ background: '#e2e8f0', color: '#001943', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '20px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span> Add Curriculum Section
        </button>

        <button 
          type="submit" 
          disabled={loading} 
          className="activity-book-btn" 
          style={{ marginTop: '20px', borderRadius: '8px', width: '100%', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {loading && <div className="admin-loading-spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />}
          {mode === 'create' ? 'Create & Publish Course' : 'Save Specialization Changes'}
        </button>
      </form>
    </div>
  );
}
