import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Edit, Mail, Phone, Calendar, User, Clock, Key } from "lucide-react";
import { server } from "../../main";
import "./ProfileView.css";


export default function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!id) {
      setError("User ID is missing from URL");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized: No token provided");

        const response = await fetch(`${server}/api/profile/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json", token },
          credentials: "include",
        });

        if (!response.ok) throw new Error(`Failed to fetch profile: ${response.status}`);
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleEditClick = () => {
    if (location.pathname.includes(`/user/profile1/${id}`)) {
      navigate("/account11"); // Admin profile edit
    } else {
      navigate("/account1"); // Regular profile edit
    }
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (error) return <div className="profile-error">{error}</div>;
  if (!profile) return <div className="profile-not-found">Profile not found</div>;

  return (
    <div className="profile-view-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        <button onClick={handleEditClick} className="edit-button">
          <Edit size={16} />
          Edit Profile
        </button>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          <img 
            src={profile.profilePicture || "https://via.placeholder.com/150"} 
            alt={profile.fullName} 
            className="avatar-image"
          />
          <div className="profile-badge">{profile.role}</div>
        </div>

        <div className="profile-info">
          <h2>{profile.fullName}</h2>
          <p className="username">@{profile.username}</p>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
        </div>
      </div>

      <div className="profile-details">
        <DetailCard title="Personal Information">
          <DetailItem icon={<Mail size={16} />} label="Email" value={profile.email} />
          <DetailItem icon={<Phone size={16} />} label="Phone" value={profile.phoneNumber || "Not provided"} />
          <DetailItem icon={<Calendar size={16} />} label="Date of Birth" value={profile.dateOfBirth || "Not provided"} />
          <DetailItem icon={<User size={16} />} label="Gender" value={profile.gender || "Not specified"} />
        </DetailCard>

        <DetailCard title="Account Information">
          <DetailItem icon={<Clock size={16} />} label="Join Date" value={profile.joinDate} />
          <DetailItem icon={<Clock size={16} />} label="Last Login" value={profile.lastLogin || "Recently"} />
          <DetailItem icon={<Key size={16} />} label="Account Type" value={profile.role} />
        </DetailCard>
      </div>
    </div>
  );
}

function DetailCard({ title, children }) {
  return (
    <div className="detail-card">
      <h3>{title}</h3>
      <div className="detail-items">{children}</div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="detail-item">
      <div className="detail-icon">{icon}</div>
      <div className="detail-content">
        <span className="detail-label">{label}</span>
        <span className="detail-value">{value}</span>
      </div>
    </div>
  );
}
