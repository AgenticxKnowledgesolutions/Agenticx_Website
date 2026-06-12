import { useState, lazy, Suspense } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useToast } from '@/components/ui/Toast';
import './CtaSection.css';

const PdfViewerModal = lazy(() => import('@/components/ui/PdfViewerModal'));

export default function CtaSection({ onOpenDemo }: { onOpenDemo?: () => void }) {
  const settings = useSettingsStore((state) => state.settings);
  const { toast } = useToast();
  const [showCurriculumViewer, setShowCurriculumViewer] = useState(false);

  const handleViewCurriculum = () => {
    if (settings?.curriculumBrochureUrl) {
      setShowCurriculumViewer(true);
    } else {
      toast("Curriculum brochure will be available soon.", "info");
    }
  };

  return (
    <>
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-bg-glow"></div>
            
            <h2 className="cta-title">
              Ready to Drive Your Career Forward?
            </h2>

            <p className="cta-desc">
              Join the next cohort of data-driven systems developers. Limited seats available for the Autumn intake.
            </p>

            <div className="cta-actions">
              <button
                type="button"
                onClick={onOpenDemo}
                aria-label="Book a Free Demo"
                className="btn-cta-primary"
              >
                Book Free Demo
              </button>

              <button
                type="button"
                onClick={handleViewCurriculum}
                aria-label="View course curriculum"
                className="btn-cta-outline"
              >
                View Curriculum
              </button>
            </div>

          </div>
        </div>
      </section>

      {showCurriculumViewer && (
        <Suspense fallback={null}>
          <PdfViewerModal
            isOpen={showCurriculumViewer}
            onClose={() => setShowCurriculumViewer(false)}
            pdfUrl={settings?.curriculumBrochureUrl}
            title="Global Curriculum"
          />
        </Suspense>
      )}
    </>
  );
}