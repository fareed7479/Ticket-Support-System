import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { ArrowLeft, MessageSquare, Send, Save, AlertCircle, Clock, User, ShieldCheck, CheckCircle2 } from 'lucide-react';

const AgentTicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [agents, setAgents] = useState([]);

  // Form edit states
  const [status, setStatus] = useState('open');
  const [priority, setPriority] = useState('medium');
  const [assignedTo, setAssignedTo] = useState('');
  
  const [newComment, setNewComment] = useState('');

  const [loading, setLoading] = useState(true);
  const [savingUpdate, setSavingUpdate] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  
  const [error, setError] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [commentError, setCommentError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [ticketRes, commentsRes, agentsRes] = await Promise.all([
        api.get(`/tickets/${id}`),
        api.get(`/tickets/${id}/comments`),
        api.get('/users') // Agent dropdown list
      ]);

      const ticketData = ticketRes.data;
      setTicket(ticketData);
      setComments(commentsRes.data);
      setAgents(agentsRes.data);

      // Initialize edit fields
      setStatus(ticketData.status);
      setPriority(ticketData.priority);
      setAssignedTo(ticketData.assigned_to ? String(ticketData.assigned_to) : '');
    } catch (err) {
      console.error('Error loading ticket details for agent:', err);
      setError(err.response?.data?.error || 'Failed to load ticket details.');
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
      setUpdateMessage('');
      setError('');

      const payload = {
        status,
        priority,
        assigned_to: assignedTo ? parseInt(assignedTo, 10) : null
      };

      const response = await api.put(`/tickets/${id}`, payload);
      setTicket(response.data.ticket);
      setUpdateMessage('Ticket updated successfully!');
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (err) {
      console.error('Error updating ticket:', err);
      setError(err.response?.data?.error || 'Failed to update ticket');
    } finally {
      setSavingUpdate(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      setCommentError('');

      const response = await api.post(`/tickets/${id}/comments`, {
        comment: newComment.trim()
      });

      setComments((prev) => [...prev, response.data.comment]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting agent response:', err);
      setCommentError('Failed to post comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <div className="container loading-state">
            <div className="spinner"></div>
            <p>Loading agent workspace...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <div className="container container-sm">
            <Link to="/agent/dashboard" className="back-link">
              <ArrowLeft size={16} /> Back to Agent Dashboard
            </Link>
            <div className="alert alert-danger my-4">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="container">
          <div className="page-header">
            <div>
              <Link to="/agent/dashboard" className="back-link mb-2">
                <ArrowLeft size={16} /> Back to Queue
              </Link>
              <div className="ticket-title-row">
                <h1 className="page-title">{ticket.subject}</h1>
                <span className="ticket-id-tag">Ticket #{ticket.id}</span>
              </div>
            </div>
          </div>

          <div className="ticket-details-grid">
            {/* Main Column: Ticket Body & Comments */}
            <div className="ticket-main-section">
              <div className="card">
                <div className="card-header border-bottom flex-between">
                  <h3>Customer Issue Description</h3>
                  <div className="customer-info-pill">
                    <User size={14} /> {ticket.customer_name} ({ticket.customer_email})
                  </div>
                </div>
                <div className="card-body">
                  <p className="ticket-description-text">{ticket.description}</p>
                </div>
              </div>

              {/* Conversation Section */}
              <div className="card comments-card">
                <div className="card-header border-bottom">
                  <div className="comments-header-title">
                    <MessageSquare size={20} />
                    <h3>Discussion & Support History ({comments.length})</h3>
                  </div>
                </div>

                <div className="card-body">
                  {comments.length === 0 ? (
                    <div className="empty-comments">
                      <p>No messages in this thread yet. Send a response to assist the customer.</p>
                    </div>
                  ) : (
                    <div className="comments-list">
                      {comments.map((c) => {
                        const isAgent = c.user_role === 'agent';
                        return (
                          <div
                            key={c.id}
                            className={`comment-bubble ${isAgent ? 'comment-agent' : 'comment-customer'}`}
                          >
                            <div className="comment-header">
                              <div className="comment-author-info">
                                <span className="comment-author-name">{c.user_name}</span>
                                <span className={`comment-role-tag ${isAgent ? 'tag-agent' : 'tag-customer'}`}>
                                  {isAgent ? (
                                    <>
                                      <ShieldCheck size={12} /> Support Agent
                                    </>
                                  ) : (
                                    <>
                                      <User size={12} /> Customer
                                    </>
                                  )}
                                </span>
                              </div>
                              <span className="comment-time">
                                {new Date(c.created_at).toLocaleString()}
                              </span>
                            </div>
                            <div className="comment-body">
                              <p>{c.comment}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add Agent Comment / Reply */}
                  <div className="add-comment-wrapper mt-4">
                    {commentError && (
                      <div className="alert alert-danger mb-3">
                        <AlertCircle size={16} />
                        <span>{commentError}</span>
                      </div>
                    )}
                    <form onSubmit={handleAddComment}>
                      <div className="form-group">
                        <label htmlFor="agent-response">Send Official Agent Response</label>
                        <textarea
                          id="agent-response"
                          className="form-control textarea"
                          rows={4}
                          placeholder="Type your reply to the customer..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-actions align-right">
                        <button
                          type="submit"
                          disabled={submittingComment || !newComment.trim()}
                          className="btn btn-primary btn-sm btn-icon"
                        >
                          <Send size={14} />
                          <span>{submittingComment ? 'Submitting Reply...' : 'Post Reply'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar: Agent Control Panel */}
            <div className="ticket-sidebar">
              <div className="card agent-control-card">
                <div className="card-header border-bottom">
                  <h4>Management Controls</h4>
                </div>

                {updateMessage && (
                  <div className="alert alert-success my-2">
                    <CheckCircle2 size={16} />
                    <span>{updateMessage}</span>
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger my-2">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateTicket} className="card-body">
                  <div className="form-group">
                    <label htmlFor="agent-status-select">Status</label>
                    <select
                      id="agent-status-select"
                      className="form-control"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="agent-priority-select">Priority</label>
                    <select
                      id="agent-priority-select"
                      className="form-control"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="agent-assignee-select">Assigned Support Agent</label>
                    <select
                      id="agent-assignee-select"
                      className="form-control"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {agents.map((ag) => (
                        <option key={ag.id} value={ag.id}>
                          {ag.name} ({ag.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={savingUpdate}
                    className="btn btn-primary btn-block btn-icon mt-3"
                  >
                    <Save size={16} />
                    <span>{savingUpdate ? 'Saving Changes...' : 'Save Ticket Changes'}</span>
                  </button>
                </form>
              </div>

              {/* Info Snapshot Card */}
              <div className="card meta-card mt-4">
                <div className="card-header border-bottom">
                  <h4>Information Snapshot</h4>
                </div>
                <div className="meta-list">
                  <div className="meta-item">
                    <span className="meta-label">Current Status</span>
                    <StatusBadge status={ticket.status} />
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Current Priority</span>
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Created Date</span>
                    <span className="meta-value">
                      <Clock size={14} /> {new Date(ticket.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentTicketDetails;
