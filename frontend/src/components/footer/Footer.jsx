import React from "react";
import { motion } from "framer-motion";
import {
  AiFillFacebook,
  AiFillTwitterSquare,
  AiFillInstagram,
  AiFillLinkedin
} from "react-icons/ai";
import "./Footer.css";

const Footer = () => {
  const socialLinks = [
    {
      icon: <AiFillFacebook />,
      url: "#",
      label: "Facebook",
      color: "#4267B2"
    },
    {
      icon: <AiFillTwitterSquare />,
      url: "#",
      label: "Twitter",
      color: "#1DA1F2"
    },
    {
      icon: <AiFillInstagram />,
      url: "https://www.instagram.com/teamtek2025",
      label: "Instagram",
      color: "#E1306C"
    },
    {
      icon: <AiFillLinkedin />,
      url: "#",
      label: "LinkedIn",
      color: "#0077B5"
    }
  ];

  return (
    <motion.footer 
      className="sleek-footer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="footer-container">
        <div className="footer-content">
          <motion.p 
            className="copyright"
            whileHover={{ scale: 1.02 }}
          >
            &copy; 2025 <span className="brand">EduSphere</span>. All rights reserved.<br />
            Crafted with <span className="heart">❤️</span> by <strong className="team">TEAM_TEK</strong>
          </motion.p>
          
          <div className="social-links">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                aria-label={link.label}
                className="social-icon"
                style={{ color: link.color }}
                whileHover={{ 
                  y: -3,
                  scale: 1.1,
                  textShadow: `0 2px 8px ${link.color}33`
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
        </div>

        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/contact">Contact Us</a>
          <a href="/careers">Careers</a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;