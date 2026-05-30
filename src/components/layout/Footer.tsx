import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "../../assets/images/logo/AgenticX.png";

export default function Footer() {
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
            <Link to="/services" className="footer-link">
              Services
            </Link>
            <Link to="/about" className="footer-link">
              About
            </Link>
            <Link to="/admin/login" className="footer-link">
              Admin Login
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="footer-column">
          <h3 className="footer-title">AgenticX Knowledge Solutions</h3>
          <div className="footer-contact-info">
            <p>3rd Floor, Raj Plaza, Town Limit, Kollam</p>
            <p>+91 9496552094</p>
            <p>+91 9496852094</p>
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
