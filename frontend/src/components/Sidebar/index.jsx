import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './index.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAgent = user.role === 'agent';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-brand-name">HelpDesk</span>
      </div>

      <nav className="sidebar-nav">
        {isAgent ? (
          <>
            <NavLink 
              to="/agent/dashboard" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>Dashboard</span>
            </NavLink>

            <NavLink 
              to="/agent/tickets" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>All Tickets</span>
            </NavLink>

            <NavLink 
              to="/agent/users" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>Users & Agents</span>
            </NavLink>

            <NavLink 
              to="/profile" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>Profile</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink 
              to="/customer/dashboard" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>Dashboard</span>
            </NavLink>

            <NavLink 
              to="/customer/tickets" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>My Tickets</span>
            </NavLink>

            <NavLink 
              to="/customer/tickets/new" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>Create Ticket</span>
            </NavLink>

            <NavLink 
              to="/profile" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>Profile</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="navbar-user-profile">
          <div className="user-avatar-circle">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'JD'}
          </div>
          <div className="user-profile-meta">
            <span className="user-profile-name">{user?.name || 'User'}</span>
            <span className="user-profile-role">{isAgent ? 'Support Agent' : 'Customer'}</span>
          </div>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
