import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import TicketFilter from '../components/TicketFilter';
import { Ticket, Clock, CheckCircle, AlertCircle, Eye, Inbox, UserCheck } from 'lucide-react';

const AgentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search, Filter & Sort state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (search.trim()) params.search = search.trim();
      if (sortBy) params.sortBy = sortBy;

      const response = await api.get('/tickets', { params });
      setTickets(response.data);
    } catch (err) {
      console.error('Error fetching tickets for agent:', err);
      setError('Unable to fetch tickets list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter, search, sortBy]);

  const handleReset = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setSortBy('date');
  };

  // Calculate statistics across all tickets
  const totalCount = tickets.length;
  const openCount = tickets.filter(t => t.status === 'open').length;
  const progressCount = tickets.filter(t => t.status === 'in_progress').length;
  const closedCount = tickets.filter(t => t.status === 'closed').length;

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Agent Portal & Ticket Queue</h1>
              <p className="page-subtitle">View, assign, update, and resolve customer support tickets</p>
            </div>
          </div>

          {/* Stats Cards Row */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon icon-blue">
                <Ticket size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{totalCount}</span>
                <span className="stat-label">Total Queue</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon icon-yellow">
                <AlertCircle size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{openCount}</span>
                <span className="stat-label">Open Tickets</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon icon-purple">
                <Clock size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{progressCount}</span>
                <span className="stat-label">In Progress</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon icon-green">
                <CheckCircle size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{closedCount}</span>
                <span className="stat-label">Resolved</span>
              </div>
            </div>
          </div>

          {/* Filter & Sort Controls */}
          <TicketFilter
            search={search}
            setSearch={setSearch}
            status={statusFilter}
            setStatus={setStatusFilter}
            priority={priorityFilter}
            setPriority={setPriorityFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            showSorting={true}
            onReset={handleReset}
          />

          {error && (
            <div className="alert alert-danger my-4">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Fetching ticket queue...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="empty-state">
              <Inbox size={48} className="empty-icon" />
              <h3>No matching tickets</h3>
              <p>No customer tickets matched your filter options.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Subject</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="font-mono">#{ticket.id}</td>
                      <td>
                        <div className="user-cell">
                          <span className="user-cell-name">{ticket.customer_name}</span>
                          <span className="user-cell-email">{ticket.customer_email}</span>
                        </div>
                      </td>
                      <td className="table-cell-subject">
                        <Link to={`/agent/tickets/${ticket.id}`} className="ticket-subject-link">
                          {ticket.subject}
                        </Link>
                      </td>
                      <td>
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td>
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td>
                        {ticket.assigned_agent_name ? (
                          <span className="agent-assigned-tag">
                            <UserCheck size={14} /> {ticket.assigned_agent_name}
                          </span>
                        ) : (
                          <span className="unassigned-tag">Unassigned</span>
                        )}
                      </td>
                      <td className="text-muted">
                        {new Date(ticket.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td>
                        <Link to={`/agent/tickets/${ticket.id}`} className="btn btn-primary btn-sm btn-icon">
                          <Eye size={14} /> Manage
                        </Link>
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

export default AgentDashboard;
