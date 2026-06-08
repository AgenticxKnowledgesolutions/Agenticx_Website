import { Link } from 'react-router-dom'
import { useState } from 'react'
import { type CourseData } from '../../../pages/Courses'
import { formatCurrency } from '@/lib/utils'
import CollapsibleDescription from '../../ui/CollapsibleDescription'
import PdfViewerModal from '../../ui/PdfViewerModal'

interface CourseCardProps {
  course: CourseData;
}

export default function CourseCard({ course }: CourseCardProps) {
  const [showPdf, setShowPdf] = useState(false);
  // Use uploaded thumbnail or fallback premium default placeholder image
  const defaultPlaceholder = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop";
  const thumbnailSrc = course.coverImageUrl || defaultPlaceholder;

  return (
    <>
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

          <CollapsibleDescription description={course.description} />

          {/* Footer */}
          <div className="course-card-footer">
            <div className="course-price">
              {formatCurrency(course.price)}
            </div>

            <div className="course-actions">
              <button 
                type="button" 
                className="btn-outline"
                onClick={() => setShowPdf(true)}
              >
                Syllabus
              </button>
              <Link to={`/courses/${course.slug}`} className="btn-primary-small">View Details</Link>
            </div>
          </div>
        </div>
      </div>

      <PdfViewerModal
        isOpen={showPdf}
        onClose={() => setShowPdf(false)}
        pdfUrl={course.brochureUrl}
        title={course.title}
      />
    </>
  )
}