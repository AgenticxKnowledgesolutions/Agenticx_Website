import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Course, getCourses, saveCourses } from '@/services/courseService';
import '../Admin.css';

export default function CourseAdd() {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  // Course Form State
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

  // Dynamic Tech Stack inputs
  const [techStack, setTechStack] = useState<{ name: string; iconUrl: string }[]>([
    { name: '', iconUrl: '' }
  ]);

  useEffect(() => {
    const loadCourses = async () => {
      const data = await getCourses();
      setCourses(data);
    };
    loadCourses();
  }, []);

  const addTechInput = () => {
    setTechStack([...techStack, { name: '', iconUrl: '' }]);
  };

  const removeTechInput = (index: number) => {
    setTechStack(techStack.filter((_, i) => i !== index));
  };

  const handleTechChange = (index: number, field: 'name' | 'iconUrl', value: string) => {
    const updated = [...techStack];
    updated[index][field] = value;
    setTechStack(updated);
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create a basic default curriculum structure for simplicity
    const sampleCurriculum = [
      {
        tabTitle: 'Month 1: Foundations',
        sectionTitle: 'Core Learning & Labs',
        modules: [
          { id: '1', title: 'Getting Started', description: 'Introduction to course core concepts.' },
          { id: '2', title: 'Practical Exercises', description: 'Hands-on training and lab projects.' }
        ]
      }
    ];

    const newCourse: Course = {
      id: Date.now().toString(),
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      badge: badge || 'Core Track',
      description,
      price: Number(price) || 0,
      stats: {
        duration: duration || '8 Weeks',
        format: format || 'Online',
        projects: projects || '3 Projects',
        careerSupport: careerSupport || 'Included'
      },
      stack: techStack.filter(item => item.name.trim() !== ''),
      curriculum: sampleCurriculum,
      nextCohort: nextCohort || 'TBD',
      isAiOptimized
    };

    const updatedCourses = [...courses, newCourse];
    await saveCourses(updatedCourses);

    navigate('/admin/courses');
  };

  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Add Course</h1>
        <p className="admin-page-subtitle">Publish a new cohort specialization curriculum details.</p>
      </div>

      <div className="admin-kpi-card glass-panel" style={{ maxWidth: '700px', margin: '0 auto', display: 'block', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#001943' }}>Course Form Configuration</h3>
          <button onClick={() => navigate('/admin/courses')} className="admin-back-btn" style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span> Back
          </button>
        </div>

        <form onSubmit={handleAddCourse} className="admin-login-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label>Course Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
                placeholder="Full Stack AI & Machine Learning Mastery" 
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
              />
            </div>
            <div className="admin-form-group">
              <label>Slug (URL Identifier)</label>
              <input 
                type="text" 
                value={slug} 
                onChange={e => setSlug(e.target.value)} 
                placeholder="full-stack-ai-ml-mastery" 
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
                onChange={e => setBadge(e.target.value)} 
                placeholder="Advanced Specialization" 
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
              />
            </div>
            <div className="admin-form-group">
              <label>Course Price ($)</label>
              <input 
                type="number" 
                value={price} 
                onChange={e => setPrice(Number(e.target.value))} 
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
              onChange={e => setDescription(e.target.value)} 
              required 
              placeholder="An advanced program covering large language models, vector databases, and AI-powered applications with hands-on real-world projects and deployment pipelines." 
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
                onChange={e => setDuration(e.target.value)} 
                placeholder="12 Weeks" 
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
              />
            </div>
            <div className="admin-form-group">
              <label>Teaching Format</label>
              <input 
                type="text" 
                value={format} 
                onChange={e => setFormat(e.target.value)} 
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
                onChange={e => setProjects(e.target.value)} 
                placeholder="8 Capstones" 
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
              />
            </div>
            <div className="admin-form-group">
              <label>Career Support Policy</label>
              <input 
                type="text" 
                value={careerSupport} 
                onChange={e => setCareerSupport(e.target.value)} 
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
                onChange={e => setNextCohort(e.target.value)} 
                placeholder="Nov 15, 2026" 
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} 
              />
            </div>
            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
              <input type="checkbox" checked={isAiOptimized} onChange={e => setIsAiOptimized(e.target.checked)} style={{ width: 'auto' }} id="aiOptToggle" />
              <label htmlFor="aiOptToggle" style={{ margin: 0, color: '#001943', cursor: 'pointer' }}>AI-Optimized Learning Path enabled?</label>
            </div>
          </div>

          <h4 style={{ margin: '20px 0 10px', color: '#001943', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>Technologies Taught Stack</h4>
          {techStack.map((tech, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="e.g. PyTorch"
                value={tech.name}
                onChange={e => handleTechChange(idx, 'name', e.target.value)}
                style={{ flex: 1, background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', height: '38px', borderRadius: '6px', padding: '0 10px' }}
              />
              <input
                type="text"
                placeholder="e.g. https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
                value={tech.iconUrl}
                onChange={e => handleTechChange(idx, 'iconUrl', e.target.value)}
                style={{ flex: 2, background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', height: '38px', borderRadius: '6px', padding: '0 10px' }}
              />
              {techStack.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTechInput(idx)}
                  style={{ background: '#fee2e2', color: '#ef4444', border: 'none', width: '38px', height: '38px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTechInput}
            style={{ background: '#e2e8f0', color: '#475569', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span> Add Technology
          </button>

          <button type="submit" className="activity-book-btn" style={{ marginTop: '24px', borderRadius: '8px', width: '100%' }}>Publish Course Catalog Page</button>
        </form>
      </div>
    </div>
  );
}
