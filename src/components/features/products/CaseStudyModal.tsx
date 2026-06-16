import { useEffect } from 'react';
import styles from './CaseStudyModal.module.css';

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CaseStudyModal({ isOpen, onClose }: CaseStudyModalProps) {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStartProjectClick = () => {
    onClose();
    const event = new CustomEvent('open-ai-assistant', { 
      detail: { message: 'I would like to start a custom software/AI project.' } 
    });
    window.dispatchEvent(event);
  };

  const handleBookConsultationClick = () => {
    onClose();
    const event = new CustomEvent('open-ai-assistant', { 
      detail: { message: 'How can I book a product/AI consultation with AgenticX?' } 
    });
    window.dispatchEvent(event);
  };

  const businessObjectives = [
    { name: 'Lead Generation', icon: 'ads_click' },
    { name: 'Course Management', icon: 'menu_book' },
    { name: 'Internship Programs', icon: 'work' },
    { name: 'SEO Growth', icon: 'trending_up' },
    { name: 'AI Engagement', icon: 'smart_toy' },
    { name: 'Corporate Training', icon: 'co_present' },
    { name: 'Automation Ready', icon: 'settings_suggest' },
    { name: 'Future LMS Expansion', icon: 'school' }
  ];

  const featuresDelivered = [
    { title: 'Marketing Website', desc: 'Premium, fully animated marketing front-end highlighting corporate training and career solutions.', icon: 'desktop_windows' },
    { title: 'Dynamic Course Pages', desc: 'Optimized learning pages detailing curriculum, mentors, schedules, and enrollment forms.', icon: 'auto_stories' },
    { title: 'Internship Management', desc: 'Workflows for internship applications, verification, certificate issuance, and status tracking.', icon: 'assignment' },
    { title: 'Blog CMS', desc: 'Fully operational Content Management System for technical articles, news, and SEO content publishing.', icon: 'article' },
    { title: 'Testimonials System', desc: 'Interactive feedback engine capturing verified student recommendations and corporate validation.', icon: 'thumbs_up_down' },
    { title: 'Lead Capture Forms', desc: 'Smart contextual forms connected to lead routing pipelines with geo-location detection.', icon: 'edit_note' },
    { title: 'Demo Booking System', desc: 'Interactive calendar booking for enterprise consulting sessions and course counseling.', icon: 'calendar_month' },
    { title: 'Contact Management', desc: 'Centralized storage for general queries, partner programs, and customer communications.', icon: 'contact_page' },
    { title: 'Admin Dashboard', desc: 'Console for student tracking, lead metrics, course uploads, and counselor productivity analytics.', icon: 'dashboard' },
    { title: 'SEO Optimization', desc: 'Meta tag dynamic routing, schema markup injection, and sitemap generation for maximum search visibility.', icon: 'search' },
    { title: 'Analytics Integration', desc: 'Integrated visitor tracking, conversion funnels, event monitoring, and lead attribution analysis.', icon: 'monitoring' },
    { title: 'AI Assistant', desc: 'Embedded RAG AI support agent handling course discovery, instant FAQ, and automated lead triage.', icon: 'chat' },
    { title: 'CRM-Ready Architecture', desc: 'Standard schema layers making it trivial to pipe captured records straight to Salesforce or HubSpot.', icon: 'hub' },
    { title: 'Scalable Backend APIs', desc: 'Asynchronous, secure FastAPI services processing files, authentication, and state management.', icon: 'dns' }
  ];

  const aiCapabilities = [
    'Context-aware AI conversations',
    'Course and service recommendations',
    'FAQ resolution',
    'Lead qualification workflows',
    'Contact information capture',
    'Demo booking assistance',
    'Business enquiry collection',
    '24/7 customer engagement',
    'Personalized user guidance',
    'Intelligent lead nurturing'
  ];

  const aiTechConcepts = [
    'Retrieval-Augmented Generation (RAG)',
    'Semantic Search',
    'Knowledge Base Retrieval',
    'Intelligent Document Chunking',
    'Vector Embeddings',
    'Context Injection',
    'Prompt Engineering',
    'Workflow Automation',
    'Lead Routing Logic',
    'Context Memory Management'
  ];

  const aiKnowledgeSources = [
    'Courses',
    'Internship Programs',
    'Services',
    'Company Information',
    'FAQs',
    'Placement Information',
    'Blog Content',
    'Training Programs',
    'Career Guidance Resources',
    'Internal Business Documentation'
  ];

  const aiBusinessImpacts = [
    'Reduced response time',
    'Improved lead engagement',
    'Automated enquiry handling',
    'Better visitor retention',
    'Increased lead conversion opportunities',
    'Reduced manual support workload',
    'Improved customer experience',
    'Higher lead qualification accuracy'
  ];

  const aiWorkflowIntegrations = [
    'CRM Systems',
    'Lead Management Platforms',
    'Email Automation',
    'WhatsApp Workflows',
    'Booking Systems',
    'Customer Support Pipelines',
    'Internal Business Applications',
    'Analytics Platforms',
    'Marketing Automation Systems'
  ];

  const aiRoadmapItems = [
    'Voice AI Assistants',
    'Multi-Agent Systems',
    'WhatsApp AI Agents',
    'Automated Lead Qualification',
    'Appointment Scheduling Agents',
    'AI-Powered Customer Success Workflows',
    'Enterprise Knowledge Assistants',
    'Autonomous Business Workflows'
  ];

  const techStack = {
    frontend: ['React', 'TypeScript', 'Vite', 'CSS Modules'],
    backend: ['FastAPI', 'Python', 'REST APIs', 'JWT Authentication'],
    database: ['PostgreSQL', 'SQLAlchemy'],
    infrastructure: ['Nginx', 'Cloudflare', 'Linux', 'Docker Ready'],
    ai: ['RAG', 'Knowledge Bases', 'Embeddings', 'Semantic Search', 'Prompt Engineering', 'Workflow Automation']
  };

  const architectureHighlights = [
    { title: 'Frontend Architecture', desc: 'SPA built with React, Vite, and CSS Modules, featuring clean layout composition, zero horizontal page bleed, and modular styling.', icon: 'view_quilt' },
    { title: 'Backend Services', desc: 'FastAPI REST backend with async endpoints, dependency injection, and automatic OpenAPI schema documentation generation.', icon: 'api' },
    { title: 'Database Layer', desc: 'Relational PostgreSQL engine optimized with relational models, indexing on lookup criteria, and connection pooling.', icon: 'database' },
    { title: 'Authentication', desc: 'Secure OAuth2 JWT token bearer credentials, salted password hashing, and role-based route access controls.', icon: 'lock' },
    { title: 'AI Layer', desc: 'Vector embedding matching pipelines combining semantic search indices with LLM context completion overlays.', icon: 'neurology' },
    { title: 'Deployment Infrastructure', desc: 'Reverse-proxied Nginx gateway managing SSL terminations, caching rules, and serving built assets efficiently.', icon: 'cloud' },
    { title: 'Scalability Strategy', desc: 'Decoupled API architecture ready to migrate into independent microservices or containerized serverless modules.', icon: 'grid_view' },
    { title: 'Security Practices', desc: 'Implementation of CORS controls, custom middleware filters, sanitized inputs, and encrypted database session instances.', icon: 'shield' }
  ];

  const outcomes = [
    { title: 'Centralized Operations', desc: 'Replaced multiple disjointed platforms with a single CRM/CMS-integrated marketing portal.', icon: 'hub' },
    { title: 'Improved Lead Capture', desc: 'Direct lead parsing pipeline capturing inquiries instantly with attribution parameters.', icon: 'contact_mail' },
    { title: 'AI-Powered Engagement', desc: 'Enabled immediate 24/7 client triage and automated responses via RAG AI support layers.', icon: 'support_agent' },
    { title: 'SEO Optimized', desc: 'Improved ranking potential through static meta tags, fast loading speeds, and semantic structuring.', icon: 'query_stats' },
    { title: 'Automation Ready', desc: 'Built-in event triggers ready to fire automated notifications and data synchronizations.', icon: 'dynamic_form' },
    { title: 'LMS Ready', desc: 'Flexible relational data schemas designed to integrate modules, lessons, and progress tracking.', icon: 'local_library' },
    { title: 'Scalable Architecture', desc: 'High-performance components processing hundreds of queries concurrently without lag.', icon: 'speed' },
    { title: 'Future Expansion Ready', desc: 'Modular codebase and clean schemas facilitating expansion into portals and mobile services.', icon: 'add_circle' }
  ];

  const roadmap = [
    { title: 'Student Portal', desc: 'Personal dashboard for course tracking, assignments, and grades.' },
    { title: 'Trainer Portal', desc: 'Instructor workspace for class scheduling, reviews, and materials.' },
    { title: 'Learning Management System', desc: 'Interactive lessons, media players, and quizzes.' },
    { title: 'Attendance Tracking', desc: 'Automated attendance records for corporate compliance.' },
    { title: 'Certificate Generation', desc: 'Crypto-verifiable digital achievement certificates.' },
    { title: 'CRM Expansion', desc: 'Advanced customer support modules and sales forecasting tools.' },
    { title: 'AI Agents', desc: 'Autonomous customer agents managing complex booking workflows.' },
    { title: 'Workflow Automation', desc: 'No-code workflow building blocks for administrative tasks.' },
    { title: 'Mobile Applications', desc: 'Dedicated native apps for iOS and Android.' },
    { title: 'Enterprise Integrations', desc: 'Ready-made connectors for Workday, Salesforce, and SAP.' }
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        
        {/* Header Navigation */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleContainer}>
            <span className={styles.caseStudyBadge}>Case Study Showcase</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close Modal">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className={styles.modalContent}>
          
          {/* HERO SECTION */}
          <section className={styles.heroSection}>
            <div className={styles.heroGlow}></div>
            <h1 className={styles.heroTitle}>AgenticX Platform</h1>
            <p className={styles.heroSubtitle}>Building a Modern AI-Powered EdTech & Business Ecosystem</p>
            <p className={styles.heroDescription}>
              A full-stack platform designed to centralize lead generation, training programs, internships, content publishing, AI-powered customer engagement, and future LMS capabilities into a single scalable ecosystem.
            </p>
          </section>

          {/* PROJECT OVERVIEW */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Project Overview</h2>
            <div className={styles.overviewGrid}>
              <div className={styles.overviewText}>
                <p>
                  The AgenticX Platform was created to unify several decoupled systems under a single, highly performant administrative and marketing workspace. Previously, student lead acquisition, content publishing, internship verifications, and student records lived on disparate tools, creating operational gaps.
                </p>
                <p>
                  To address this, we engineered a scalable React front-end powered by a highly responsive FastAPI backend. The result is a unified platform optimized for fast loading times, rich animations, search engine visibility (SEO), and future expansion into a complete learning management system.
                </p>
              </div>
              <div className={styles.overviewMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Focus Areas</span>
                  <span className={styles.metaValue}>Lead Management, Student Acquisition, CMS, AI Automation, LMS Readiness</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Built For</span>
                  <span className={styles.metaValue}>Scalability & Multi-Tenant Operations</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Design Style</span>
                  <span className={styles.metaValue}>Premium Glassmorphism & Fluid Layouts</span>
                </div>
              </div>
            </div>
          </section>

          {/* BUSINESS OBJECTIVES */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Business Objectives</h2>
            <div className={styles.objectivesGrid}>
              {businessObjectives.map((obj, idx) => (
                <div key={idx} className={styles.objectiveCard}>
                  <span className={`material-symbols-outlined ${styles.objectiveIcon}`}>{obj.icon}</span>
                  <span className={styles.objectiveName}>{obj.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* FEATURES DELIVERED */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Features Delivered</h2>
            <div className={styles.featuresGrid}>
              {featuresDelivered.map((feat, idx) => (
                <div key={idx} className={styles.featureCard}>
                  <div className={styles.featureHeader}>
                    <span className={`material-symbols-outlined ${styles.featureIcon}`}>{feat.icon}</span>
                    <h3 className={styles.featureTitle}>{feat.title}</h3>
                  </div>
                  <p className={styles.featureDesc}>{feat.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* AI ASSISTANT & INTELLIGENT LEAD AUTOMATION */}
          <section className={`${styles.section} ${styles.aiSection}`}>
            <div className={styles.aiBorderGlow}></div>
            <div className={styles.aiHeaderBlock}>
              <span className={`material-symbols-outlined ${styles.aiHeroIcon}`}>smart_toy</span>
              <h2 className={styles.aiSectionTitle}>AI Assistant & Intelligent Lead Automation</h2>
            </div>
            <p className={styles.aiMainDesc}>
              The AgenticX AI Assistant was built as an intelligent customer engagement and lead automation system designed to improve user experience, answer enquiries instantly, qualify prospects, and automate business workflows.
            </p>
            <button 
              className={styles.tryAiBtn} 
              onClick={() => {
                onClose();
                const event = new CustomEvent('open-ai-assistant', { 
                  detail: { message: 'Tell me about AI Solutions' } 
                });
                window.dispatchEvent(event);
              }}
            >
              <span className="material-symbols-outlined">chat</span>
              Try the Live Assistant Widget
            </button>

            <div className={styles.aiSubGrid}>
              
              {/* Capabilities */}
              <div className={styles.aiCard}>
                <h3 className={styles.aiCardTitle}>Core Capabilities</h3>
                <ul className={styles.aiList}>
                  {aiCapabilities.map((item, idx) => (
                    <li key={idx}><span className={styles.bullet}>✦</span> {item}</li>
                  ))}
                </ul>
              </div>

              {/* RAG & Concepts */}
              <div className={styles.aiCard}>
                <h3 className={styles.aiCardTitle}>AI Architecture & Concepts</h3>
                <p className={styles.aiCardSub}>Retrieval-Augmented Generation (RAG)</p>
                <div className={styles.chipGrid}>
                  {aiTechConcepts.map((item, idx) => (
                    <span key={idx} className={styles.techChip}>{item}</span>
                  ))}
                </div>
              </div>

              {/* Knowledge Base Sources */}
              <div className={styles.aiCard}>
                <h3 className={styles.aiCardTitle}>Knowledge Base Sources</h3>
                <div className={styles.chipGrid}>
                  {aiKnowledgeSources.map((item, idx) => (
                    <span key={idx} className={`${styles.techChip} ${styles.sourceChip}`}>{item}</span>
                  ))}
                </div>
              </div>

              {/* Business Impact */}
              <div className={styles.aiCard}>
                <h3 className={styles.aiCardTitle}>Business Impact</h3>
                <ul className={styles.aiList}>
                  {aiBusinessImpacts.map((item, idx) => (
                    <li key={idx}><span className={styles.bullet}>✦</span> {item}</li>
                  ))}
                </ul>
              </div>

              {/* Workflow Integrations */}
              <div className={styles.aiCard}>
                <h3 className={styles.aiCardTitle}>Workflow Integrations</h3>
                <div className={styles.chipGrid}>
                  {aiWorkflowIntegrations.map((item, idx) => (
                    <span key={idx} className={`${styles.techChip} ${styles.integrationChip}`}>{item}</span>
                  ))}
                </div>
              </div>

              {/* Future Roadmap */}
              <div className={styles.aiCard}>
                <h3 className={styles.aiCardTitle}>Future AI Roadmap</h3>
                <ul className={styles.aiList}>
                  {aiRoadmapItems.map((item, idx) => (
                    <li key={idx}><span className={styles.bullet}>✦</span> {item}</li>
                  ))}
                </ul>
              </div>

            </div>
          </section>

          {/* TECHNOLOGY STACK */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Technology Stack</h2>
            <div className={styles.techStackContainer}>
              <div className={styles.techRow}>
                <span className={styles.techRowLabel}>Frontend</span>
                <div className={styles.chipGrid}>
                  {techStack.frontend.map((item, idx) => (
                    <span key={idx} className={`${styles.techChip} ${styles.stackChip}`}>{item}</span>
                  ))}
                </div>
              </div>
              <div className={styles.techRow}>
                <span className={styles.techRowLabel}>Backend</span>
                <div className={styles.chipGrid}>
                  {techStack.backend.map((item, idx) => (
                    <span key={idx} className={`${styles.techChip} ${styles.stackChip}`}>{item}</span>
                  ))}
                </div>
              </div>
              <div className={styles.techRow}>
                <span className={styles.techRowLabel}>Database</span>
                <div className={styles.chipGrid}>
                  {techStack.database.map((item, idx) => (
                    <span key={idx} className={`${styles.techChip} ${styles.stackChip}`}>{item}</span>
                  ))}
                </div>
              </div>
              <div className={styles.techRow}>
                <span className={styles.techRowLabel}>Infrastructure</span>
                <div className={styles.chipGrid}>
                  {techStack.infrastructure.map((item, idx) => (
                    <span key={idx} className={`${styles.techChip} ${styles.stackChip}`}>{item}</span>
                  ))}
                </div>
              </div>
              <div className={styles.techRow}>
                <span className={styles.techRowLabel}>AI & Automation</span>
                <div className={styles.chipGrid}>
                  {techStack.ai.map((item, idx) => (
                    <span key={idx} className={`${styles.techChip} ${styles.stackChip}`}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ARCHITECTURE HIGHLIGHTS */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Architecture Highlights</h2>
            <div className={styles.architectureGrid}>
              {architectureHighlights.map((arch, idx) => (
                <div key={idx} className={styles.archCard}>
                  <div className={styles.archHeader}>
                    <span className={`material-symbols-outlined ${styles.archIcon}`}>{arch.icon}</span>
                    <h3 className={styles.archTitle}>{arch.title}</h3>
                  </div>
                  <p className={styles.archDesc}>{arch.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* RESULTS & OUTCOMES */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Results & Outcomes</h2>
            <div className={styles.outcomesGrid}>
              {outcomes.map((out, idx) => (
                <div key={idx} className={styles.outcomeCard}>
                  <div className={styles.outcomeHeader}>
                    <span className={`material-symbols-outlined ${styles.outcomeIcon}`}>{out.icon}</span>
                    <h3 className={styles.outcomeTitle}>{out.title}</h3>
                  </div>
                  <p className={styles.outcomeDesc}>{out.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FUTURE ROADMAP */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Future Roadmap</h2>
            <div className={styles.roadmapGrid}>
              {roadmap.map((item, idx) => (
                <div key={idx} className={styles.roadmapCard}>
                  <div className={styles.roadmapIndex}>0{idx + 1}</div>
                  <h3 className={styles.roadmapTitle}>{item.title}</h3>
                  <p className={styles.roadmapDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FINAL CTA */}
          <section className={styles.ctaSection}>
            <div className={styles.ctaGlow}></div>
            <h2 className={styles.ctaTitle}>Need a Similar Platform?</h2>
            <p className={styles.ctaDescription}>
              We build custom software platforms, AI solutions, SaaS products, automation systems, and enterprise applications tailored to your business needs.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.ctaPrimaryBtn} onClick={handleStartProjectClick}>
                Start Your Project
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className={styles.ctaSecondaryBtn} onClick={handleBookConsultationClick}>
                Book a Consultation
                <span className="material-symbols-outlined">event</span>
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
