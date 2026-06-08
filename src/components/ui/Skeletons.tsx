import './Skeletons.css';

export function CourseCardSkeleton() {
  return (
    <div className="course-card course-card-skeleton" aria-hidden="true">
      <div className="course-img-wrapper">
        <div className="img-skeleton skeleton-pulse" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="course-card-body">
        <div className="course-card-top">
          <div className="badge-skeleton skeleton-pulse" style={{ width: '70px', height: '22px', borderRadius: '9999px' }} />
          <div className="badge-skeleton skeleton-pulse" style={{ width: '70px', height: '22px', borderRadius: '9999px' }} />
        </div>
        <div className="title-skeleton skeleton-pulse" style={{ width: '85%', height: '24px', marginTop: '10px', marginBottom: '10px' }} />
        <div className="desc-skeleton skeleton-pulse" style={{ width: '100%', height: '48px', marginBottom: '28px' }} />
        <div className="course-card-footer">
          <div className="price-skeleton skeleton-pulse" style={{ width: '60px', height: '24px' }} />
          <div className="course-actions">
            <div className="btn-skeleton skeleton-pulse" style={{ width: '80px', height: '38px', borderRadius: '8px' }} />
            <div className="btn-skeleton skeleton-pulse" style={{ width: '100px', height: '38px', borderRadius: '8px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ActivityCardSkeleton() {
  return (
    <div className="activity-card activity-card-skeleton" aria-hidden="true">
      <div className="activity-image-wrapper">
        <div className="img-skeleton skeleton-pulse" style={{ width: '100%', height: '200px' }} />
      </div>
      <div className="activity-content">
        <div className="title-skeleton skeleton-pulse" style={{ width: '70%', height: '20px', marginBottom: '12px' }} />
        <div className="desc-skeleton skeleton-pulse" style={{ width: '100%', height: '48px', marginBottom: '12px' }} />
        <div className="activity-meta">
          <div className="meta-skeleton skeleton-pulse" style={{ width: '110px', height: '16px' }} />
        </div>
        <div className="activity-footer" style={{ marginTop: '16px' }}>
          <div className="btn-skeleton skeleton-pulse" style={{ width: '120px', height: '38px', borderRadius: '8px' }} />
        </div>
      </div>
    </div>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="review-card review-card-skeleton" aria-hidden="true">
      <div className="review-header">
        <div className="avatar-skeleton skeleton-pulse" style={{ width: '44px', height: '44px', borderRadius: '50%' }} />
        <div className="review-author-info">
          <div className="name-skeleton skeleton-pulse" style={{ width: '120px', height: '16px', marginBottom: '6px' }} />
          <div className="role-skeleton skeleton-pulse" style={{ width: '80px', height: '12px' }} />
        </div>
      </div>
      <div className="review-stars">
        <div className="stars-skeleton skeleton-pulse" style={{ width: '90px', height: '16px' }} />
      </div>
      <div className="text-skeleton skeleton-pulse" style={{ width: '100%', height: '48px', marginTop: '10px' }} />
    </div>
  );
}
