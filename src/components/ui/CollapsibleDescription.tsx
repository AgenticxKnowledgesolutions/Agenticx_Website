import { useState, useRef, useEffect } from 'react';

interface CollapsibleDescriptionProps {
  description: string;
  clampMobile?: number;
  clampDesktop?: number;
}

export default function CollapsibleDescription({
  description,
  clampMobile = 3,
  clampDesktop = 4
}: CollapsibleDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (isExpanded) return;

    const checkTruncation = () => {
      if (descRef.current) {
        const { scrollHeight, clientHeight } = descRef.current;
        setIsTruncated(scrollHeight > clientHeight);
      }
    };

    // Small delay to ensure styles and font loads have completed
    const timer = setTimeout(checkTruncation, 60);
    window.addEventListener('resize', checkTruncation);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkTruncation);
    };
  }, [description, isExpanded]);

  return (
    <div className="collapsible-description-container" style={{ position: 'relative' }}>
      <p
        ref={descRef}
        className={`course-card-desc ${!isExpanded ? 'course-card-desc-clamp' : 'course-card-desc-expanded'}`}
        style={{
          display: !isExpanded ? '-webkit-box' : 'block',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: !isExpanded ? clampDesktop : 'none',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          maxHeight: isExpanded ? '1000px' : '96px',
          marginBottom: isTruncated ? '8px' : '24px',
          color: 'rgba(255, 255, 255, 0.7)'
        }}
      >
        {description}
      </p>

      {/* Injecting media queries specific to this clamped component */}
      <style>{`
        @media (max-width: 767px) {
          .course-card-desc-clamp {
            -webkit-line-clamp: ${clampMobile} !important;
            max-height: 72px !important;
          }
        }
        .read-more-toggle-btn {
          background: none;
          border: none;
          color: #60a5fa;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          margin-bottom: 20px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s;
        }
        .read-more-toggle-btn:hover {
          color: #93c5fd;
          text-decoration: underline;
        }
      `}</style>

      {isTruncated && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="read-more-toggle-btn"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
          <span 
            className="material-symbols-outlined" 
            style={{ 
              fontSize: '14px', 
              transition: 'transform 0.2s', 
              transform: isExpanded ? 'rotate(180deg)' : 'none' 
            }}
          >
            keyboard_arrow_down
          </span>
        </button>
      )}
    </div>
  );
}
