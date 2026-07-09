import { useEffect, useState, useRef } from 'react';
import { getCollaborators } from '@/services/collaboratorService';
import type { Collaborator } from '@/types/collaborator';
import { CollaboratorCardSkeleton } from '@/components/ui/Skeletons';
import './CollaboratorsSection.css';

function CollaboratorCard({ collaborator }: { collaborator: Collaborator }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="collaborator-card">
      <div className="collaborator-logo-wrapper">
        {imgError || !collaborator.logo ? (
          <div className="collaborator-logo-fallback">
            <span className="material-symbols-outlined fallback-icon">domain</span>
          </div>
        ) : (
          <img
            src={collaborator.logo}
            alt={collaborator.name}
            className="collaborator-logo"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="collaborator-name" title={collaborator.name}>
        {collaborator.name}
      </div>
    </div>
  );
}

export default function CollaboratorsSection() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const data = await getCollaborators();
        setCollaborators(data);
      } catch (err) {
        console.error('Error fetching collaborators:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollaborators();
  }, []);

  useEffect(() => {
    if (loading || collaborators.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            entry.target.classList.remove('fade-in-hidden');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    const cards = gridRef.current?.querySelectorAll('.collaborator-card, .collaborator-card-skeleton');
    cards?.forEach((card) => {
      card.classList.add('fade-in-hidden');
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [loading, collaborators]);

  // If not loading and no active collaborators exist, hide the section completely
  if (!loading && collaborators.length === 0) {
    return null;
  }

  return (
    <section className="collaborators-section">
      <div className="container">
        <div className="collaborators-header">
          <h2 className="collaborators-title">Collaborators</h2>
          <p className="collaborators-subtitle">
            We proudly collaborate with institutions and organizations that share our commitment to quality education and innovation.
          </p>
        </div>

        <div className="collaborators-grid" ref={gridRef}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <CollaboratorCardSkeleton key={i} />
              ))
            : collaborators.map((collaborator) => (
                <CollaboratorCard
                  key={collaborator.id}
                  collaborator={collaborator}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
