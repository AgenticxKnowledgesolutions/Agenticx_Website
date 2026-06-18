import { useEffect } from 'react'
import NeuralCanvas from '@/components/ui/NeuralCanvas'
import SolutionsWeBuild from '@/components/features/products/SolutionsWeBuild'
import TechStack from '@/components/features/products/TechStack'
import ProjectCta from '@/components/features/products/ProjectCta'
import '../styles/services.css'

export default function Services() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <div className="services-page">
        <NeuralCanvas nodeCount={35} />
        <div className="srv-content-wrapper">
          <div className="container srv-container">

            {/* Hero Section */}
            <section className="srv-hero">
              <div className="srv-hero-bg"></div>
              <div className="srv-hero-panel">

                {/* Left Content */}
                <div className="srv-hero-content">
                  <h1 className="srv-hero-title glow-text">
                    Empowering Careers. <br />
                    <span className="text-secondary">Enabling Innovation.</span>
                  </h1>
                  <p className="srv-hero-subtitle">
                    From industry-ready training to enterprise solutions, AgenticX bridges the gap between talent and opportunity.
                  </p>
                </div>

                {/* Right Stats */}
                <div className="srv-hero-stats">
                  <div className="srv-stat-card ambient-shadow">
                    <div className="srv-stat-value">5+</div>
                    <div className="srv-stat-label">Core Services</div>
                  </div>
                  <div className="srv-stat-card ambient-shadow mt-offset">
                    <div className="srv-stat-value">100+</div>
                    <div className="srv-stat-label">Students Trained</div>
                  </div>
                </div>

              </div>
            </section>

            {/* Section Header */}
            <section className="srv-section-header">
              <h2>Our Core Services</h2>
            </section>

            {/* Services Grid */}
            <section className="srv-grid">

              {/* Service 1 */}
              <div className="srv-card ambient-shadow group">
                <div className="srv-card-inner">
                  <div className="srv-card-header">
                    <h3 className="srv-card-title">Training Programs</h3>
                    <span className="material-symbols-outlined srv-card-icon">school</span>
                  </div>
                  <p className="srv-card-desc">
                    Specialized courses in cutting-edge technologies designed to prepare industry-ready professionals.
                  </p>
                </div>
              </div>

              {/* Service 2 */}
              <div className="srv-card ambient-shadow group">
                <div className="srv-card-inner">
                  <div className="srv-card-header">
                    <h3 className="srv-card-title">Internship Support</h3>
                    <span className="material-symbols-outlined srv-card-icon">work_history</span>
                  </div>
                  <p className="srv-card-desc">
                    Real-world experience for fresh graduates through comprehensive graduate training programs.
                  </p>
                </div>
              </div>

              {/* Service 3 */}
              <div className="srv-card ambient-shadow group">
                <div className="srv-card-inner">
                  <div className="srv-card-header">
                    <h3 className="srv-card-title">Hire-Train-Deploy (HTD)</h3>
                    <span className="material-symbols-outlined srv-card-icon">model_training</span>
                  </div>
                  <p className="srv-card-desc">
                    Custom talent solutions for businesses to hire, train, and deploy the right candidates efficiently.
                  </p>
                </div>
              </div>

              {/* Service 4 */}
              <div className="srv-card ambient-shadow group">
                <div className="srv-card-inner">
                  <div className="srv-card-header">
                    <h3 className="srv-card-title">Career Guidance</h3>
                    <span className="material-symbols-outlined srv-card-icon">explore</span>
                  </div>
                  <p className="srv-card-desc">
                    Placement support, mentoring, mock interviews, and career coaching to help individuals succeed professionally.
                  </p>
                </div>
              </div>
            </section>

            {/* Solutions We Build Section */}
            <div style={{ marginTop: '48px' }}>
              <SolutionsWeBuild />
            </div>

            {/* Tech Stack Section */}
            <TechStack />

            {/* Custom Product CTA */}
            <ProjectCta />

          </div>
        </div>
      </div>

    </>
  )
}
