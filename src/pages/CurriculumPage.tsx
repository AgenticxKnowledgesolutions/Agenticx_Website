import { useEffect } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useToast } from '@/components/ui/Toast';
import NeuralCanvas from '@/components/ui/NeuralCanvas';
import '@/components/ui/PdfViewerModal.css'; // Reuse modal styling classes
import '../styles/courses.css'; // Reuse grid and page structure styling

export default function CurriculumPage() {
  const settings = useSettingsStore((state) => state.settings);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to top when page opens
    window.scrollTo(0, 0);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast('Link copied to clipboard!', 'success');
  };

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const pdfUrl = settings?.curriculumBrochureUrl;

  return (
    <div className="courses-page-wrapper" style={{ minHeight: '90vh', paddingBottom: '60px' }}>
      <NeuralCanvas nodeCount={30} />
      <div className="container courses-page">
        <div className="courses-header" style={{ marginBottom: '30px' }}>
          <h1>Global Curriculum</h1>
          <p>Explore our career training syllabus and program guidelines</p>
        </div>

        <div 
          className="pdf-viewer-container" 
          style={{ 
            width: '100%', 
            height: '75vh', 
            margin: '0 auto', 
            animation: 'none',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#0d1e36',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden'
          }}
        >
          <div className="pdf-viewer-header" style={{ padding: '16px 24px' }}>
            <div className="pdf-viewer-title-group">
              <span className="material-symbols-outlined pdf-title-icon">description</span>
              <h3>Curriculum Brochure</h3>
            </div>
            <div className="pdf-viewer-actions">
              {pdfUrl && (
                <>
                  <button 
                    onClick={handleCopyLink} 
                    className="pdf-action-btn" 
                    title="Copy Share Link"
                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                  >
                    <span className="material-symbols-outlined">share</span>
                    <span className="btn-text">Share Link</span>
                  </button>
                  <a href={pdfUrl} download className="pdf-action-btn" title="Download PDF">
                    <span className="material-symbols-outlined">download</span>
                    <span className="btn-text">Download</span>
                  </a>
                </>
              )}
            </div>
          </div>

          <div className="pdf-viewer-body" style={{ flex: 1, position: 'relative', minHeight: '350px' }}>
            {pdfUrl ? (
              isMobile ? (
                <div className="pdf-mobile-preview-container">
                  <span className="material-symbols-outlined pdf-mobile-icon">picture_as_pdf</span>
                  <p className="pdf-mobile-text">AgenticX Global Curriculum</p>
                  <p className="pdf-mobile-sub">To view the full curriculum on your mobile device, please open it directly or download it using the buttons below.</p>
                  <div className="pdf-mobile-actions">
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="pdf-mobile-btn btn-primary">
                      <span className="material-symbols-outlined">open_in_new</span>
                      Open Curriculum
                    </a>
                    <a href={pdfUrl} download className="pdf-mobile-btn btn-outline">
                      <span className="material-symbols-outlined">download</span>
                      Download PDF
                    </a>
                    <button onClick={handleCopyLink} className="pdf-mobile-btn btn-close-mobile">
                      <span className="material-symbols-outlined">share</span>
                      Copy Share Link
                    </button>
                  </div>
                </div>
              ) : (
                <iframe
                  src={`${pdfUrl}#toolbar=1`}
                  title="Global Curriculum"
                  className="pdf-iframe"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              )
            ) : (
              <div className="pdf-fallback-container">
                <span className="material-symbols-outlined pdf-fallback-icon">info</span>
                <p className="pdf-fallback-text">Curriculum brochure will be available soon.</p>
                <p className="pdf-fallback-sub">We are currently updating our syllabus. Please check back shortly or contact our support team.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
