import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiBook, 
  FiUser, 
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { FiAward, FiCalendar } from "react-icons/fi";
import './Sidebaru.css';
import { UserData } from '../../../context/UserContext';

const Sidebaru = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = UserData();

  const menuItems = [
    { path: `/${user._id}/dashboard`, name: "Home", icon: <FiHome /> },
    { path: "/courses", name: "Courses", icon: <FiBook /> },
    { path: user ? `/user/profile1/${user._id}` : "/admin/profile", name: "Profile", icon: <FiUser /> },
    { path: user ? `/certifications` : "/admin/certifications", name: "Certification", icon: <FiAward /> }, // Changed icon & path
    { path: user ? `/planner/${user._id}` : "/admin/planner", name: "Planner", icon: <FiCalendar /> }
  ];

  return (
    <aside className={`sidebaru ${collapsed ? 'sidebaru-collapsed' : ''}`}>
      <div className="sidebaru-header">
        <button 
          className="sidebaru-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <FiMenu size={20} /> : <FiX size={20} />}
        </button>
        {!collapsed && <h2 className="sidebaru-logo">LearnHub</h2>}
      </div>

      <nav className="sidebaru-nav">
        <ul className="sidebaru-nav-list">
          {menuItems.map((item, index) => (
            <li key={index} className="sidebaru-nav-item">
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  `sidebaru-nav-link ${isActive ? 'sidebaru-nav-link-active' : ''}`
                }
              >
                <span className="sidebaru-nav-icon">{item.icon}</span>
                {!collapsed && <span className="sidebaru-nav-text">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebaru-footer">
        <button className="sidebaru-logout-btn">
          <FiLogOut className="sidebaru-logout-icon" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebaru;