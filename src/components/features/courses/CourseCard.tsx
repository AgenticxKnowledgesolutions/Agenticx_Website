import { Link } from 'react-router-dom'
import { type CourseData } from '../../../pages/Courses'
import { formatCurrency } from '@/lib/utils'

interface CourseCardProps {
  course: CourseData;
}

export default function CourseCard({ course }: CourseCardProps) {
  // Use uploaded thumbnail or fallback premium default placeholder image
  const defaultPlaceholder = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop";
  const thumbnailSrc = course.coverImageUrl || defaultPlaceholder;

  return (
    <div className="course-card">
      <div className="course-img-wrapper">
        <img 
          className="course-img" 
          src={thumbnailSrc} 
          alt={course.title} 
          onError={(e) => {
            e.currentTarget.src = defaultPlaceholder;
          }}
          loading="lazy"
        />
      </div>

      <div className="course-card-body">
        {/* 🔥 Top Row (Badges) */}
        <div className="course-card-top">
          <span className="course-card-badge">
            {course.duration || '12 Weeks'}
          </span>
          <span className="course-card-badge mode-badge">
            {course.mode || 'Remote'}
          </span>
        </div>

        {/* Content */}
        <h2 className="course-card-title">{course.title}</h2>

        <p className="course-card-desc">
          {course.description}
        </p>

        {/* Footer */}
        <div className="course-card-footer">
          <div className="course-price">
            {formatCurrency(course.price)}
          </div>

          <div className="course-actions">
            <button className="btn-outline">Syllabus</button>
            <Link to={`/courses/${course.slug}`} className="btn-primary-small">View Details</Link>
          </div>
        </div>
      </div>
    </div>
  )
}