import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await api.get('/tickets');
        setTickets(response.data);
      } catch (err) {
        console.error('Error fetching tickets for agent dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const totalCount = tickets.length;
  const openCount = tickets.filter(t => t.status === 'open').length;
  const progressCount = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'closed').length;

  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Top Header */}
        <div className="top-header">
          <div>
            <h1 className="welcome-title">Welcome back, {user?.name?.split(' ')[0] || 'Sarah'} 👋</h1>
            <p className="welcome-subtitle">Here's what's happening with your tickets.</p>
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

        {/* Stats Row matching Mockup #8 */}
        <div className="stats-cards-grid">
          <div className="stat-card-item">
            <div className="stat-card-title">Total Tickets</div>
            <div className="stat-card-number">{totalCount}</div>
          </div>

          <div className="stat-card-item stat-card-open">
            <div className="stat-card-title">Open</div>
            <div className="stat-card-number">{openCount}</div>
          </div>

          <div className="stat-card-item stat-card-progress">
            <div className="stat-card-title">In Progress</div>
            <div className="stat-card-number">{progressCount}</div>
          </div>

          <div className="stat-card-item stat-card-resolved">
            <div className="stat-card-title">Resolved</div>
            <div className="stat-card-number">{resolvedCount}</div>
          </div>
        </div>

        {/* Overview Grid matching Mockup #8 */}
        <div className="overview-grid-container">
          {/* Ticket Overview Chart Box */}
          <div className="card-wrapper">
            <h2 className="card-title-text" style={{ marginBottom: '1rem' }}>Ticket Overview</h2>
            <div className="donut-chart-box">
              <div className="donut-circle-graphic">
                <div className="donut-inner-hole">
                  {totalCount}
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Total</span>
                </div>
              </div>

              <div className="donut-legend-list">
                <div className="donut-legend-item">
                  <span><span className="legend-dot" style={{ background: '#0284c7' }}></span>Open</span>
                  <strong>{openCount}</strong>
                </div>
                <div className="donut-legend-item">
                  <span><span className="legend-dot" style={{ background: '#4f46e5' }}></span>In Progress</span>
                  <strong>{progressCount}</strong>
                </div>
                <div className="donut-legend-item">
                  <span><span className="legend-dot" style={{ background: '#15803d' }}></span>Resolved</span>
                  <strong>{resolvedCount}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tickets Table Box */}
          <div className="card-wrapper">
            <div className="card-header-flex">
              <h2 className="card-title-text">Recent Tickets</h2>
              <Link to="/agent/tickets" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span>View all</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading tickets...</div>
            ) : recentTickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No recent tickets.</div>
            ) : (
              <div className="table-responsive">
                <table className="helpdesk-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Subject</th>
                      <th>Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTickets.map((t) => (
                      <tr key={t.id}>
                        <td className="cell-id">#{t.id}</td>
                        <td className="cell-subject">
                          <Link to={`/agent/tickets/${t.id}`}>{t.subject}</Link>
                        </td>
                        <td>
                          <span className={`badge-pill badge-${t.priority.toLowerCase()}`}>
                            {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentDashboard;
