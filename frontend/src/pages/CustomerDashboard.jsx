import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import TicketFilter from '../components/TicketFilter';
import { Ticket, PlusCircle, Clock, CheckCircle, AlertCircle, Eye, Inbox } from 'lucide-react';

const CustomerDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (search.trim()) params.search = search.trim();

      const response = await api.get('/tickets', { params });
      setTickets(response.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Unable to load your support tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter, search]);

  const handleReset = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
  };

  // Compute stat counts from total dataset
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
              <h1 className="page-title">My Support Tickets</h1>
              <p className="page-subtitle">Track, manage, and create support requests</p>
            </div>
            <Link to="/customer/tickets/new" className="btn btn-primary btn-icon">
              <PlusCircle size={18} />
              <span>Create New Ticket</span>
            </Link>
          </div>

          {/* Stats Cards Row */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon icon-blue">
                <Ticket size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{totalCount}</span>
                <span className="stat-label">Total Tickets</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon icon-yellow">
                <AlertCircle size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{openCount}</span>
                <span className="stat-label">Open</span>
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
                <span className="stat-label">Closed</span>
              </div>
            </div>
          </div>

          {/* Filter Component */}
          <TicketFilter
            search={search}
            setSearch={setSearch}
            status={statusFilter}
            setStatus={setStatusFilter}
            priority={priorityFilter}
            setPriority={setPriorityFilter}
            onReset={handleReset}
          />

          {/* Ticket List Table / Card View */}
          {error && (
            <div className="alert alert-danger my-4">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="empty-state">
              <Inbox size={48} className="empty-icon" />
              <h3>No tickets found</h3>
              <p>You haven't submitted any tickets matching the current criteria.</p>
              <Link to="/customer/tickets/new" className="btn btn-primary btn-sm mt-3">
                Create Ticket Now
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Subject</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th>Assigned Agent</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="font-mono">#{ticket.id}</td>
                      <td className="table-cell-subject">
                        <Link to={`/customer/tickets/${ticket.id}`} className="ticket-subject-link">
                          {ticket.subject}
                        </Link>
                      </td>
                      <td>
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td>
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="text-muted">
                        {new Date(ticket.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="text-muted">
                        {ticket.assigned_agent_name || <em>Unassigned</em>}
                      </td>
                      <td>
                        <Link to={`/customer/tickets/${ticket.id}`} className="btn btn-secondary btn-sm btn-icon">
                          <Eye size={14} /> View
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

export default CustomerDashboard;
