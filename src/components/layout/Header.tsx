import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./Header.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header-inner">

        {/* Logo */}
        <NavLink to="/" className="header-logo">
          AgenticX Knowledge Solutions
        </NavLink>

        {/* Desktop Nav */}
        <nav className="header-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Home
          </NavLink>

          <NavLink to="/courses" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Courses
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
        </div>

        {/* 🔥 Mobile Hamburger */}
        <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <span className={isOpen ? "line open" : "line"}></span>
          <span className={isOpen ? "line open" : "line"}></span>
          <span className={isOpen ? "line open" : "line"}></span>
        </div>
      </div>

      {/* 🔥 Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? "show" : ""}`}>
        <NavLink to="/" onClick={() => setIsOpen(false)}>Home</NavLink>
        <NavLink to="/courses" onClick={() => setIsOpen(false)}>Courses</NavLink>
        <NavLink to="/services" onClick={() => setIsOpen(false)}>Services</NavLink>
        <NavLink to="/about" onClick={() => setIsOpen(false)}>About</NavLink>

        <div className="mobile-actions">
          <NavLink to="/contact" className="mobile-demo" onClick={() => setIsOpen(false)}>
            Contact Us
          </NavLink>
        </div>
      </div>
    </header>
  );
}