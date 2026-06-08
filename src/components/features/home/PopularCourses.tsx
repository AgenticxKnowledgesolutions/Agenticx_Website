import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '@/services/courseService'
import { CourseCardSkeleton } from '@/components/ui/Skeletons'
import NeuralCanvas from '@/components/ui/NeuralCanvas'
import analyticsImg from '@/assets/images/courses/analytics.jpg'
import systemsImg from '@/assets/images/courses/systems.jpg'
import aiMlImg from '@/assets/images/courses/ai-ml.jpg'
import './PopularCourses.css'

// Default static fallback specializations
const DEFAULT_COURSES = [
  {
    id: 'analytics',
    slug: 'data-analytics',
    badge: 'Data Analytics',
    title: 'Data Analytics',
    description: 'Master statistical modeling, data visualization, and predictive analytics using enterprise-grade toolchains.',
    coverImageUrl: analyticsImg,
    duration: '8 Weeks',
    icon: 'trending_up'
  },
  {
    id: 'ai-ml',
    slug: 'ai-machine-learning',
    badge: 'AI and ML',
    title: 'AI & Machine Learning',
    description: 'Build, train, and deploy neural networks. Focus on NLP, computer vision, and scalable ML architecture.',
    coverImageUrl: aiMlImg,
    duration: '8 Weeks',
    icon: 'cloud'
  },
  {
    id: 'full-stack',
    slug: 'python-full-stack',
    badge: 'Full-stack',
    title: 'Python Full-Stack',
    description: 'Full-cycle modern web development. Architect scalable backends and highly responsive React interfaces.',
    coverImageUrl: systemsImg,
    duration: '12 Weeks',
    icon: 'smart_toy'
  }
];

export default function PopularCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        if (data && data.length > 0) {
          const formatted = data.slice(0, 3).map((c) => ({
            id: c.id,
            slug: c.slug,
            badge: c.badge || 'Course',
            title: c.title,
            description: c.description,
            coverImageUrl: c.coverImageUrl || null,
            duration: c.stats?.duration || '12 Weeks',
            icon: c.isAiOptimized ? 'smart_toy' : 'school'
          }));
          setCourses(formatted);
        } else {
          setCourses(DEFAULT_COURSES);
        }
      } catch (err) {
        console.error('Failed to load popular courses:', err);
        setCourses(DEFAULT_COURSES);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const defaultPlaceholder = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop";

  return (
    <section className="courses-section">
      <NeuralCanvas nodeCount={25} />

      <div className="courses-content-wrapper">
        <div className="container">
          <div className="courses-header">
            <h2 className="courses-title">Our Specializations</h2>
            <Link to="/courses" className="courses-view-all">View All Courses</Link>
          </div>
          <div className="courses-grid">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))
            ) : (
              courses.map((course) => {
                const imgSrc = course.coverImageUrl || defaultPlaceholder;
                return (
                  <div className="course-card" key={course.id}>
                    <div className="course-img-wrapper">
                      <img 
                        className="course-img" 
                        alt={course.title} 
                        src={imgSrc} 
                        onError={(e) => {
                          e.currentTarget.src = defaultPlaceholder;
                        }}
                        loading="lazy"
                      />
                      <div className="course-badge">{course.badge}</div>
                    </div>
                    <div className="course-content">
                      <h4 className="course-card-title">{course.title}</h4>
                      <p className="course-card-desc">{course.description}</p>
                      <div className="course-footer">
                        <span className="course-duration">{course.duration}</span>
                        <span className="material-symbols-outlined course-icon">{course.icon}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
