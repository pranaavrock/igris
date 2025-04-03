import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  AiFillHome, 
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlineClose 
} from "react-icons/ai";
import { FaBook, FaUserAlt } from "react-icons/fa";
import { UserData } from "../../context/UserContext";
import "./Sidebar.scss";

const Sidebar = () => {
  const { user, logout } = UserData();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/account");
  };

  const menuItems = [
    { path: "/admin/dashboard", label: "Home", icon: <AiFillHome /> },
    { path: "/admin/course", label: "Courses", icon: <FaBook /> },
    { 
      path: user ? `/admin/profile/${user._id}` : "/admin/profile", 
      label: "Profile", 
      icon: <FaUserAlt /> 
    },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar__header">
        <button 
          className="sidebar__toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <AiOutlineMenu /> : <AiOutlineClose />}
        </button>
        {!isCollapsed && <h3 className="sidebar__title">Admin Panel</h3>}
      </div>
      
      <ul className="sidebar__menu">
        {menuItems.map((item, index) => (
          <li key={index} className="sidebar__item">
            <NavLink 
              to={item.path} 
              className={({ isActive }) => 
                `sidebar__link ${isActive ? "active" : ""}`
              }
            >
              <div className="sidebar__icon">{item.icon}</div>
              {!isCollapsed && <span className="sidebar__label">{item.label}</span>}
            </NavLink>
          </li>
        ))}
        
        <li className="sidebar__item">
          <button 
            className="sidebar__link sidebar__logout"
            onClick={handleLogout}
          >
            <div className="sidebar__icon"><AiOutlineLogout /></div>
            {!isCollapsed && <span className="sidebar__label">Logout</span>}
          </button>
        </li>
      </ul>
      
      {!isCollapsed && (
        <div className="sidebar__footer">
          <div className="sidebar__user">
            {user?.name && <p>{user.name}</p>}
            {user?.email && <small>{user.email}</small>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;