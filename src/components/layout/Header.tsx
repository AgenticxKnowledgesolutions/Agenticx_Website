import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Header.css";
import logoImg from "@/assets/images/logo/AgenticX-removebg-preview.png";

const PORTALS = [
  {
    label: "Candidate Portal",
    desc: "Track applications & pay fees",
    href: "https://candidate.agenticx.co.in",
    icon: "🎓",
    color: "#0052fe",
  },
  {
    label: "Certificate Portal",
    desc: "Verify & download certificates",
    href: "https://certificate.agenticx.co.in",
    icon: "📜",
    color: "#10b981",
  },
  {
    label: "Admin Portal",
    desc: "Manage leads, candidates & more",
    href: "/admin",
    icon: "⚙️",
    color: "#8b5cf6",
    internal: true,
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [portalsOpen, setPortalsOpen] = useState(false);
  const [mobilePortalsOpen, setMobilePortalsOpen] = useState(false);
  const portalsRef = useRef<HTMLDivElement>(null);

  // Close portals dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (portalsRef.current && !portalsRef.current.contains(e.target as Node)) {
        setPortalsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  const closeMobile = () => {
    setMobileOpen(false);
    setMobilePortalsOpen(false);
  };

  return (
    <header className="header">
      <div className="container header-inner">

        {/* Logo */}
        <NavLink to="/" className="header-logo">
          <img src={logoImg} alt="AgenticX Logo" className="header-logo-img" />
          <span className="header-logo-text">
            <span className="brand-name-main">AgenticX</span>
            <span className="brand-name-sub"> Knowledge Solutions</span>
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="header-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Home
          </NavLink>

          <NavLink to="/courses" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Courses
          </NavLink>

          <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Products
          </NavLink>

          <NavLink to="/services" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Services
          </NavLink>

          <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            About
          </NavLink>
        </nav>

        {/* Desktop Actions */}
        <div className="header-actions">
          <NavLink to="/contact" className="demo-btn">Contact Us</NavLink>

          {/* Portals Dropdown */}
          <div className="portals-dropdown" ref={portalsRef}>
            <button
              className={`portals-trigger ${portalsOpen ? "open" : ""}`}
              onClick={() => setPortalsOpen(!portalsOpen)}
              aria-label="Open portals menu"
            >
              <span className="portals-trigger-icon">
                <span className="portals-bar"></span>
                <span className="portals-bar"></span>
                <span className="portals-bar"></span>
              </span>
              <span className="portals-trigger-label">Portals</span>
            </button>

            <div className={`portals-menu ${portalsOpen ? "show" : ""}`}>
              <p className="portals-menu-heading">Quick Access</p>
              {PORTALS.map((portal) => (
                portal.internal ? (
                  <NavLink
                    key={portal.label}
                    to={portal.href}
                    className="portals-item"
                    onClick={() => setPortalsOpen(false)}
                  >
                    <span className="portals-item-icon" style={{ background: `${portal.color}18` }}>{portal.icon}</span>
                    <span>
                      <span className="portals-item-label">{portal.label}</span>
                      <span className="portals-item-desc">{portal.desc}</span>
                    </span>
                    <span className="portals-item-arrow">›</span>
                  </NavLink>
                ) : (
                  <a
                    key={portal.label}
                    href={portal.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portals-item"
                    onClick={() => setPortalsOpen(false)}
                  >
                    <span className="portals-item-icon" style={{ background: `${portal.color}18` }}>{portal.icon}</span>
                    <span>
                      <span className="portals-item-label">{portal.label}</span>
                      <span className="portals-item-desc">{portal.desc}</span>
                    </span>
                    <span className="portals-item-arrow">↗</span>
                  </a>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`hamburger ${mobileOpen ? "open" : ""}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </button>
      </div>

      {/* Mobile Menu Overlay backdrop */}
      {mobileOpen && <div className="mobile-backdrop" onClick={closeMobile} />}

      {/* Mobile Drawer */}
      <div className={`mobile-menu ${mobileOpen ? "show" : ""}`} role="dialog" aria-modal="true">
        {/* Mobile nav links */}
        <nav className="mobile-nav-links">
          <NavLink to="/" onClick={closeMobile}>Home</NavLink>
          <NavLink to="/courses" onClick={closeMobile}>Courses</NavLink>
          <NavLink to="/products" onClick={closeMobile}>Products</NavLink>
          <NavLink to="/services" onClick={closeMobile}>Services</NavLink>
          <NavLink to="/about" onClick={closeMobile}>About</NavLink>
        </nav>

        <div className="mobile-divider" />

        {/* Mobile Portals Section */}
        <div className="mobile-portals-section">
          <button
            className="mobile-portals-toggle"
            onClick={() => setMobilePortalsOpen(!mobilePortalsOpen)}
            aria-expanded={mobilePortalsOpen}
          >
            <span>🌐 Portals</span>
            <span className={`mobile-chevron ${mobilePortalsOpen ? "up" : ""}`}>›</span>
          </button>

          <div className={`mobile-portals-list ${mobilePortalsOpen ? "open" : ""}`}>
            {PORTALS.map((portal) => (
              portal.internal ? (
                <NavLink
                  key={portal.label}
                  to={portal.href}
                  className="mobile-portal-item"
                  onClick={closeMobile}
                >
                  <span>{portal.icon}</span>
                  <span className="mobile-portal-text">
                    <span>{portal.label}</span>
                    <span className="mobile-portal-desc">{portal.desc}</span>
                  </span>
                </NavLink>
              ) : (
                <a
                  key={portal.label}
                  href={portal.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-portal-item"
                  onClick={closeMobile}
                >
                  <span>{portal.icon}</span>
                  <span className="mobile-portal-text">
                    <span>{portal.label}</span>
                    <span className="mobile-portal-desc">{portal.desc}</span>
                  </span>
                </a>
              )
            ))}
          </div>
        </div>

        <div className="mobile-divider" />

        {/* Mobile CTA */}
        <div className="mobile-actions">
          <NavLink to="/contact" className="mobile-demo" onClick={closeMobile}>
            Contact Us
          </NavLink>
        </div>
      </div>
    </header>
  );
}