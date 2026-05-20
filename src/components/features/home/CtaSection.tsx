import './CtaSection.css';

export default function CtaSection({ onOpenDemo }: { onOpenDemo?: () => void }) {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-card">
          <div className="cta-bg-glow"></div>
          
          <h2 className="cta-title">
            Ready to Drive Your Career Forward?
          </h2>

          <p className="cta-desc">
            Join the next cohort of data-driven systems developers. Limited seats available for the Autumn intake.
          </p>

          <div className="cta-actions">
            <button
              type="button"
              onClick={onOpenDemo}
              aria-label="Book a Free Demo"
              className="btn-cta-primary"
            >
              Book Free Demo
            </button>

            <button
              type="button"
              aria-label="View course curriculum"
              className="btn-cta-outline"
            >
              View Curriculum
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}