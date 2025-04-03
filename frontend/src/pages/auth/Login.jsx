import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { CourseData } from "../../context/CourseContext";
import { motion } from "framer-motion";
import loginImage from "./pexels-photo-1103970.webp"; // Add your image path here
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { btnLoading, loginUser } = UserData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { fetchMyCourse } = CourseData();

  const submitHandler = async (e) => {
    e.preventDefault();
    await loginUser(email, password, navigate, fetchMyCourse);
  };

  return (
    <motion.div 
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="login-card">
        <div className="login-content-wrapper">
          <div className="login-form">
            <motion.div 
              className="login-header"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-subtitle">Sign in to access your account</p>
            </motion.div>

            <form onSubmit={submitHandler}>
              <div className="form-group">
                <motion.label 
                  htmlFor="email"
                  className="form-label"
                  whileHover={{ scale: 1.02 }}
                >
                  Email Address
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
                  className="login-btn"
                  disabled={btnLoading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {btnLoading ? "Signing In..." : "Sign In"}
                </motion.button>
              </div>
            </form>

            <div className="login-footer">
              <p className="footer-link">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
              <p className="footer-link">
                <Link to="/forgot">Forgot password?</Link>
              </p>
              <div className="admin-option">
                <p>Admin? <Link to="/adminLogin">Login here</Link></p>
              </div>
            </div>
          </div>

          <div className="login-image">
            <img src={loginImage} alt="Login illustration" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;