import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

const AgentTicketDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [agents, setAgents] = useState([]);
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'comments', 'activity'

  const [status, setStatus] = useState('open');
  const [priority, setPriority] = useState('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [newComment, setNewComment] = useState('');

  const [loading, setLoading] = useState(true);
  const [savingUpdate, setSavingUpdate] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [tRes, cRes, aRes] = await Promise.all([
        api.get(`/tickets/${id}`),
        api.get(`/tickets/${id}/comments`),
        api.get('/users')
      ]);

      const tData = tRes.data;
      setTicket(tData);
      setComments(cRes.data);
      setAgents(aRes.data);

      setStatus(tData.status);
      setPriority(tData.priority);
      setAssignedTo(tData.assigned_to ? String(tData.assigned_to) : '');
    } catch (err) {
      console.error('Error fetching ticket for agent:', err);
      setError(err.response?.data?.error || 'Failed to load ticket.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    try {
      setSavingUpdate(true);
      setUpdateMsg('');
      setError('');

      const payload = {
        status,
        priority,
        assigned_to: assignedTo ? parseInt(assignedTo, 10) : null
      };

      const res = await api.put(`/tickets/${id}`, payload);
      setTicket(res.data.ticket);
      setUpdateMsg('Ticket actions updated!');
      setTimeout(() => setUpdateMsg(''), 3000);
    } catch (err) {
      console.error('Error updating ticket:', err);
      setError(err.response?.data?.error || 'Failed to update ticket.');
    } finally {
      setSavingUpdate(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const res = await api.post(`/tickets/${id}/comments`, { comment: newComment.trim() });
      setComments((prev) => [...prev, res.data.comment]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to post reply.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading agent workspace...</div>
        </main>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <Link to="/agent/tickets" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to All Tickets
          </Link>
          <div className="alert alert-danger">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Back Link matching Mockup #10 */}
        <Link to="/agent/tickets" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to All Tickets
        </Link>

        {/* Ticket Header matching Mockup #10 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#64748b', fontSize: '0.9rem' }}>#{ticket.id}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
            <h1 className="welcome-title">{ticket.subject}</h1>
            <span className={`badge-pill badge-${ticket.priority.toLowerCase()}`}>
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
            </span>
            <span className={`badge-pill badge-${ticket.status === 'closed' ? 'resolved' : ticket.status}`}>
              {ticket.status === 'closed' ? 'Resolved' : ticket.status === 'in_progress' ? 'In Progress' : 'Open'}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.35rem' }}>
            Customer: <strong style={{ color: '#0f172a' }}>{ticket.customer_name}</strong> • Assigned to: <strong style={{ color: '#0f172a' }}>{ticket.assigned_agent_name || 'Unassigned'}</strong>
          </p>
        </div>

        {/* Tab Navigation matching Mockup #10 */}
        <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('details')}
            style={{
              padding: '0.65rem 0',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: activeTab === 'details' ? '#0b1329' : '#64748b',
              borderBottom: activeTab === 'details' ? '2px solid #0b1329' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            Details
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            style={{
              padding: '0.65rem 0',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: activeTab === 'comments' ? '#0b1329' : '#64748b',
              borderBottom: activeTab === 'comments' ? '2px solid #0b1329' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            Comments ({comments.length})
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            style={{
              padding: '0.65rem 0',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: activeTab === 'activity' ? '#0b1329' : '#64748b',
              borderBottom: activeTab === 'activity' ? '2px solid #0b1329' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            Activity
          </button>
        </div>

        {/* Details & Actions Grid matching Mockup #10 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
          {/* Main Panel */}
          <div>
            {activeTab === 'details' && (
              <div className="card-wrapper">
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Description</h3>
                <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: 1.6, whitespace: 'pre-wrap' }}>
                  {ticket.description}
                </p>
              </div>
            )}

            {(activeTab === 'details' || activeTab === 'comments') && (
              <div className="card-wrapper">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
                  Discussion History ({comments.length})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {comments.map((c) => {
                    const isAgent = c.user_role === 'agent';
                    return (
                      <div key={c.id} style={{
                        display: 'flex',
                        gap: '1rem',
                        padding: '1rem',
                        borderRadius: '12px',
                        background: isAgent ? '#f8fafc' : '#ffffff',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div className="user-avatar-circle" style={{ background: isAgent ? '#0b1329' : '#cbd5e1', color: isAgent ? '#ffffff' : '#0f172a', flexShrink: 0 }}>
                          {c.user_name ? c.user_name.substring(0, 2).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                            <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{c.user_name}</strong>
                            {isAgent && (
                              <span className="badge-pill" style={{ background: '#0b1329', color: '#ffffff', fontSize: '0.7rem' }}>
                                Support Agent
                              </span>
                            )}
                            <span style={{ fontSize: '0.775rem', color: '#94a3b8' }}>
                              {new Date(c.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
                            {c.comment}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Agent Reply */}
                <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                  <form onSubmit={handleAddComment}>
                    <textarea
                      className="form-input-control"
                      rows={3}
                      placeholder="Add an agent response..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      style={{ marginBottom: '1rem', resize: 'vertical' }}
                      required
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="submit" disabled={submittingComment || !newComment.trim()} className="btn-dark">
                        {submittingComment ? 'Sending Reply...' : 'Post Reply'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="card-wrapper">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Audit Log & Activity</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  • Ticket created at {new Date(ticket.created_at).toLocaleString()}<br />
                  • Last updated at {new Date(ticket.updated_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Ticket Actions Box matching Mockup #10 */}
          <div>
            <div className="card-wrapper">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>Ticket Actions</h3>

              {updateMsg && (
                <div className="alert alert-success" style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
                  <CheckCircle2 size={14} />
                  <span>{updateMsg}</span>
                </div>
              )}

              <form onSubmit={handleUpdateTicket}>
                <div className="form-group-field">
                  <label htmlFor="act-status">Change Status</label>
                  <select
                    id="act-status"
                    className="select-filter-control"
                    style={{ width: '100%' }}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Resolved</option>
                  </select>
                </div>

                <div className="form-group-field">
                  <label htmlFor="act-priority">Change Priority</label>
                  <select
                    id="act-priority"
                    className="select-filter-control"
                    style={{ width: '100%' }}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="form-group-field">
                  <label htmlFor="act-assign">Assign to Agent</label>
                  <select
                    id="act-assign"
                    className="select-filter-control"
                    style={{ width: '100%' }}
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {agents.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" disabled={savingUpdate} className="btn-dark" style={{ width: '100%', marginTop: '1rem' }}>
                  {savingUpdate ? 'Saving Changes...' : 'Save Ticket Actions'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentTicketDetails;
