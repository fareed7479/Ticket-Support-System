import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2 } from 'lucide-react';
import './index.css';

const Profile = () => {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || 'John Doe');
  const [email, setEmail] = useState(user?.email || 'john@example.com');
  const [successMessage, setSuccessMessage] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    setSuccessMessage('Profile information updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'JD';

  return (
    <div className="dashboard-layout profile-page">
      <Sidebar />

      <main className="dashboard-main">
        {/* Top Header */}
        <div className="top-header">
          <div>
            <h1 className="welcome-title">Profile Settings</h1>
            <p className="welcome-subtitle">Manage your account information.</p>
          </div>
        </div>

        {/* Profile Card Container */}
        <div className="form-card-container">
          <div className="card-wrapper">
            {/* Avatar Section */}
            <div className="profile-avatar-header">
              <div className="profile-avatar-large">
                {initials}
              </div>

              <button type="button" className="btn-dark profile-photo-btn">
                Change Photo
              </button>
            </div>

            {successMessage && (
              <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
                <CheckCircle2 size={16} />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleUpdate}>
              <div className="form-group-field">
                <label htmlFor="profile-fullname">Full Name</label>
                <input
                  id="profile-fullname"
                  type="text"
                  className="form-input-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-field">
                <label htmlFor="profile-email">Email Address</label>
                <input
                  id="profile-email"
                  type="email"
                  className="form-input-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-field">
                <label htmlFor="profile-role">Role</label>
                <select id="profile-role" className="select-filter-control" disabled style={{ width: '100%', background: '#f1f5f9' }}>
                  <option value="customer">{user?.role === 'agent' ? 'Agent' : 'Customer'}</option>
                </select>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <button type="submit" className="btn-dark" style={{ width: '100%' }}>
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
