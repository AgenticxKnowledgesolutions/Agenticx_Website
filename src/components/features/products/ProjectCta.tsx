import { useNavigate } from 'react-router-dom';
import styles from './ProjectCta.module.css';

export default function ProjectCta() {
  const navigate = useNavigate();

  return (
    <section className={styles.projectCtaSection}>
      <div className={styles.ctaContent}>
        <h2 className={styles.ctaTitle}>Need a Custom Product Built?</h2>
        <p className={styles.ctaDesc}>
          We help businesses, startups, and organizations build scalable web applications, AI-powered solutions, automation systems, and custom software products. Let's discuss your requirements.
        </p>
        <div className={styles.ctaActions}>
          <button 
            onClick={() => navigate('/contact')}
            className={styles.ctaLaunchBtn}
            aria-label="Start a Project"
          >
            Start a Project
          </button>
          <button 
            onClick={() => navigate('/contact')}
            className={styles.ctaContactBtn}
            aria-label="Book Consultation"
          >
            Book Consultation
          </button>
        </div>
      </div>
    </section>
  );
}
