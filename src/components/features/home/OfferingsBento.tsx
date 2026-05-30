// import { , useRef, useState } from 'react';
import './OfferingsBento.css';
import NeuralCanvas from "@/components/ui/NeuralCanvas";
export default function OfferingsBento() {

  return (
    <section className="bento-section">
      <NeuralCanvas nodeCount={25} />

      <div className="container">

        <div className="bento-header">
          <div>
            <span className="bento-label">ECOSYSTEM</span>
            <h2 className="bento-title">Our Strategic Offerings</h2>
          </div>
        </div>

        <div
          className="bento-row">

          <div className="bento-card">
            <span className="material-symbols-outlined bento-icon">school</span>
            <h3>Career-Focused Programs</h3>
            <p>
              Comprehensive courses in Data Analytics, Full Stack Development, and AI/ML designed for real careers.
            </p>
          </div>

          <div className="bento-card">
            <span className="material-symbols-outlined bento-icon">work</span>
            <h3>Internship Opportunities</h3>
            <p>
              Gain real industry experience through guided internships and live project exposure.
            </p>
          </div>

          <div className="bento-card">
            <span className="material-symbols-outlined bento-icon">code</span>
            <h3>Software & AI Solutions</h3>
            <p>
              We build scalable software and intelligent AI solutions while training future developers.
            </p>
          </div>

          <div className="bento-card">
            <span className="material-symbols-outlined bento-icon">rocket_launch</span>
            <h3>Learn • Build • Launch</h3>
            <p>
              Hands-on training, real-world internships, and AI-powered solutions to kickstart your tech career.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}