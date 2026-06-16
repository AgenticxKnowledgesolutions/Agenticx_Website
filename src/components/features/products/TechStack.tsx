import styles from './TechStack.module.css';

export default function TechStack() {
  const techStack = {
    Frontend: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Tailwind CSS',
      'HTML5',
      'CSS3',
      'Redux',
      'Zustand',
      'Vite'
    ],

    Backend: [
      'FastAPI',
      'Django',
      'Node.js',
      'Python',
      'Express.js',
      'REST APIs',
      'JWT Authentication',
      'WebSockets',
      'Microservices'
    ],

    Database: [
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'MySQL',
      'SQLite',
      'SQLAlchemy'
    ],

    'Mobile Development': [
      'React Native',
      'Android Applications',
      'Cross Platform Apps',
      'Mobile UI/UX',
      'App Integrations'
    ],

    'AI & Machine Learning': [
      'LangChain',
      'RAG',
      'Vector Databases',
      'Embeddings',
      'Machine Learning',
      'NLP',
      'Document Intelligence',
      'AI Chatbots',
      'Recommendation Systems'
    ],

    'AI Agents & Automation': [
      'AI Agents',
      'Multi-Agent Systems',
      'Workflow Automation',
      'Business Process Automation',
      'Agent Orchestration',
      'Autonomous Workflows',
      'Email Automation',
      'Lead Automation'
    ],

    'Cloud & DevOps': [
      'Docker',
      'Linux',
      'Nginx',
      'GitHub Actions',
      'CI/CD',
      'Cloud Hosting',
      'Vercel',
      'VPS Deployment',
      'SSL',
      'Cloudflare'
    ],

    'SaaS & Enterprise Solutions': [
      'SaaS Platforms',
      'CRM Systems',
      'Admin Dashboards',
      'ERP Solutions',
      'Learning Management Systems',
      'Multi-Tenant Applications',
      'Subscription Systems',
      'Role-Based Access Control'
    ],

    'Integrations & APIs': [
      'REST APIs',
      'Third-Party Integrations',
      'Payment Gateways',
      'WhatsApp APIs',
      'Email Services',
      'Authentication Providers',
      'Webhook Systems',
      'Google APIs'
    ],

  };

  return (
    <section className={styles.techSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Our Technology Stack</h2>
        <p className={styles.sectionDesc}>
          We build scalable, modular, and future-proof systems using modern technology frameworks.
        </p>
      </div>

      <div className={styles.techCategoriesGrid}>
        {Object.entries(techStack).map(([category, items]) => (
          <div key={category} className={styles.techCategoryCard}>
            <h4 className={styles.categoryTitle}>{category}</h4>
            <div className={styles.chipsContainer}>
              {items.map((item) => (
                <span key={item} className={styles.techChip}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
