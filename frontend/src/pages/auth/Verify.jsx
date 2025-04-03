import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { motion } from "framer-motion";
import { ReCAPTCHA } from "react-google-recaptcha";
import verifyImage from "./pexels-photo-1103970.webp"; // Using the same image
import "./Verify.css";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const { btnLoading, verifyOtp } = UserData();
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleCaptchaChange = (value) => {
    setIsCaptchaVerified(!!value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!otp) newErrors.otp = "OTP is required";
    else if (otp.length !== 6) newErrors.otp = "OTP must be 6 digits";
    if (!isCaptchaVerified) newErrors.captcha = "Please verify you're not a robot";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await verifyOtp(Number(otp), navigate);
    }
  };

  return (
    <motion.div 
      className="verify-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="verify-card">
        <div className="verify-content-wrapper">
          <div className="verify-form">
            <motion.div 
              className="verify-header"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="verify-title">Verify Your Account</h2>
              <p className="verify-subtitle">Enter the OTP sent to your email</p>
            </motion.div>

            <form onSubmit={submitHandler} noValidate>
              <div className="form-group">
                <label htmlFor="otp" className="form-label">
                  OTP Code <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="otp"
                  className={`form-input ${errors.otp ? 'input-error' : ''}`}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  required
                />
                {errors.otp && <div className="error-message">{errors.otp}</div>}
              </div>

              <div className="captcha-container">
                <ReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                  onChange={handleCaptchaChange}
                  theme="light"
                />
                {errors.captcha && !isCaptchaVerified && (
                  <div className="error-message">{errors.captcha}</div>
                )}
              </div>

              <motion.button
                type="submit"
                className="verify-btn"
                disabled={btnLoading || !isCaptchaVerified}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {btnLoading ? "Verifying..." : "Verify Account"}
              </motion.button>
            </form>

            <div className="verify-footer">
              <p className="footer-link">
                Didn't receive code? <Link to="/resend-otp">Resend OTP</Link>
              </p>
              <p className="footer-link">
                Go back to <Link to="/login">Login</Link>
              </p>
            </div>
          </div>

          <div className="verify-image">
            <img src={verifyImage} alt="Account verification" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Verify;