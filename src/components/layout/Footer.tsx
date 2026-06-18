import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "../../assets/images/logo/AgenticX.png";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function Footer() {
  const settings = useSettingsStore(state => state.settings);

  // Format address dynamically
  const addressText = settings
    ? [settings.addressLine1, settings.addressLine2, settings.city].filter(Boolean).join(", ")
    : "3rd Floor, Raj Plaza, Town Limit, Kollam";

  return (
    <footer className="footer-section">
      <div className="container footer-container">
        {/* Left Section */}
        <div className="footer-column footer-brand-column">
          <Link to="/" className="footer-logo">
            <img src={logo} alt="AgenticX Logo" className="footer-logo-img" />
          </Link>
        </div>

        {/* Center Section */}
        <div className="footer-column">
          <h3 className="footer-title">Useful Links</h3>
          <div className="footer-links-vertical">
            <Link to="/" className="footer-link">
              Home
            </Link>
            <Link to="/courses" className="footer-link">
              Courses
            </Link>
            <Link to="/products" className="footer-link">
              Products
            </Link>
            <Link to="/services" className="footer-link">
              Services
            </Link>
            <Link to="/about" className="footer-link">
              About
            </Link>
            <Link to="/careers" className="footer-link">
              Careers
            </Link>
            <Link to="/admin/login" className="footer-link">
              Admin Login
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="footer-column">
          <h3 className="footer-title">{settings?.companyName || "AgenticX Knowledge Solutions"}</h3>
          <div className="footer-contact-info">
            <p>{addressText}</p>
            {settings?.primaryPhone && <p>{settings.primaryPhone}</p>}
            {settings?.secondaryPhone && <p>{settings.secondaryPhone}</p>}
            {!settings && (
              <>
                <p>+91 9496552094</p>
                <p>+91 9496852094</p>
              </>
            )}
          </div>
          <div className="footer-social-links">
            {settings?.linkedinUrl && (
              <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="LinkedIn">
                <svg className="social-svg-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            )}
            {settings?.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="Instagram">
                <svg className="social-svg-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}
            {settings?.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="Facebook">
                <svg className="social-svg-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
            )}
            {settings?.youtubeUrl && (
              <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="YouTube">
                <svg className="social-svg-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.163c-.272-1.016-1.071-1.815-2.087-2.087-1.841-.497-9.212-.497-9.212-.497s-7.37.01-9.213.498c-1.016.272-1.815 1.071-2.087 2.087-.497 1.841-.497 5.714-.497 5.714s0 3.873.497 5.714c.272 1.016 1.071 1.815 2.087 2.087 1.843.497 9.213.497 9.213.497s7.371 0 9.212-.497c1.016-.272 1.815-1.071 2.087-2.087.497-1.841.497-5.714.497-5.714s0-3.873-.497-5.714zm-14.195 8.948V8.89l6.195 3.111-6.195 3.11z"/>
                </svg>
              </a>
            )}
            <a href="https://x.com/agenticx" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="X">
              <svg className="social-svg-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <div className="footer-copyright">
            © {new Date().getFullYear()} AgenticX. All rights reserved.
          </div>
          <div className="footer-designer">
            Designed by{" "}
            <a href="https://github.com/fazilyousuf" target="_blank" rel="noopener noreferrer">
              Muhammad Fazil V K
            </a>
          </div>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="separator">|</span>
            <Link to="/terms">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
