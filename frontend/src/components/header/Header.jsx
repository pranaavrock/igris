import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "./Header.css";

const Header = ({ isAuth }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const navItems = [
    { path: "/", name: "Home" },
    { path: "/courses", name: "Courses" },
    { path: "/about", name: "About" },
    { 
      path: isAuth ? "/account" : "/login", 
      name: isAuth ? "Account" : "Login",
      className: isAuth ? "account-link" : "login-link"
    }
  ];

  return (
    <motion.header 
      className={`sleek-header ${scrolled ? "scrolled" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="header-container">
        <motion.div 
          className="logo-container"
          whileHover={{ scale: 1.05 }}
        >
          <Link to="/" className="logo-link">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">EduSphere</span>
          </Link>
        </motion.div>

        <nav className="navigation">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path} 
                  className={`nav-link ${item.className || ""} ${activeLink === item.path ? "active" : ""}`}
                >
                  {item.name}
                  {activeLink === item.path && (
                    <motion.span 
                      className="active-indicator"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <motion.div 
          className="mobile-menu-btn"
          whileTap={{ scale: 0.95 }}
          onClick={() => {}}
        >
          <div className="menu-line"></div>
          <div className="menu-line"></div>
          <div className="menu-line"></div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;