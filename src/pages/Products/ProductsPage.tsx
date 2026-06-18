import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NeuralCanvas from '@/components/ui/NeuralCanvas';
import SolutionsWeBuild from '@/components/features/products/SolutionsWeBuild';
import TechStack from '@/components/features/products/TechStack';
import ProjectCta from '@/components/features/products/ProjectCta';
import CaseStudyModal from '@/components/features/products/CaseStudyModal';
import styles from './ProductsPage.module.css';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  features: string[];
  status: 'LIVE' | 'COMING SOON';
  route?: string;
  externalUrl?: string;
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const liveProducts: Product[] = [
    {
      id: 'resume-builder',
      name: 'Resume Builder',
      category: 'AI-Powered Career Tool',
      description: 'Create professional ATS-friendly resumes in minutes with intelligent resume generation and recruiter-approved modern templates.',
      icon: 'description',
      features: ['ATS-Optimized Formatting', 'Instant PDF Export', 'Real-time Content Tailoring'],
      status: 'LIVE',
      externalUrl: 'https://agenticx-resume-builder.streamlit.app/'
    },
    {
      id: 'agenticx-platform',
      name: 'AgenticX Enterprise Portal',
      category: 'Full-Stack Business Solution',
      description: 'A custom-built enterprise ecosystem featuring automated candidate onboarding workflows, document managers, and counselor settings panels.',
      icon: 'hub',
      features: ['Lead Lifecycle Tracking', 'Interactive Document Manager', 'Real-time Analytics Dashboard'],
      status: 'LIVE',
      route: '/'
    }
  ];

  const upcomingProducts = [
    { name: 'AI Resume Analyzer', desc: 'Scan and compare resumes against target job descriptions for instant ATS scoring.', icon: 'analytics' },
    { name: 'Interview Preparation Assistant', desc: 'Practice mock technical and soft-skill interviews with real-time AI feedback.', icon: 'forum' },
    { name: 'ATS Score Checker', desc: 'Audit resume layout parsing accuracy and find formatting issues before applying.', icon: 'rule' },
    { name: 'Portfolio Builder', desc: 'Convert resume or github profiles into responsive, hosted personal websites in seconds.', icon: 'web' },
    { name: 'Career Roadmap Generator', desc: 'Generate personalized technical learning tracks based on role and skill gaps.', icon: 'alt_route' },
    { name: 'AI Career Mentor', desc: 'Receive constant, data-driven mentoring on skill acquisition and placement options.', icon: 'psychology' }
  ];

  return (
    <div className={styles.productsPage}>
      {/* Background Particles Canvas */}
      <NeuralCanvas nodeCount={35} />

      <div className={styles.contentWrapper}>
        <div className="container">

          {/* HERO SECTION */}
          <section className={styles.heroSection}>
            <div className={styles.heroBadge}>
              <span className={styles.badgeText}>Software &amp; AI Engineering</span>
            </div>
            <h1 className={`${styles.heroTitle} glow-text`}>
              Products, Platforms &amp; <span className={styles.textSecondary}>AI Solutions</span>
            </h1>
            <p className={styles.heroSubtitle}>
              We design and build modern web applications, AI-powered tools, intelligent automations, and scalable software solutions for businesses, startups, and professionals.
            </p>
            <div className={styles.heroActions}>
              <a href="#products" className={styles.primaryBtn} aria-label="Explore Products">
                Explore Products
              </a>
              <button
                onClick={() => navigate('/contact')}
                className={styles.secondaryBtn}
                aria-label="Start a Project"
              >
                Start a Project
              </button>
            </div>
          </section>

          {/* FEATURED PRODUCTS SECTION */}
          <section id="products" className={styles.showcaseSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Featured Products</h2>
              <p className={styles.sectionDesc}>
                Explore proprietary tools and software systems built, deployed, and maintained by the AgenticX engineering team.
              </p>
            </div>

            <div className={styles.featuredGrid}>
              {liveProducts.map((product) => (
                <div key={product.id} className={styles.featuredCard}>
                  <div className={styles.cardHeaderRow}>
                    <div className={styles.productIconWrapper}>
                      <span className="material-symbols-outlined">{product.icon}</span>
                    </div>
                    <span className={styles.liveBadge}>{product.status}</span>
                  </div>

                  <div className={styles.categoryLabel}>{product.category}</div>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productDescription}>{product.description}</p>

                  <div className={styles.featuresList}>
                    {product.features.map((feature, i) => (
                      <div key={i} className={styles.featureItem}>
                        <span className="material-symbols-outlined">check_circle</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      if (product.id === 'agenticx-platform') {
                        setIsCaseStudyOpen(true);
                      } else if (product.externalUrl) {
                        window.open(
                          product.externalUrl,
                          '_blank',
                          'noopener,noreferrer'
                        );
                      } else if (product.route) {
                        navigate(product.route);
                      }
                    }}
                    className={styles.launchBtn}
                  >
                    {product.id === 'agenticx-platform' ? 'View Case Study' : 'Launch Product'}
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* COMING SOON PRODUCTS */}
          <section className={styles.upcomingSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Products in Development</h2>
              <p className={styles.sectionDesc}>
                A preview of upcoming AI-powered tools and SaaS platforms currently being developed in our lab.
              </p>
            </div>

            <div className={styles.upcomingGrid}>
              {upcomingProducts.map((product, idx) => (
                <div key={idx} className={styles.upcomingCard}>
                  <div className={styles.upcomingHeader}>
                    <div className={styles.upcomingIconWrapper}>
                      <span className="material-symbols-outlined">{product.icon}</span>
                    </div>
                    <span className={styles.comingSoonBadge}>Coming Soon</span>
                  </div>
                  <h4 className={styles.upcomingName}>{product.name}</h4>
                  <p className={styles.upcomingDesc}>{product.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SOLUTIONS WE BUILD */}
          <SolutionsWeBuild />

          {/* TECHNOLOGY EXPERTISE */}
          <TechStack />

          {/* PROJECT SHOWCASE CTA */}
          <ProjectCta />

        </div>
      </div>
      <CaseStudyModal isOpen={isCaseStudyOpen} onClose={() => setIsCaseStudyOpen(false)} />
    </div>
  );
}
