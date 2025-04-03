import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { motion } from "framer-motion";
import adminImage from "./pexels-photo-1103970.webp"; // Add your admin image path
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { btnLoading, loginUser } = UserData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    await loginUser(email, password, navigate);
  };

  return (
    <motion.div 
      className="admin-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="admin-card">
        <div className="admin-content-wrapper">
          <div className="admin-form">
            <motion.div 
              className="admin-header"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="admin-title">Admin Portal</h2>
              <p className="admin-subtitle">Sign in to access the dashboard</p>
            </motion.div>

            <form onSubmit={submitHandler}>
              <div className="form-group">
                <motion.label 
                  htmlFor="email"
                  className="form-label"
                  whileHover={{ scale: 1.02 }}
                >
                  Admin Email
                </motion.label>
                <motion.input
                  type="email"
                  id="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  whileFocus={{ 
                    borderColor: "#4f46e5",
                    boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.2)"
                  }}
                />
              </div>

              <div className="form-group">
                <motion.label 
                  htmlFor="password"
                  className="form-label"
                  whileHover={{ scale: 1.02 }}
                >
                  Password
                </motion.label>
                <motion.input
                  type="password"
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  whileFocus={{ 
                    borderColor: "#4f46e5",
                    boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.2)"
                  }}
                />
              </div>

              <div className="form-actions">
                <motion.button
                  type="submit"
                  className="admin-btn"
                  disabled={btnLoading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {btnLoading ? "Authenticating..." : "Sign In"}
                </motion.button>
              </div>
            </form>

            <div className="admin-footer">
              <p className="footer-link">
                <Link to="/forgot">Forgot password?</Link>
              </p>
              <p className="footer-link">
                Not an admin? <Link to="/login">User Login</Link>
              </p>
            </div>
          </div>

          <div className="admin-image">
            <img src={adminImage} alt="Admin portal illustration" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminLogin;