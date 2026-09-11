import { useEffect, useRef, useState } from 'react';
import './Partners.css';

type Partner = {
  id: number;
  name: string;
  logo: string;
};

const partnerImages = import.meta.glob(
  '/src/assets/images/Partners/*.{png,jpg,jpeg,webp,svg}',
  {
    eager: true,
    import: 'default',
    query: '?url',
  }
) as Record<string, string>;
const partners: Partner[] = Object.entries(partnerImages).map(
  ([path, logo], index) => {
    const fileName = path.split('/').pop() || '';

    const name = fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();

    return {
      id: index + 1,
      name,
      logo,
    };
  }
);

function PartnerCard({ partner }: { partner: Partner }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="partner-card">
      <div className="partner-logo-wrapper">
        {imgError ? (
          <div className="partner-logo-fallback">
            <span className="material-symbols-outlined partner-fallback-icon">
              handshake
            </span>
          </div>
        ) : (
          <img
            src={partner.logo}
            alt={partner.name}
            className="partner-logo"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <div className="partner-name">
        {partner.name}
      </div>
    </div>
  );
}

export default function Partners() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('partner-fade-in-visible');
            entry.target.classList.remove('partner-fade-in-hidden');

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
      }
    );

    const cards =
      gridRef.current.querySelectorAll('.partner-card');

    cards.forEach((card) => {
      card.classList.add('partner-fade-in-hidden');
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="partners-section">
      <div className="container">

        <div className="partners-header">
          <h1 className="partners-title">
            Our Partners
          </h1>

          <p className="partners-subtitle">
            We proudly partner with institutions and organizations
            that share our commitment to quality education and innovation.
          </p>
        </div>

        <div
          className="partners-grid"
          ref={gridRef}
        >
          {partners.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
            />
          ))}
        </div>

      </div>
    </section>
  );
}