import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2 } from 'lucide-react';

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
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Top Header */}
        <div className="top-header">
          <div>
            <h1 className="welcome-title">Profile Settings</h1>
            <p className="welcome-subtitle">Manage your account information.</p>
          </div>

          <div className="header-user-profile">
            <div className="user-avatar-circle">
              {initials}
            </div>
            <div className="user-profile-meta">
              <span className="user-profile-name">{user?.name || 'John Doe'}</span>
              <span className="user-profile-role">{user?.role === 'agent' ? 'Agent' : 'Customer'}</span>
            </div>
          </div>
        </div>

        {/* Profile Card Container matching Mockup #12 */}
        <div className="form-card-container">
          <div className="card-wrapper">
            {/* Avatar Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#cbd5e1',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.5rem'
              }}>
                {initials}
              </div>

              <button type="button" className="btn-dark" style={{ background: 'transparent', color: '#0b1329', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
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
