export interface TechStack {
  name: string
  iconUrl: string
}

export interface ModuleData {
  id: string
  title: string
  description: string
}

export interface CurriculumMonth {
  tabTitle: string
  sectionTitle: string
  modules: ModuleData[]
}

export interface Course {
  id: string
  slug: string
  badge: string
  title: string
  description: string
  stats: {
    duration: string
    format: string
    projects: string
    careerSupport: string
  }
  stack: TechStack[]
  curriculum: CurriculumMonth[]
  nextCohort: string
  isAiOptimized: boolean
  price: number
}

const defaultCourses: Course[] = [
  {
    id: '1',
    slug: 'advanced-ai',
    badge: 'Advanced Specialization',
    title: 'Full Stack AI & Machine Learning Mastery',
    description: 'A comprehensive elite-tier program designed for senior engineers. Architect, deploy, and scale complex agentic workflows using industry-leading frameworks and cloud-native infrastructure.',
    stats: {
      duration: '6 Months',
      format: 'Hybrid Online',
      projects: '8 Capstones',
      careerSupport: 'Included'
    },
    stack: [
      { name: 'Python', iconUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWuQ-cZSmbNJL8r9pRzICn8kfp8IyPPu-KtJsI3TO3FTdbpvVzPO-d8aJtp50s9R_kWdQZ0HyI3zRqbVq6nGYNrkg9mz6oE2AgT1NZIDb5krFz0UYjMrGCJTZf3GT54SZXQwSSzM_KIT1rQvLQK-QNqVIAhSKVtlmyfh7grz5sIJksVis30fW2MTunJNl3TFiR_qnwLeL-1qCwtRN7c8uGm22UGyhiKFjATdtitywZobZSEqlMHGPllj4Qh4Ll1ofiZZyqiEBVGwQ' },
      { name: 'PyTorch', iconUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOMwRkrPx4VU6HtCibx9TUKrcZHx1QMWFKcXftCritvVChHA8ljXZLZcx_NQL9PPAzyjcoYTsq80wBs3scScnqi305SP9fExf4F1Yp91a-M4m5B5Z8MRAIDxPlscAKNzIdwW3yL5hHpP4dZoxMTXFYI0gX2plPdGXb1gc8WAogOGv373gA0_6cKcuAKxWa5JXaq09XEP97lHF2w-SQY_mfQbwEv2wijGVWUiLQNofG-pitAGhCt6KcGZRWpgBJe6ge6c7-HPlEEf4' }
    ],
    curriculum: [
      {
        tabTitle: 'Month 1: Foundations',
        sectionTitle: 'Data Engineering & Python Mastery',
        modules: [
          { id: '1', title: 'Advanced Python', description: 'Metaprogramming, concurrency, and high-performance patterns.' },
          { id: '2', title: 'Modern SQL', description: 'Vector databases, complex joins, and window functions.' }
        ]
      }
    ],
    nextCohort: 'Nov 15, 2026',
    isAiOptimized: true,
    price: 199.99
  },
  {
    id: '2',
    slug: 'full-stack-react',
    badge: 'Core Program',
    title: 'Modern Full-Stack Engineering with Next.js',
    description: 'Master the entire modern web stack. Build scalable, SEO-friendly, and highly performant applications using React, Next.js 14, and scalable backend architectures.',
    stats: {
      duration: '4 Weeks',
      format: 'Remote Online',
      projects: '5 Real-world Apps',
      careerSupport: 'Included'
    },
    stack: [
      { name: 'TypeScript', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg' },
      { name: 'React', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' }
    ],
    curriculum: [
      {
        tabTitle: 'Week 1: React Mastery',
        sectionTitle: 'Advanced React Patterns',
        modules: [
          { id: '1', title: 'React Hooks Deep Dive', description: 'Custom hooks, performance optimization, and context.' }
        ]
      }
    ],
    nextCohort: 'Dec 01, 2026',
    isAiOptimized: false,
    price: 149.99
  }
];

export const getCourses = async (): Promise<Course[]> => {
  const stored = localStorage.getItem('courses');
  if (stored) {
    try {
      return JSON.parse(stored) as Course[];
    } catch (e) {
      console.error('Failed to parse courses from localStorage', e);
    }
  }
  localStorage.setItem('courses', JSON.stringify(defaultCourses));
  return defaultCourses;
};

export const getCourseBySlug = async (slug: string): Promise<Course | null> => {
  const courses = await getCourses();
  return courses.find(c => c.slug === slug) || null;
};

export const saveCourses = async (courses: Course[]): Promise<void> => {
  localStorage.setItem('courses', JSON.stringify(courses));
};
