import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, LogOut, User, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath = user.role === 'agent' ? '/agent/dashboard' : '/customer/dashboard';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={dashboardPath} className="navbar-brand">
          <Ticket className="brand-icon" size={24} />
          <span>SupportDesk</span>
        </Link>

        <div className="navbar-actions">
          {user.role === 'customer' && (
            <Link to="/customer/tickets/new" className="btn btn-primary btn-sm btn-icon">
              <PlusCircle size={16} />
              <span>Create Ticket</span>
            </Link>
          )}

          <div className="user-profile">
            <User size={18} className="user-icon" />
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className={`role-pill role-${user.role}`}>
                {user.role === 'agent' ? 'Support Agent' : 'Customer'}
              </span>
            </div>
          </div>

          <button onClick={handleLogout} className="btn btn-secondary btn-sm btn-icon" title="Logout">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
