import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCourseBySlug, type Course } from '@/services/courseService'
import '../styles/course-detail.css'

export default function CourseDetail() {
  const { slug } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [prevSlug, setPrevSlug] = useState(slug)
  const [activeTab, setActiveTab] = useState(0)

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
              <p className="cd-stat-value">{course.stats.duration}</p>
            </div>
            <div className="cd-stat-card">
              <span className="material-symbols-outlined cd-stat-icon">devices</span>
              <p className="cd-stat-label">Format</p>
              <p className="cd-stat-value">{course.stats.format}</p>
            </div>
            <div className="cd-stat-card">
              <span className="material-symbols-outlined cd-stat-icon">terminal</span>
              <p className="cd-stat-label">Projects</p>
              <p className="cd-stat-value">{course.stats.projects}</p>
            </div>
            <div className="cd-stat-card">
              <span className="material-symbols-outlined cd-stat-icon">work_outline</span>
              <p className="cd-stat-label">Career Support</p>
              <p className="cd-stat-value">{course.stats.careerSupport}</p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="cd-stack-section">
            <h4 className="cd-section-label">STACK COVERED</h4>
            <div className="cd-stack-list">
              {course.stack.map((tech, i) => (
                <div key={i} className="cd-stack-item">
                  <img src={tech.iconUrl} alt={tech.name} className="cd-stack-icon" />
                  <span className="cd-stack-name">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Syllabus */}
          <div className="cd-curriculum-section">
            <div className="cd-curriculum-header">
              <h2 className="cd-section-title">Curriculum</h2>
              <button className="cd-download-btn">
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

            <form className="cd-form" onSubmit={(e) => e.preventDefault()}>
              <div className="cd-input-group">
                <label>FULL NAME</label>
                <input type="text" placeholder="Enter your full name" />
              </div>
              <div className="cd-input-group">
                <label>EMAIL ADDRESS</label>
                <input type="email" placeholder="email@company.com" />
              </div>
              <div className="cd-input-group">
                <label>YEARS OF EXPERIENCE</label>
                <select>
                  <option>Select experience level</option>
                  <option>2-5 Years</option>
                  <option>5-10 Years</option>
                  <option>10+ Years</option>
                </select>
              </div>
              <div className="cd-input-group">
                <label>PRIMARY GOAL</label>
                <textarea placeholder="What are you looking to achieve?"></textarea>
              </div>

              <button type="submit" className="cd-submit-btn">
                Send Inquiry
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>

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
