import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import { server } from "../../main";
import resetImage from "./pexels-photo-1103970.webp"; // Add your image path
import "./ResetPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/user/reset?token=${params.token}`,
        { password }
      );
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <motion.div 
      className="reset-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="reset-card">
        <div className="reset-content-wrapper">
          <div className="reset-form">
            <motion.div 
              className="reset-header"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="reset-title">Reset Password</h2>
              <p className="reset-subtitle">
                Create a new secure password for your account
              </p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <motion.label 
                  htmlFor="password"
                  className="form-label"
                  whileHover={{ scale: 1.02 }}
                >
                  New Password
                </motion.label>
                <motion.input
                  type="password"
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                  whileFocus={{ 
                    borderColor: "#4f46e5",
                    boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.2)"
                  }}
                />
              </div>

              <div className="form-group">
                <motion.label 
                  htmlFor="confirmPassword"
                  className="form-label"
                  whileHover={{ scale: 1.02 }}
                >
                  Confirm Password
                </motion.label>
                <motion.input
                  type="password"
                  id="confirmPassword"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="6"
                  whileFocus={{ 
                    borderColor: "#4f46e5",
                    boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.2)"
                  }}
                />
              </div>

              <div className="form-actions">
                <motion.button
                  type="submit"
                  className="reset-btn"
                  disabled={btnLoading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {btnLoading ? "Updating..." : "Reset Password"}
                </motion.button>
              </div>
            </form>

            <div className="reset-footer">
              <p className="footer-link">
                Remember your password? <a href="/login">Sign In</a>
              </p>
            </div>
          </div>

          <div className="reset-image">
            <img src={resetImage} alt="Password reset illustration" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResetPassword;