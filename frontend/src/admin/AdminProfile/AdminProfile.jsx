import React, { useState, useEffect } from "react";
import { UserData } from "../../context/UserContext";
import axios from "axios";
import "./adminprofile.css";
import { useNavigate } from "react-router-dom";
import { server } from "../../main"; // Adjust the path if necessary


const AdminProfile = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate
  const { user } = UserData();
  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
    email: "",
    profilePicture: "/default-avatar.png",
    bio: "",
    gender: "",
    dateOfBirth: "",
    phoneNumber: "",
    userId: "N/A",
    joinDate: "N/A",
    lastLogin: "N/A",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModified, setIsModified] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:y", token); // ✅ Debugging: Check if token is correct
    
        const res = await axios.get(`${server}/api/user/profile/${user?._id}`, {
          headers: { token }, // Ensure token is correct
          withCredentials: true,
        });
    
        console.log("API Response:", res.data); // ✅ Debugging: See API response
    
        const data = res.data;
        setProfileData({
          fullName: data.fullName || "N/A",
          username: data.username || "",
          email: data.email || "",
          profilePicture: data.profilePicture || "/default-avatar.png",
          bio: data.bio || "",
          gender: data.gender || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
          phoneNumber: data.phoneNumber || "",
          userId: data.userId || "N/A",
          joinDate: data.joinDate || "N/A",
          lastLogin: data.lastLogin || "N/A",
          role: data.role || "user",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage("Failed to load profile.");
      }
    };

    if (user) fetchProfile();
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setIsModified(true);
  };

  // Handle image upload preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData({ ...profileData, profilePicture: imageUrl });
      setIsModified(true);
    }
  };

  // Save profile changes
  const handleSave = async () => {
    if (!isModified) {
      console.warn("⚠️ No changes detected — Aborting update.");
      return;
    }
  
    setLoading(true);
    setMessage("");
  
    try {
      const token = localStorage.getItem("token");
      console.log("🟡 Token retrieved:", token);
  
      const updatedData = {
        username: profileData.username,
        bio: profileData.bio,
        gender: profileData.gender,
        dateOfBirth: profileData.dateOfBirth,
        phoneNumber: profileData.phoneNumber,
      };
  
      console.log("📦 Data being sent to API:", updatedData);
  
      const res = await axios.put(`${server}/api/user/profile`, updatedData, {
        headers: { token },  // Corrected header
        withCredentials: true,
      });
  
      console.log("✅ Server Response:", res.data);
  
      setMessage("Profile updated successfully!");
      setIsModified(false);
    } catch (error) {
      console.error("❌ Error updating profile:", error);
  
      // Improved error message handling
      if (error.response) {
        console.error("🟥 Server Response Error:", error.response.data);
        setMessage(error.response.data.message || "Failed to update profile.");
      } else if (error.request) {
        console.error("🟠 No Response Received:", error.request);
        setMessage("Server is not responding. Please try again.");
      } else {
        console.error("🔴 Axios Error:", error.message);
        setMessage("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="admin-profile">
      <div className="profile-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>
        
        <div className="profile-header">
          <h1>Admin Profile</h1>
          <div className="role-badge">
            <i className="fas fa-shield-alt"></i> {profileData.role}
          </div>
        </div>
  
        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="avatar-upload">
              <div className="avatar-preview">
                <img 
                  src={profileData.profilePicture} 
                  alt="Profile" 
                  onError={(e) => {
                    e.target.src = '/default-avatar.png'
                  }}
                />
              </div>
              <label className="upload-button">
                <i className="fas fa-camera"></i> Change Photo
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }}
                />
              </label>
            </div>
  
            <div className="account-meta">
              <div className="meta-item">
                <i className="fas fa-id-card"></i>
                <span>User ID: {profileData.userId}</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-calendar-plus"></i>
                <span>Joined: {profileData.joinDate}</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-clock"></i>
                <span>Last Login: {profileData.lastLogin}</span>
              </div>
            </div>
          </div>
  
          <div className="profile-form">
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={profileData.fullName} 
                    disabled 
                  />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    name="username" 
                    value={profileData.username} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="text" 
                    name="email" 
                    value={profileData.email} 
                    disabled 
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="text" 
                    name="phoneNumber" 
                    value={profileData.phoneNumber} 
                    onChange={handleChange} 
                    placeholder="+1 (123) 456-7890" 
                  />
                </div>
              </div>
            </div>
  
            <div className="form-section">
              <h3>Personal Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input 
                    type="date" 
                    name="dateOfBirth" 
                    value={profileData.dateOfBirth} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select 
                    name="gender" 
                    value={profileData.gender} 
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
  
            <div className="form-section">
              <h3>About You</h3>
              <div className="form-group">
                <label>Bio</label>
                <textarea 
                  name="bio" 
                  value={profileData.bio} 
                  onChange={handleChange} 
                  rows="4"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
            </div>
  
            {message && (
              <div className={`status-message ${message.includes("success") ? "success" : "error"}`}>
                {message}
              </div>
            )}
  
            <div className="form-actions">
              <button 
                className={`save-button ${!isModified ? "disabled" : ""}`}
                onClick={handleSave} 
                disabled={!isModified || loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

