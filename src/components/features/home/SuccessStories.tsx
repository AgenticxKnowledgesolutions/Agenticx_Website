import { useEffect, useState } from 'react';
import { getReviews } from '@/services/reviewsService';
import type { Review } from '@/types/review';
import { ReviewCardSkeleton } from '@/components/ui/Skeletons';
import './SuccessStories.css'

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    const first = parts[0].charAt(0).toUpperCase();
    const last = parts[parts.length - 1].charAt(0).toUpperCase();
    return `${first}${last}`;
  }
  return parts[0] ? parts[0].charAt(0).toUpperCase() : "";
};

export default function SuccessStories() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await getReviews();
      setReviews(data);
    };
    fetchReviews();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Duplicate array for seamless infinite CSS scroll
  const carouselItems = [...reviews, ...reviews];

  // Dynamically calculate animation duration so speed remains constant & extremely slow regardless of the number of reviews
  const scrollDuration = `${Math.max(120, reviews.length * 45)}s`;

  if (reviews.length === 0) {
    return (
      <section className="success-section">
        <div className="container">
          <div className="success-header">
            <h2 className="success-title">What Our Students Say</h2>
            <p className="success-subtitle">Real feedback from our learners and professionals</p>
          </div>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '40px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="success-section">
      <div className="container">
        <div className="success-header">
          <h2 className="success-title">What Our Students Say</h2>
          <p className="success-subtitle">Real feedback from our learners and professionals</p>
        </div>
      </div>

      <div className="carousel-container">
        <div className="carousel-track" style={{ animationDuration: scrollDuration }}>
          {carouselItems.map((item, index) => {
            if (!item) return null;
            const reviewId = item.id || `review-${index}`;
            const isExpanded = !!expandedReviews[reviewId];
            const reviewText = item.review || "";
            const isLongReview = reviewText.length > 120;
            const authorName = item.name || "Verified Learner";
            const rating = typeof item.rating === 'number' && item.rating >= 0 && item.rating <= 5 ? Math.floor(item.rating) : 5;

            return (
              <div className="review-card" key={`${reviewId}-${index}`}>
                <div className="review-header">
                  <div className="review-avatar-fallback">
                    {getInitials(authorName)}
                  </div>
                  <div className="review-author-info">
                    <div className="review-name">{authorName}</div>
                    {item.role && <div className="review-role">{item.role}</div>}
                  </div>
                  {/* Google Icon SVG (Conditionally rendered) */}
                  {item.source === 'google' && (
                    <div className="google-icon-wrapper" title="Google Review">
                      <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                  )}
                </div>

                <div className="review-stars">
                  {[...Array(rating)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined star-icon">star</span>
                  ))}
                </div>

                <p className={`review-text ${isExpanded ? 'expanded' : ''}`}>
                  "{reviewText}"
                </p>

                {isLongReview && (
                  <button
                    className="read-more-btn"
                    onClick={() => toggleExpand(reviewId)}
                    aria-label={isExpanded ? "Show less review" : "Read full review"}
                  >
                    {isExpanded ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}

