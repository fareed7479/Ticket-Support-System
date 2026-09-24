import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react';

const UserManagement = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users');
        setAgents(response.data);
      } catch (err) {
        console.error('Error fetching agents:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Mock list combining agents + customer users for demonstration matching Mockup #11
  const allUsersList = [
    ...agents.map(a => ({ id: a.id, name: a.name, email: a.email, role: 'Agent', status: 'Active' })),
    { id: 101, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Active' },
    { id: 102, name: 'Emma Wilson', email: 'emma@example.com', role: 'Customer', status: 'Active' },
    { id: 103, name: 'Alex Smith', email: 'alex@example.com', role: 'Customer', status: 'Active' }
  ];

  const filteredUsers = allUsersList.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Top Header */}
        <div className="top-header">
          <div>
            <h1 className="welcome-title">Users & Agents</h1>
            <p className="welcome-subtitle">Manage system users and agents.</p>
          </div>

          <div className="header-user-profile">
            <div className="user-avatar-circle" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'SL'}
            </div>
            <div className="user-profile-meta">
              <span className="user-profile-name">{user?.name || 'Sarah Lee'}</span>
              <span className="user-profile-role">Agent</span>
            </div>
          </div>
        </div>

        {/* Search Bar matching Mockup #11 */}
        <div className="filter-bar-flex">
          <div className="search-input-box" style={{ maxWidth: '380px' }}>
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* User Table matching Mockup #11 */}
        <div className="card-wrapper">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading user directory...</div>
          ) : (
            <div className="table-responsive">
              <table className="helpdesk-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td style={{ fontWeight: 600 }}>{u.role}</td>
                      <td>
                        <span className="badge-pill badge-active">
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
