import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../styles/course-detail.css'

export interface ModuleData {
  id: string
  title: string
  description: string
}

export interface CurriculumMonth {
  tabTitle: string
  sectionTitle: string
  modules: ModuleData[]
}

export interface TechStack {
  name: string
  iconUrl: string
}

export interface CourseDetailData {
  id: string
  slug: string
  badge: string
  title: string
  description: string
  stats: {
    duration: string
    format: string
    projects: string
    careerSupport: string
  }
  stack: TechStack[]
  curriculum: CurriculumMonth[]
  nextCohort: string
  isAiOptimized: boolean
}

// MOCK DATA: 2 Unique Courses to demonstrate dynamic routing
const MOCK_COURSES_DB: Record<string, CourseDetailData> = {
  'advanced-ai': {
    id: '1',
    slug: 'advanced-ai',
    badge: 'Advanced Specialization',
    title: 'Full Stack AI & Machine Learning Mastery',
    description: 'A comprehensive elite-tier program designed for senior engineers. Architect, deploy, and scale complex agentic workflows using industry-leading frameworks and cloud-native infrastructure.',
    stats: {
      duration: '6 Months',
      format: 'Hybrid Online',
      projects: '8 Capstones',
      careerSupport: 'Included'
    },
    stack: [
      { name: 'Python', iconUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWuQ-cZSmbNJL8r9pRzICn8kfp8IyPPu-KtJsI3TO3FTdbpvVzPO-d8aJtp50s9R_kWdQZ0HyI3zRqbVq6nGYNrkg9mz6oE2AgT1NZIDb5krFz0UYjMrGCJTZf3GT54SZXQwSSzM_KIT1rQvLQK-QNqVIAhSKVtlmyfh7grz5sIJksVis30fW2MTunJNl3TFiR_qnwLeL-1qCwtRN7c8uGm22UGyhiKFjATdtitywZobZSEqlMHGPllj4Qh4Ll1ofiZZyqiEBVGwQ' },
      { name: 'PyTorch', iconUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOMwRkrPx4VU6HtCibx9TUKrcZHx1QMWFKcXftCritvVChHA8ljXZLZcx_NQL9PPAzyjcoYTsq80wBs3scScnqi305SP9fExf4F1Yp91a-M4m5B5Z8MRAIDxPlscAKNzIdwW3yL5hHpP4dZoxMTXFYI0gX2plPdGXb1gc8WAogOGv373gA0_6cKcuAKxWa5JXaq09XEP97lHF2w-SQY_mfQbwEv2wijGVWUiLQNofG-pitAGhCt6KcGZRWpgBJe6ge6c7-HPlEEf4' },
      { name: 'SQL', iconUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKvDXiKwyIhs4PtlZ1Cyh4g3IOd4xh-drpdi7htArflMegMXRVM52YU1s1saO6e2GdnFNDRedpWGsiNtP42Pwt0zJXECXpmNWewqnAQTdShecgt2wUgmpqvjlPvwgvYHxlOJYawhopWBt-p1z8-9ayQ5U1nkFhBy2e5AjxAhNWP74xvoB34eIfk_73YbgnG9QxsPRVY2-HHH2dxHiRT2XMjEL-RylaSxI8z8PwFY4e56v6ZGhKL1hnOrFD6qrhnxyrS2W12R_Lw4w' },
      { name: 'TensorFlow', iconUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwUY184V0MdQoQhWgGDmgRIJhtpp5Cb4LCXB1qYmTTlxpNWlE4XYWV-2iG5lZiY3RZKIXKk73wWxiTEpv6iZSbiGiprCBAMV4G-m00izxkTASNTq3lkmFw3IsRUT3mAEKkrZ9Kf2Ah5toYe0vsVKvfjAOpgIC2TYcsvCgw1ywpAQs1hWuz-RccLXMDRcslPwFMH2AZZj5khXHsxleLEDn5DTOsVtx9mc349ykdQ6W8DYX7rXV1BvYYZF4_EoZv5OXqmyrfDA-h988' },
      { name: 'Docker', iconUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6ATKf-o31KKn_CLNU_XxcBv1uS6JWSj_4HIum-P0yDF6LNbmG4RmBvc0FFOsGp1oJUwIgftEiIV_Z3rGRJuuEO1xwhWNDNoQ93zWHdP-OdWNR6ikO900STQEvr31IrjTn4-URqI4rhEOAyf17cUPwUb4p9OwFR-VNUw3uyadBsqPW_EDHhOSb5uPQkfROq851kFP37EmzjasP5qBiD_g9IkADht9YIREEjE7ZI7jjWPkQoDLpPh6C1VCh3tmzgSi-Vi2ViT5MHKE' }
    ],
    curriculum: [
      {
        tabTitle: 'Month 1: Foundations',
        sectionTitle: 'Data Engineering & Python Mastery',
        modules: [
          { id: '1', title: 'Advanced Python', description: 'Metaprogramming, concurrency, and high-performance patterns.' },
          { id: '2', title: 'Modern SQL', description: 'Vector databases, complex joins, and window functions.' },
          { id: '4', title: 'Modern SQL', description: 'Vector databases, complex joins, and window functions.' },

          { id: '3', title: 'Applied Statistical Learning', description: 'Bayesian inference and probabilistic programming.' }
        ]
      },
      {
        tabTitle: 'Month 2: Deep Learning',
        sectionTitle: 'Neural Architectures & Vision',
        modules: [
          { id: '4', title: 'Deep Learning Basics', description: 'Backpropagation, activation functions, and optimization.' },
          { id: '5', title: 'CNNs & Vision', description: 'Image classification, object detection, and segmentation.' },
          { id: '6', title: 'Sequence Models', description: 'RNNs, LSTMs, and time-series forecasting.' }
        ]
      }
    ],
    nextCohort: 'Nov 15, 2024',
    isAiOptimized: true
  },
  'full-stack-react': {
    id: '2',
    slug: 'full-stack-react',
    badge: 'Core Program',
    title: 'Modern Full-Stack Engineering with Next.js',
    description: 'Master the entire modern web stack. Build scalable, SEO-friendly, and highly performant applications using React, Next.js 14, and scalable backend architectures.',
    stats: {
      duration: '4 Weeks',
      format: 'Remote Online',
      projects: '5 Real-world Apps',
      careerSupport: 'Included'
    },
    stack: [
      { name: 'TypeScript', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg' },
      { name: 'React', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
      { name: 'Next.js', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg' }
    ],
    curriculum: [
      {
        tabTitle: 'Week 1: React Mastery',
        sectionTitle: 'Advanced React Patterns',
        modules: [
          { id: '1', title: 'React Hooks Deep Dive', description: 'Custom hooks, performance optimization, and context.' },
          { id: '2', title: 'State Management', description: 'Zustand, Redux Toolkit, and React Query.' },
          { id: '3', title: 'Component Architecture', description: 'Building a scalable design system.' }
        ]
      }
    ],
    nextCohort: 'Dec 01, 2024',
    isAiOptimized: false
  }
}

export default function CourseDetail() {
  const { slug } = useParams()
  const [course, setCourse] = useState<CourseDetailData | null>(null)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)

    // Simulate fetching data from backend based on URL slug
    if (slug && MOCK_COURSES_DB[slug]) {
      setCourse(MOCK_COURSES_DB[slug])
      setActiveTab(0) // Reset tab when course changes
    } else {
      // Fallback if course not found
      setCourse(null)
    }
  }, [slug])

  if (!course) {
    return (
      <div className="cd-page container cd-loading">
        <h2>Loading course details or course not found...</h2>
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
