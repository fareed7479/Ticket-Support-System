import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Search } from 'lucide-react';
import './index.css';

const CustomerTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (search.trim()) params.search = search.trim();

      const response = await api.get('/tickets', { params });
      setTickets(response.data);
    } catch (err) {
      console.error('Error fetching customer tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter, search]);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Top Header */}
        <div className="top-header">
          <div>
            <h1 className="welcome-title">My Tickets</h1>
            <p className="welcome-subtitle">View and manage your support tickets.</p>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="filter-bar-flex">
          <div className="search-input-box">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="select-filter-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Resolved</option>
          </select>

          <select
            className="select-filter-control"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Tickets Table Card */}
        <div className="card-wrapper">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#72777d' }}>Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#72777d' }}>No tickets found matching criteria.</div>
          ) : (
            <div className="table-responsive">
              <table className="helpdesk-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Subject</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id}>
                      <td className="cell-id">#{t.id}</td>
                      <td className="cell-subject">
                        <Link to={`/customer/tickets/${t.id}`}>{t.subject}</Link>
                      </td>
                      <td>
                        <span className={`badge-pill badge-${t.priority.toLowerCase()}`}>
                          {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-pill badge-${t.status === 'closed' ? 'resolved' : t.status}`}>
                          {t.status === 'closed' ? 'Resolved' : t.status === 'in_progress' ? 'In Progress' : 'Open'}
                        </span>
                      </td>
                      <td>
                        {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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

export default CustomerTickets;
