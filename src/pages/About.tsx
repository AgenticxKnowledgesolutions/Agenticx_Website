import { useEffect } from 'react'
import NeuralCanvas from '@/components/ui/NeuralCanvas'
import '../styles/about.css'
import WhyAgenticX from '../components/features/about/WhyAgenticX'
import { useSettingsStore } from '@/store/useSettingsStore'

export default function About() {
  const settings = useSettingsStore(state => state.settings);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="about-page">
      <NeuralCanvas nodeCount={35} />

      <div className="abt-content-wrapper">
        <div className="container abt-container">

          {/* HERO SECTION */}
          <section className="abt-hero">
            <div className="abt-hero-panel">

              <div className="abt-hero-content">
                <h1 className="abt-hero-title glow-text">
                  Empowering Tomorrow’s <span className="text-secondary">Workforce</span>
                </h1>
                <p className="abt-hero-subtitle">
                  Bridging the gap between education and industry by equipping talent with real-world skills and enabling organizations to access job-ready professionals.
                </p>
              </div>

              <div className="abt-hero-stats">
                <div className="abt-stat-card ambient-shadow">
                  <div className="abt-stat-value">{settings ? `${settings.studentsTrainedCount}+` : "5000+"}</div>
                  <div className="abt-stat-label">Students Trained</div>
                </div>
                <div className="abt-stat-card ambient-shadow">
                  <div className="abt-stat-value">{settings ? `${settings.collegePartnersCount}+` : "100+"}</div>
                  <div className="abt-stat-label">Hiring Partners</div>
                </div>
                <div className="abt-stat-card ambient-shadow">
                  <div className="abt-stat-value">{settings ? `${settings.placementAssistancePercentage}%` : "80%"}</div>
                  <div className="abt-stat-label">Placement Goal</div>
                </div>
              </div>

            </div>
          </section>

          {/* VISION & MISSION SECTION */}
          <section className="abt-vision-mission">
            <div className="abt-glass-card ambient-shadow group">
              <div className="abt-vm-icon">
                <span className="material-symbols-outlined">visibility</span>
              </div>
              <h2 className="abt-section-title">Vision</h2>
              <p className="abt-vm-text">
                To become a leading platform bridging the gap between education and industry by empowering students with job-ready skills and delivering highly trained talent to organizations worldwide.
              </p>
            </div>

            <div className="abt-glass-card ambient-shadow group">
              <div className="abt-vm-icon">
                <span className="material-symbols-outlined">flag</span>
              </div>
              <h2 className="abt-section-title">Mission</h2>
              <p className="abt-vm-text">
                Our mission is to equip fresh graduates with practical, industry-relevant skills through cutting-edge training, internship support, and innovative Hire-Train-Deploy (HTD) solutions. <br /><br />
                We aim to enhance employability, create career opportunities, and help organizations meet their talent needs efficiently and effectively.
              </p>
            </div>
          </section>

          {/* GOALS SECTION */}
          <section className="abt-section">
            <h2 className="abt-section-header">Our Goals</h2>
            <div className="abt-goals-grid">

              <div className="abt-card ambient-shadow group">
                <span className="material-symbols-outlined abt-card-icon">auto_stories</span>
                <p className="abt-card-text">Customized curriculum tailored to individual learning pace and career goals</p>
              </div>

              <div className="abt-card ambient-shadow group">
                <span className="material-symbols-outlined abt-card-icon">group</span>
                <p className="abt-card-text">Train and certify 5,000+ students in emerging technologies within 3 years</p>
              </div>

              <div className="abt-card ambient-shadow group">
                <span className="material-symbols-outlined abt-card-icon">handshake</span>
                <p className="abt-card-text">Partner with 100+ companies for HTD implementation</p>
              </div>

              <div className="abt-card ambient-shadow group">
                <span className="material-symbols-outlined abt-card-icon">work</span>
                <p className="abt-card-text">Facilitate internships for 1,000 students annually</p>
              </div>

              <div className="abt-card ambient-shadow group">
                <span className="material-symbols-outlined abt-card-icon">psychology</span>
                <p className="abt-card-text">Develop industry-ready, high-quality candidates</p>
              </div>

              <div className="abt-card ambient-shadow group">
                <span className="material-symbols-outlined abt-card-icon">trending_up</span>
                <p className="abt-card-text">Achieve 80% job placement success rate</p>
              </div>

              <div className="abt-card ambient-shadow group abt-card-span">
                <span className="material-symbols-outlined abt-card-icon">sync</span>
                <p className="abt-card-text">Continuously update programs to match industry demands</p>
              </div>

            </div>
          </section>
        </div>

        {/* WHY AGENTICX SECTION */}
        <WhyAgenticX />

      </div>
    </div>
  )
}
