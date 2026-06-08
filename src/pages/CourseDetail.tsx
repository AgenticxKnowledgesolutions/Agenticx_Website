import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCourseBySlug, type Course } from '@/services/courseService'
import { createLead } from '@/services/leadService'
import '../styles/course-detail.css'

export default function CourseDetail() {
  const { slug } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [prevSlug, setPrevSlug] = useState(slug)
  const [activeTab, setActiveTab] = useState(0)

  // Enquiry Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [experience, setExperience] = useState('Select experience level')
  const [goal, setGoal] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [enquirySuccess, setEnquirySuccess] = useState(false)

  if (slug !== prevSlug) {
    setPrevSlug(slug)
    setActiveTab(0)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    
    const fetchCourse = async () => {
      if (slug) {
        setLoading(true)
        const data = await getCourseBySlug(slug)
        setCourse(data)
        setLoading(false)
      }
    }
    
    fetchCourse()
  }, [slug])

  if (loading) {
    return (
      <div className="cd-page container cd-loading">
        <h2>Loading course details...</h2>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="cd-page container cd-loading">
        <h2>Course not found...</h2>
      </div>
    )
  }

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setSubmitting(true)
    try {
      const payload = {
        name,
        email,
        phone: experience !== 'Select experience level' ? `Exp: ${experience}` : undefined,
        message: `Goal: ${goal || 'Not specified'}`,
        interestedCourse: course.title,
        sourcePage: `Course Detail Page: ${course.slug}`
      }
      const success = await createLead(payload)
      if (success) {
        setEnquirySuccess(true)
        setName('')
        setEmail('')
        setExperience('Select experience level')
        setGoal('')
      } else {
        alert('Failed to submit inquiry. Please try again.')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const activeCurriculum = course.curriculum[activeTab]

  return (
    <div className="cd-page">
      <div className="container cd-container">

        {/* Main Content Column */}
        <div className="cd-main">

          {/* Header Area */}
          <div className="cd-header-meta">
            <span className="cd-tag">{course.badge}</span>
          </div>
          <h1 className="cd-title">{course.title}</h1>
          <p className="cd-description">{course.description}</p>

          {/* Stats Grid */}
          <div className="cd-stats-grid">
            <div className="cd-stat-card">
              <span className="material-symbols-outlined cd-stat-icon">schedule</span>
              <p className="cd-stat-label">Duration</p>
              <p className="cd-stat-value">{course.stats?.duration || 'N/A'}</p>
            </div>
            <div className="cd-stat-card">
              <span className="material-symbols-outlined cd-stat-icon">devices</span>
              <p className="cd-stat-label">Format</p>
              <p className="cd-stat-value">{course.stats?.format || 'N/A'}</p>
            </div>
            <div className="cd-stat-card">
              <span className="material-symbols-outlined cd-stat-icon">terminal</span>
              <p className="cd-stat-label">Projects</p>
              <p className="cd-stat-value">{course.stats?.projects || 'N/A'}</p>
            </div>
            <div className="cd-stat-card">
              <span className="material-symbols-outlined cd-stat-icon">work_outline</span>
              <p className="cd-stat-label">Career Support</p>
              <p className="cd-stat-value">{course.stats?.careerSupport || 'N/A'}</p>
            </div>
          </div>

          {/* Tech Stack */}
          {course.stack && course.stack.length > 0 && (
            <div className="cd-stack-section">
              <h4 className="cd-section-label">STACK COVERED</h4>
              <div className="cd-stack-list">
                {course.stack.map((tech, i) => (
                  <div key={i} className="cd-stack-item">
                    <span className="cd-stack-name">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curriculum Syllabus */}
          <div className="cd-curriculum-section">
            <div className="cd-curriculum-header">
              <h2 className="cd-section-title">Curriculum</h2>
              <button 
                className="cd-download-btn"
                onClick={() => {
                  if (course.brochureUrl) {
                    window.open(course.brochureUrl, '_blank')
                  } else {
                    alert('Official brochure not available yet for this program.')
                  }
                }}
              >
                DOWNLOAD PDF <span className="material-symbols-outlined">download</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="cd-tabs">
              {course.curriculum.map((tab, idx) => (
                <button
                  key={idx}
                  className={`cd-tab-button ${activeTab === idx ? 'active' : ''}`}
                  onClick={() => setActiveTab(idx)}
                >
                  {tab.tabTitle}
                </button>
              ))}
            </div>

            {/* Active Curriculum Content */}
            <div className="cd-curriculum-content">
              <div className="cd-module-wrapper">
                <div className="cd-module-header">
                  <div className="cd-module-title-group">
                    <div className="cd-module-icon">
                      <span className="material-symbols-outlined">database</span>
                    </div>
                    <h3 className="cd-module-title">{activeCurriculum?.sectionTitle}</h3>
                  </div>
                  <span className="material-symbols-outlined cd-expand-icon">expand_more</span>
                </div>

                <div className="cd-module-grid">
                  {activeCurriculum?.modules.map((mod, idx) => (
                    <div key={mod.id} className="cd-module-card">
                      <p className="cd-module-number">MODULE 0{idx + 1}</p>
                      <p className="cd-module-name">{mod.title}</p>
                      <p className="cd-module-desc">{mod.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Sidebar Column */}
        <aside className="cd-sidebar">
          <div className="cd-form-card">
            <h3 className="cd-form-title">Enquire About This Course</h3>
            <p className="cd-form-desc">Talk to an advisor about admissions, scholarship opportunities, and career placement.</p>

            {enquirySuccess ? (
              <div style={{ padding: '20px 0', textAlign: 'center', color: '#166534', fontWeight: 600 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#10b981', marginBottom: '10px' }}>check_circle</span>
                <p style={{ margin: 0 }}>Inquiry submitted successfully!</p>
                <p style={{ fontSize: '13px', color: '#475569', fontWeight: 'normal', marginTop: '6px' }}>Our academic advisor will email you shortly.</p>
                <button 
                  onClick={() => setEnquirySuccess(false)}
                  style={{ background: '#f1f5f9', border: 'none', color: '#475569', padding: '6px 12px', borderRadius: '6px', marginTop: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form className="cd-form" onSubmit={handleEnquirySubmit}>
                <div className="cd-input-group">
                  <label>FULL NAME</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter your full name" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="cd-input-group">
                  <label>EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="email@company.com" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="cd-input-group">
                  <label>YEARS OF EXPERIENCE</label>
                  <select value={experience} onChange={e => setExperience(e.target.value)}>
                    <option>Select experience level</option>
                    <option>0-2 Years (Graduate)</option>
                    <option>2-5 Years</option>
                    <option>5-10 Years</option>
                    <option>10+ Years</option>
                  </select>
                </div>
                <div className="cd-input-group">
                  <label>PRIMARY GOAL</label>
                  <textarea 
                    placeholder="What are you looking to achieve?" 
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                  ></textarea>
                </div>

                <button type="submit" disabled={submitting} className="cd-submit-btn" style={{ opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'Sending...' : 'Send Inquiry'}
                  <span className="material-symbols-outlined">send</span>
                </button>
              </form>
            )}

            <div className="cd-form-footer">
              <p>Next cohort starts: <strong>{course.nextCohort}</strong></p>
            </div>
          </div>

          {course.isAiOptimized && (
            <div className="cd-ai-indicator">
              <div className="cd-ai-icon-wrapper">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <p>AI-Optimized Learning Path enabled for this specialization.</p>
            </div>
          )}
        </aside>

      </div>
    </div>
  )
}
