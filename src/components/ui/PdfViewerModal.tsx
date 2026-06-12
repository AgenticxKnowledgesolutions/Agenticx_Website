import { useEffect } from 'react';
import './PdfViewerModal.css';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
  title: string;
}

export default function PdfViewerModal({ isOpen, onClose, pdfUrl, title }: PdfViewerModalProps) {
  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('pdf-modal-lock');
    } else {
      document.body.classList.remove('pdf-modal-lock');
    }
    return () => {
      document.body.classList.remove('pdf-modal-lock');
    };
  }, [isOpen]);

  // Intercept back navigation to close modal instead of navigating away
  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ pdfModalOpen: true }, '');

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (window.history.state?.pdfModalOpen) {
        window.history.back();
      }
    };
  }, [isOpen, onClose]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Focus trap and restore focus
  useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement as HTMLElement;

    // Focus the close button or first interactive element inside the modal initially
    const modalElement = document.querySelector('.pdf-viewer-container') as HTMLElement;
    if (modalElement) {
      const focusableElements = modalElement.querySelectorAll(
        'a[href], button, textarea, input, select, iframe, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const currentModalElement = document.querySelector('.pdf-viewer-container');
      if (!currentModalElement) return;

      const focusableElements = Array.from(
        currentModalElement.querySelectorAll(
          'a[href], button, textarea, input, select, iframe, [tabindex]:not([tabindex="-1"])'
        )
      ) as HTMLElement[];

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleTabKey);

    return () => {
      window.removeEventListener('keydown', handleTabKey);
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <div className="pdf-viewer-overlay" onClick={onClose}>
      <div className="pdf-viewer-container" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-viewer-header">
          <div className="pdf-viewer-title-group">
            <span className="material-symbols-outlined pdf-title-icon">description</span>
            <h3>{title} - Syllabus</h3>
          </div>
          <div className="pdf-viewer-actions">
            {pdfUrl && (
              <>
                <a href={pdfUrl} download className="pdf-action-btn" title="Download PDF" aria-label="Download PDF">
                  <span className="material-symbols-outlined">download</span>
                  <span className="btn-text">Download</span>
                </a>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="pdf-action-btn" title="Open in New Tab" aria-label="Open PDF in new tab">
                  <span className="material-symbols-outlined">open_in_new</span>
                  <span className="btn-text">Open</span>
                </a>
              </>
            )}
            <button onClick={onClose} className="pdf-close-btn" title="Close Viewer" aria-label="Close Viewer">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="pdf-viewer-body">
          {pdfUrl ? (
            isMobile ? (
              <div className="pdf-mobile-preview-container">
                <span className="material-symbols-outlined pdf-mobile-icon">picture_as_pdf</span>
                <p className="pdf-mobile-text">{title} Syllabus</p>
                <p className="pdf-mobile-sub">To view the syllabus on your mobile device, please open it in a new tab or download it directly.</p>
                <div className="pdf-mobile-actions">
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="pdf-mobile-btn btn-primary">
                    <span className="material-symbols-outlined">open_in_new</span>
                    Open Syllabus
                  </a>
                  <a href={pdfUrl} download className="pdf-mobile-btn btn-outline">
                    <span className="material-symbols-outlined">download</span>
                    Download PDF
                  </a>
                  <button onClick={onClose} className="pdf-mobile-btn btn-close-mobile">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back to Courses
                  </button>
                </div>
              </div>
            ) : (
              <iframe
                src={`${pdfUrl}#toolbar=1`}
                title={`${title} Syllabus`}
                className="pdf-iframe"
              />
            )
          ) : (
            <div className="pdf-fallback-container">
              <span className="material-symbols-outlined pdf-fallback-icon">info</span>
              <p className="pdf-fallback-text">Syllabus will be available soon.</p>
              <p className="pdf-fallback-sub">We are currently finalizing the curriculum for this program.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
