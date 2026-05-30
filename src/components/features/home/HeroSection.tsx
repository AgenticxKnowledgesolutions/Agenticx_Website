import heroOfficeImg from "@/assets/images/hero/hero-office.jpg";
import phoneIcon from "@/assets/images/hero/phone-call.png";
import NeuralCanvas from "@/components/ui/NeuralCanvas";
import "./HeroSection.css";
import { Link } from "react-router-dom";

export default function HeroSection({ onOpenDemo }: { onOpenDemo?: () => void }) {
  return (
    <section className="hero">
      {/* Background */}
      <div className="hero-bg">
        <img
          src={heroOfficeImg}
          alt="Modern corporate office environment"
          className="hero-bg-image"
          loading="eager"
        />
        <div className="hero-overlay" />
      </div>

      <NeuralCanvas nodeCount={35} />

      {/* Content */}
      <div className="container hero-content">
        <div className="hero-badge">AGENTICX KNOWLEDGE SOLUTIONS</div>

        <h1 className="hero-title">
          Decode Data. Develop Systems. Drive Business.
        </h1>

        <p className="hero-description">
          Transforming fresh graduates into industry-ready professionals through
          effective career coaching and comprehensive graduate training.
        </p>

        <div className="hero-buttons">
          <Link to="/courses" className="btn-primary">
            Explore Courses
          </Link>

          <button
            onClick={onOpenDemo}
            className="btn-glass"
          >
            Book Free Demo
          </button>
        </div>

        {/* 🔥 Mobile CTA (below buttons) */}
        <div className="hero-contact-mobile">
          <div className="hero-phone">
            <img src={phoneIcon} alt="Contact us" />
            <div className="number-info">
              <span>Have any questions?</span>
              <h2 className="number">
                <a href="tel:+919496552094">+91 9496552094</a>
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 Desktop CTA */}
      <div className="hero-contact-desktop">
        <div className="hero-phone">
          <img src={phoneIcon} alt="Contact us" />
          <div className="number-info">
            <span>Have any questions?</span>
            <h2 className="number">
              <a href="tel:+919496552094">+91 9496552094</a>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}