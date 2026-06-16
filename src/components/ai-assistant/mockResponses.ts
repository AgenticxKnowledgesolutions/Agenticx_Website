export interface MockResponse {
  keywords: string[];
  response: string;
}

export const mockResponses: Record<string, string> = {
  courses: `📚 **AgenticX Career Tracks**
We offer industry-aligned career tracks designed to build real-world competency:

• **Full-Stack Development Track**: Master React, Node.js, Next.js, and cloud deployment pipelines.
• **AI & Agentic Systems Track**: Learn Prompt Engineering, Retrieval-Augmented Generation (RAG), Semantic Search, and LLM integrations.
• **Advanced Python & FastAPI**: Build scalable backend microservices, database schemas, and JWT security models.

*All programs include 1-on-1 mentorship, live project development, and placement assistance.*`,

  internships: `💼 **AgenticX Internship Program**
Our structured internships bridge the gap between academic theory and industry engineering:

• **Real Project Experience**: Work on active enterprise software products and client solutions.
• **Mentorship**: Daily standups and review sessions with senior staff engineers.
• **Verifiable Achievements**: Get cryptographically verifiable experience certificates upon completion.
• **Performance-Based Hiring**: Top interns receive direct placement opportunities at AgenticX.`,

  ai_solutions: `🤖 **AI Engineering & Custom Solutions**
We architect enterprise-grade AI systems tailored to automate your business workflows:

• **Retrieval-Augmented Generation (RAG)**: Chat with your internal documents, database records, and knowledge sources securely.
• **Autonomous AI Agents**: Deploy workflow agents that qualify leads, handle customer success, and schedule appointments autonomously.
• **Semantic Search**: Power your search bars with semantic meaning and vector embeddings rather than simple keyword matches.`,

  training: `🏢 **Corporate Training Programs**
Empower your technical and business teams to harness the power of modern AI and full-stack software:

• **Executive AI Strategy**: Hands-on workshops detailing LLM use cases, risk management, and tool integration.
• **Engineering Bootcamps**: Accelerated upskilling in React, FastAPI, Docker, and agentic workflows.
• **Custom Curriculum**: Tailored learning tracks designed around your company's tech stack and objectives.`,

  demo: `📅 **Book a Product Consultation**
Interested in seeing our custom platforms or custom AI integrations in action?

We build tailormade portals, dashboards, CRM connections, and automated workflows.

👉 Please navigate to our [Contact Page](/contact) to schedule a dedicated demo session with our product engineering team!`,

  contact: `✉️ **Get in Touch**
We would love to discuss your project requirements or career track questions:

• **Email**: info@agenticx.com / contact@agenticx.com
• **Location**: AgenticX Knowledge Solutions, Corporate Office
• **Website**: Use our online contact form to send us a direct message.

👉 Head over to the [Contact Page](/contact) to drop us an inquiry, and our team will get back to you within 24 hours!`
};

export const getResponse = (input: string): string => {
  const normalized = input.toLowerCase();

  if (normalized.includes('course') || normalized.includes('study') || normalized.includes('learn')) {
    return mockResponses.courses;
  }
  if (normalized.includes('intern') || normalized.includes('placement') || normalized.includes('job')) {
    return mockResponses.internships;
  }
  if (normalized.includes('ai') || normalized.includes('agent') || normalized.includes('rag') || normalized.includes('vector') || normalized.includes('solution')) {
    return mockResponses.ai_solutions;
  }
  if (normalized.includes('train') || normalized.includes('corp') || normalized.includes('work')) {
    return mockResponses.training;
  }
  if (normalized.includes('demo') || normalized.includes('book') || normalized.includes('consult')) {
    return mockResponses.demo;
  }
  if (normalized.includes('contact') || normalized.includes('email') || normalized.includes('reach') || normalized.includes('phone')) {
    return mockResponses.contact;
  }

  return `🤖 **Preview Mode Answer**
I'm currently running in preview mode. My full Retrieval-Augmented Generation (RAG) backend will be connected soon to provide customized answers grounded in our internal documentation.

Try asking about **Courses**, **Internships**, **AI Solutions**, or **Contact details**!`;
};
