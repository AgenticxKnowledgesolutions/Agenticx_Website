import { Link } from 'react-router-dom'
import { type CourseData } from '../../../pages/Courses'

interface CourseCardProps {
  course: CourseData;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="course-card">

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
          ${course.price.toFixed(2)}
        </div>

        <div className="course-actions">
          <button className="btn-outline">Syllabus</button>
          <Link to={`/courses/${course.slug}`} className="btn-primary-small">View Details</Link>
        </div>
      </div>

    </div>
  )
}