import styles from './SolutionsWeBuild.module.css';

interface Solution {
  title: string;
  description: string;
  outcome: string;
  techFocus: string[];
  icon: string;
}

export default function SolutionsWeBuild() {
  const solutions: Solution[] = [
    {
      title: 'Full Stack Web Development',
      description: 'Custom, secure web applications engineered with modern layouts, robust API architectures, and seamless state management.',
      outcome: 'Scalable, performant portals optimized for client retention and high conversion rates.',
      techFocus: ['React', 'TypeScript', 'FastAPI', 'Node.js'],
      icon: 'language'
    },
    {
      title: 'AI Agent Development',
      description: 'Autonomous agents capable of executing multi-step business logic, data entry, customer communication, and analysis.',
      outcome: 'Drastic reductions in operational overhead and round-the-clock task execution.',
      techFocus: ['OpenAI', 'LangChain', 'Python', 'AI Agents'],
      icon: 'memory'
    },
    {
      title: 'AI Workflow Automation',
      description: 'End-to-end integration of business systems with AI checkpoints to process invoices, scan documents, or generate content.',
      outcome: 'Error-free, optimized business processing pipelines operating at machine speed.',
      techFocus: ['Gemini API', 'RAG', 'N8N / Make', 'FastAPI'],
      icon: 'schema'
    },
    {
      title: 'Business Process Automation',
      description: 'Eliminate manual excel reporting and repetitive emails by connecting CRMs, databases, and third-party tools.',
      outcome: 'Streamlined staff workflows allowing team members to focus on high-value strategy.',
      techFocus: ['Zapier', 'PostgreSQL', 'Python scripting', 'APIs'],
      icon: 'sync'
    },
    {
      title: 'Custom SaaS Platforms',
      description: 'Design and deployment of multi-tenant cloud products, including subscription models, Stripe APIs, and member spaces.',
      outcome: 'A production-ready SaaS product designed to scale to thousands of active users.',
      techFocus: ['React', 'Next.js', 'PostgreSQL', 'Docker'],
      icon: 'cloud_done'
    },
    {
      title: 'Web & Mobile Applications',
      description: 'Native and cross-platform mobile apps for iOS and Android built in sync with web application dashboards.',
      outcome: 'Omnichannel presence with synchronized user experience and fast response rates.',
      techFocus: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
      icon: 'phone_iphone'
    },
    {
      title: 'Internal Business Tools',
      description: 'Tailored administrative systems, custom CRM modules, inventory dashboards, and candidate tracking pipelines.',
      outcome: 'Clean, simplified information systems designed directly around your company workflows.',
      techFocus: ['TypeScript', 'FastAPI', 'PostgreSQL', 'Zustand'],
      icon: 'admin_panel_settings'
    },
    {
      title: 'Dashboard Systems',
      description: 'Interactive analytics hubs displaying multi-source data feeds, user behaviors, and key financial graphs.',
      outcome: 'Immediate data clarity enabling strategic business decisions.',
      techFocus: ['React Chartjs', 'D3.js', 'FastAPI', 'SQL'],
      icon: 'dashboard'
    },
    {
      title: 'CRM Solutions',
      description: 'Custom customer relationship management modules with contact tagging, notification queues, and automated follow-ups.',
      outcome: 'Higher sales team conversion rates and unified communication logs.',
      techFocus: ['React', 'FastAPI', 'SMTP Mailers', 'Twilio'],
      icon: 'contact_support'
    }
  ];

  return (
    <section className={styles.solutionsSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Solutions We Build</h2>
        <p className={styles.sectionDesc}>
          We combine modern engineering practices with generative AI models to deliver custom technology platforms that solve business problems.
        </p>
      </div>

      <div className={styles.solutionsGrid}>
        {solutions.map((sol, idx) => (
          <div key={idx} className={styles.solutionCard}>
            <div className={styles.solutionIconWrapper}>
              <span className="material-symbols-outlined">{sol.icon}</span>
            </div>
            <h3 className={styles.solutionTitle}>{sol.title}</h3>
            <p className={styles.solutionDesc}>{sol.description}</p>
            
            <div className={styles.outcomeContainer}>
              <span className={styles.outcomeLabel}>Business Value:</span>
              <span className={styles.outcomeText}>{sol.outcome}</span>
            </div>

            <div className={styles.techTags}>
              {sol.techFocus.map((tech) => (
                <span key={tech} className={styles.techTag}>{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
