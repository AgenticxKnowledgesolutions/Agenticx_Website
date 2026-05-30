import { useEffect, useRef } from 'react';
import NeuralCanvas from '@/components/ui/NeuralCanvas';
import './whyAgenticX.css';

export default function WhyAgenticX() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      { threshold: 0.1 }
    );

    const cards = gridRef.current?.querySelectorAll('.why-agenticx-card');
    cards?.forEach((card) => {
      card.classList.add('fade-in-hidden');
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="why-agenticx-section">
      <NeuralCanvas />
      
      <div className="why-agenticx-content">
        <div className="container">
          <h2 className="why-agenticx-header">Why AgenticX</h2>
          <div className="why-agenticx-grid" ref={gridRef}>

            {/* For Students */}
            <div className="why-agenticx-card">
              <div className="why-cat-header">
                <span className="material-symbols-outlined why-cat-icon">school</span>
                <h3 className="why-cat-title">For Students</h3>
              </div>
              <div className="why-cat-content">
                <div className="why-sub-group">
                  <h4>Final Year</h4>
                  <ul>
                    <li>Internship opportunities & Certificates</li>
                    <li>Performance-based certification (Platinum/Gold/Silver/Bronze)</li>
                  </ul>
                </div>
                <div className="why-sub-group">
                  <h4>Freshers</h4>
                  <ul>
                    <li>Career Entry Support & Guidance</li>
                    <li>Skill-based certification system</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* For Institutes */}
            <div className="why-agenticx-card">
              <div className="why-cat-header">
                <span className="material-symbols-outlined why-cat-icon">account_balance</span>
                <h3 className="why-cat-title">For Institutes</h3>
              </div>
              <div className="why-cat-content">
                <ul>
                  <li>Placement assistance</li>
                  <li>Industry-aligned training programs</li>
                  <li>Internship collaboration</li>
                </ul>
              </div>
            </div>

            {/* For Corporates */}
            <div className="why-agenticx-card">
              <div className="why-cat-header">
                <span className="material-symbols-outlined why-cat-icon">domain</span>
                <h3 className="why-cat-title">For Corporates</h3>
              </div>
              <div className="why-cat-content">
                <div className="why-sub-group">
                  <h4>HTD Model</h4>
                  <ul>
                    <li>Access to trained, job-ready candidates</li>
                    <li>Skill-based hiring through Hire-Train-Deploy</li>
                  </ul>
                </div>
                <div className="why-sub-group">
                  <h4>Recruitment</h4>
                  <ul>
                    <li>Candidate selection based on certification levels</li>
                    <li>Efficient talent acquisition pipeline</li>
                  </ul>
                </div>
                <div className="why-sub-group">
                  <h4>Seasonal Hiring</h4>
                  <ul>
                    <li>On-demand consultants for seasonal requirements</li>
                    <li>Flexible workforce solutions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Special Categories */}
            <div className="why-agenticx-card why-cat-span">
              <div className="why-cat-header">
                <span className="material-symbols-outlined why-cat-icon">public</span>
                <h3 className="why-cat-title">Special Categories</h3>
              </div>
              <div className="why-cat-content why-cat-cols">
                <div className="why-sub-group">
                  <h4>PwD Support</h4>
                  <ul>
                    <li>Support to enter corporate workforce</li>
                  </ul>
                </div>
                <div className="why-sub-group">
                  <h4>Women Career Restart</h4>
                  <ul>
                    <li>Career re-entry opportunities & upskilling</li>
                  </ul>
                </div>
                <div className="why-sub-group">
                  <h4>Freelancers</h4>
                  <ul>
                    <li>Opportunities for project-based and seasonal work</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
