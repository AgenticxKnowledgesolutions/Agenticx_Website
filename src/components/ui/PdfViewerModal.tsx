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
                <a href={pdfUrl} download className="pdf-action-btn" title="Download PDF">
                  <span className="material-symbols-outlined">download</span>
                  <span className="btn-text">Download</span>
                </a>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="pdf-action-btn" title="Open in New Tab">
                  <span className="material-symbols-outlined">open_in_new</span>
                  <span className="btn-text">Open</span>
                </a>
              </>
            )}
            <button onClick={onClose} className="pdf-close-btn" title="Close Viewer">
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
