import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Ticket, 
  PlusCircle, 
  Users, 
  User, 
  LogOut,
  HelpCircle
} from 'lucide-react';

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
        <div className="sidebar-logo-icon">
          <HelpCircle size={22} />
        </div>
        <span className="sidebar-brand-name">HelpDesk</span>
      </div>

      <nav className="sidebar-nav">
        {isAgent ? (
          <>
            <NavLink 
              to="/agent/dashboard" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink 
              to="/agent/tickets" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Ticket size={18} />
              <span>All Tickets</span>
            </NavLink>

            <NavLink 
              to="/agent/users" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Users size={18} />
              <span>Users & Agents</span>
            </NavLink>

            <NavLink 
              to="/profile" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <User size={18} />
              <span>Profile</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink 
              to="/customer/dashboard" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink 
              to="/customer/tickets" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Ticket size={18} />
              <span>My Tickets</span>
            </NavLink>

            <NavLink 
              to="/customer/tickets/new" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <PlusCircle size={18} />
              <span>Create Ticket</span>
            </NavLink>

            <NavLink 
              to="/profile" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <User size={18} />
              <span>Profile</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
