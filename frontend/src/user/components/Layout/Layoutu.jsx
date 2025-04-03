import React from 'react';
import Sidebar from '../Sidebar/Sidebaru.jsx';
import './Layoutu.css';

const UserLayout = ({ children }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default UserLayout;