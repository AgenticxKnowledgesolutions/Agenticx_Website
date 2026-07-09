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

export function CourseDetailSkeleton() {
  return (
    <div className="cd-page" aria-hidden="true" style={{ background: '#f7f9fb' }}>
      <div className="container cd-container">
        {/* Main Content Column Skeleton */}
        <div className="cd-main">
          {/* Header Area */}
          <div className="cd-header-meta" style={{ marginBottom: '16px' }}>
            <div className="badge-skeleton skeleton-pulse" style={{ width: '150px', height: '24px', borderRadius: '6px' }} />
          </div>
          <div className="title-skeleton skeleton-pulse" style={{ width: '80%', height: '48px', marginBottom: '24px', borderRadius: '4px' }} />
          <div className="desc-skeleton skeleton-pulse" style={{ width: '100%', height: '72px', marginBottom: '48px', borderRadius: '4px' }} />

          {/* Stats Grid */}
          <div className="cd-stats-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="cd-stat-card">
                <div className="icon-skeleton skeleton-pulse" style={{ width: '24px', height: '24px', marginBottom: '12px', borderRadius: '4px' }} />
                <div className="label-skeleton skeleton-pulse" style={{ width: '60px', height: '12px', marginBottom: '6px', borderRadius: '2px' }} />
                <div className="value-skeleton skeleton-pulse" style={{ width: '80px', height: '20px', borderRadius: '3px' }} />
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div className="cd-stack-section" style={{ marginBottom: '48px' }}>
            <div className="label-skeleton skeleton-pulse" style={{ width: '120px', height: '14px', marginBottom: '20px', borderRadius: '2px' }} />
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton-pulse" style={{ width: '90px', height: '32px', borderRadius: '999px' }} />
              ))}
            </div>
          </div>

          {/* Curriculum */}
          <div className="cd-curriculum-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div className="skeleton-pulse" style={{ width: '200px', height: '32px', borderRadius: '4px' }} />
              <div className="skeleton-pulse" style={{ width: '100px', height: '20px', borderRadius: '4px' }} />
            </div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(197, 198, 208, 0.3)', paddingBottom: '12px' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton-pulse" style={{ width: '80px', height: '20px', borderRadius: '3px' }} />
              ))}
            </div>
            {/* Module wrapper */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="cd-module-wrapper" style={{ minHeight: '120px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div className="skeleton-pulse" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                      <div className="skeleton-pulse" style={{ width: '180px', height: '24px', borderRadius: '4px' }} />
                    </div>
                    <div className="skeleton-pulse" style={{ width: '24px', height: '24px', borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <aside className="cd-sidebar">
          <div className="cd-form-card">
            <div className="skeleton-pulse" style={{ width: '70%', height: '28px', marginBottom: '12px', borderRadius: '4px' }} />
            <div className="skeleton-pulse" style={{ width: '90%', height: '14px', marginBottom: '24px', borderRadius: '3px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="skeleton-pulse" style={{ width: '60px', height: '12px', marginBottom: '6px', borderRadius: '2px' }} />
                  <div className="skeleton-pulse" style={{ width: '100%', height: '44px', borderRadius: '8px' }} />
                </div>
              ))}
              <div className="skeleton-pulse" style={{ width: '100%', height: '52px', borderRadius: '8px', marginTop: '10px' }} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="container" style={{ padding: '80px 24px', minHeight: '80vh' }} aria-hidden="true">
      <div className="skeleton-pulse" style={{ width: '200px', height: '16px', borderRadius: '4px', marginBottom: '24px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
      <div className="skeleton-pulse" style={{ width: '60%', height: '48px', borderRadius: '8px', marginBottom: '40px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="skeleton-pulse" style={{ width: '100%', height: '120px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        <div className="skeleton-pulse" style={{ width: '100%', height: '120px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        <div className="skeleton-pulse" style={{ width: '100%', height: '120px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
      </div>
    </div>
  );
}

export function AdminSkeleton() {
  return (
    <div style={{ padding: '24px', minHeight: '80vh' }} aria-hidden="true">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div className="skeleton-pulse" style={{ width: '180px', height: '32px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        <div className="skeleton-pulse" style={{ width: '120px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
      </div>
      <div className="skeleton-pulse" style={{ width: '100%', height: '160px', borderRadius: '16px', marginBottom: '32px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div className="skeleton-pulse" style={{ height: '260px', borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        <div className="skeleton-pulse" style={{ height: '260px', borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="skeleton-pulse" style={{ width: '100%', height: '150px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }} aria-hidden="true" />
  );
}

export function CollaboratorCardSkeleton() {
  return (
    <div className="collaborator-card collaborator-card-skeleton" aria-hidden="true">
      <div className="collaborator-logo-wrapper">
        <div className="skeleton-pulse" style={{ width: '64px', height: '64px', borderRadius: '50%' }} />
      </div>
      <div className="skeleton-pulse" style={{ width: '70%', height: '14px', marginTop: '16px', marginInline: 'auto' }} />
    </div>
  );
}



