import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getCourseBySlug, type Course } from '@/services/courseService'
import { createLead } from '@/services/leadService'
import { CourseDetailSkeleton } from '@/components/ui/Skeletons'
import SEO from '@/components/seo/SEO'
import CertificateNotice from '@/components/ui/CertificateNotice'
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
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [goal, setGoal] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [enquirySuccess, setEnquirySuccess] = useState(false)

  if (slug !== prevSlug) {
    setPrevSlug(slug)
    setActiveTab(0)
    setPhone('')
    setPhoneError('')
  }

  const tabsRef = useRef<HTMLDivElement>(null)

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

  // Translate vertical wheel scroll to horizontal scroll on tabs container
  useEffect(() => {
    const el = tabsRef.current
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return
        e.preventDefault()
        el.scrollTo({
          left: el.scrollLeft + e.deltaY,
          behavior: 'auto'
        })
      }
      el.addEventListener('wheel', onWheel, { passive: false })
      return () => el.removeEventListener('wheel', onWheel)
    }
  }, [course, loading])

  if (loading) {
    return <CourseDetailSkeleton />
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

    // Mobile number validation: accept only numbers, between 10 and 15 digits
    const cleanedPhone = phone.trim()
    if (!cleanedPhone) {
      setPhoneError('Please enter a valid mobile number')
      return
    }
    const phoneRegex = /^[0-9]{10,15}$/
    if (!phoneRegex.test(cleanedPhone)) {
      setPhoneError('Please enter a valid mobile number')
      return
    }
    setPhoneError('')

    setSubmitting(true)
    try {
      const payload = {
        name,
        email,
        phone: cleanedPhone,
        course_interest: course.title,
        course_slug: course.slug,
        goal: goal || 'Not specified'
      }
      const success = await createLead(payload)
      if (success) {
        setEnquirySuccess(true)
        setName('')
        setEmail('')
        setPhone('')
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
      <SEO 
        title={`${course.title} Course in Kollam | AgenticX`}
        description={course.description || `Enroll in the ${course.title} program at AgenticX. Advanced syllabus, professional guidance, and placement support.`}
        keywords={`${course.title}, IT training Kollam, AgenticX courses, placement support`}
      />
      <div className="container cd-container">

        {/* Main Content Column */}
        <div className="cd-main">

          {/* Header Area */}
          <div className="cd-header-meta">
            <span className="cd-tag">{course.badge}</span>
          </div>
          <h1 className="cd-title">{course.title}</h1>
          <p className="cd-description">{course.description}</p>

          <CertificateNotice 
            title="🎓 Secure QR-Verified Certificate"
            description="This program includes a secure QR-verified digital certificate upon successful completion. Certificates can be downloaded anytime. Employers and organizations can instantly verify authenticity using the embedded QR code."
            ctaText="Open Certificate Portal →"
          />

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
            <div className="cd-tabs" ref={tabsRef}>
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
                  <label>MOBILE NUMBER</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="Enter your mobile number" 
                    value={phone}
                    maxLength={15}
                    onChange={e => {
                      setPhone(e.target.value.replace(/[^0-9]/g, ''));
                      if (phoneError) setPhoneError('');
                    }}
                  />
                  {phoneError && <span className="error-message" style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{phoneError}</span>}
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
