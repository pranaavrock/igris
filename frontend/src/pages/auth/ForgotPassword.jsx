import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";
import { motion } from "framer-motion";
import forgotImage from "./pexels-photo-1103970.webp"; // Add your image path
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/forgot`, { email });
      toast.success(data.message);
      navigate("/login");
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };

  return (
    <motion.div 
      className="forgot-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="forgot-card">
        <div className="forgot-content-wrapper">
          <div className="forgot-form">
            <motion.div 
              className="forgot-header"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="forgot-title">Reset Your Password</h2>
              <p className="forgot-subtitle">
                Enter your email to receive a password reset link
              </p>
            </motion.div>

            <form onSubmit={handleSubmit}>
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

              <div className="form-actions">
                <motion.button
                  type="submit"
                  className="forgot-btn"
                  disabled={btnLoading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {btnLoading ? "Sending Link..." : "Send Reset Link"}
                </motion.button>
              </div>
            </form>

            <div className="forgot-footer">
              <p className="footer-link">
                Remember your password? <a href="/login">Sign In</a>
              </p>
            </div>
          </div>

          <div className="forgot-image">
            <img src={forgotImage} alt="Password reset illustration" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;