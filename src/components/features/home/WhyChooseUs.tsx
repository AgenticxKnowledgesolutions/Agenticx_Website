import teamCollaborationImg from '@/assets/images/about/team-collaboration.jpg'
import './WhyChooseUs.css'

export default function WhyChooseUs() {
  return (
    <section className="why-section">
      <div className="container why-grid">
        <div>
          <h2 className="why-title">Engineering the Workforce of Tomorrow</h2>
          <p className="why-desc">We bridge the gap between academic theory and commercial reality using a three-pillared methodology.</p>
          <div className="why-features">
            <div className="why-feature">
              <div className="why-feature-icon-wrapper">
                <span className="material-symbols-outlined why-feature-icon" data-icon="verified">verified</span>
              </div>
              <div>
                <h4 className="why-feature-title">Rigorous Validation</h4>
                <p className="why-feature-text">Every student passes a multi-stage technical audit before being certified for hiring.</p>
              </div>
            </div>
            <div className="why-feature">
              <div className="why-feature-icon-wrapper">
                <span className="material-symbols-outlined why-feature-icon" data-icon="rocket_launch">rocket_launch</span>
              </div>
              <div>
                <h4 className="why-feature-title">Accelerated Trajectory</h4>
                <p className="why-feature-text">Our graduates reach senior-level productivity 40% faster than standard hires.</p>
              </div>
            </div>
            <div className="why-feature">
              <div className="why-feature-icon-wrapper">
                <span className="material-symbols-outlined why-feature-icon" data-icon="handshake">handshake</span>
              </div>
              <div>
                <h4 className="why-feature-title">Partnership Driven</h4>
                <p className="why-feature-text">Curriculum co-designed with CTOs from Fortune tech companies.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="why-image-wrapper">
          <div className="why-image-inner">
            <img className="why-image" alt="A diverse group of professional colleagues collaborating around a computer screen in a bright modern office" src={teamCollaborationImg} />
          </div>
          <div className="why-stat-card">
            <div className="why-stat-value">100%</div>
            <div className="why-stat-label">EMPLOYER SATISFACTION</div>
          </div>
        </div>
      </div>
    </section>
  )
}
