import React from "react";
import { MdDashboard, MdAdminPanelSettings } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import profileImage from "./pexels-photo-1103970.webp"; // Add your image path here
import "./Account.css";

const Account = ({ user }) => {
  const { setIsAuth, setUser } = UserData();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);
    toast.success("Signed out successfully");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="account-container">
      <div className="account-card">
        <div className="account-content-wrapper">
          <div className="account-details">
            <div className="account-header">
              <h2 className="account-title">Account Details</h2>
              <p className="account-subtitle">Manage your profile and settings</p>
            </div>

            <div className="user-info-section">
              <div className="info-row">
                <span className="info-label">Full Name</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email Address</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Account Type</span>
                <span className="info-value capitalize">{user.role}</span>
              </div>
            </div>

            <div className="account-actions">
              <button 
                onClick={() => navigate(`/${user._id}/dashboard`)}
                className="action-btn"
              >
                <MdDashboard className="icon" />
                <span>User Dashboard</span>
              </button>

              {user.role === "admin" && (
                <button 
                  onClick={() => navigate("/admin/dashboard")}
                  className="action-btn"
                >
                  <MdAdminPanelSettings className="icon" />
                  <span>Admin Portal</span>
                </button>
              )}

              <button 
                onClick={handleLogout}
                className="action-btn logout-btn"
              >
                <IoMdLogOut className="icon" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          <div className="account-image">
            <img src={profileImage} alt="Profile illustration" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;