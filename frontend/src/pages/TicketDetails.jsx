import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { ArrowLeft, MessageSquare, Send, Trash2, AlertCircle, Clock, User, ShieldCheck } from 'lucide-react';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');

  const fetchTicketAndComments = async () => {
    try {
      setLoading(true);
      setError('');

      const [ticketRes, commentsRes] = await Promise.all([
        api.get(`/tickets/${id}`),
        api.get(`/tickets/${id}/comments`)
      ]);

      setTicket(ticketRes.data);
      setComments(commentsRes.data);
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      if (err.response && err.response.status === 403) {
        setError('Forbidden: You do not have permission to view this ticket.');
      } else if (err.response && err.response.status === 404) {
        setError('Ticket not found.');
      } else {
        setError('Failed to load ticket details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketAndComments();
  }, [id]);

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
      console.error('Error posting comment:', err);
      setCommentError('Failed to post comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      await api.delete(`/tickets/${id}`);
      navigate('/customer/dashboard');
    } catch (err) {
      console.error('Error deleting ticket:', err);
      alert(err.response?.data?.error || 'Failed to delete ticket');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <div className="container loading-state">
            <div className="spinner"></div>
            <p>Loading ticket details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <div className="container container-sm">
            <Link to="/customer/dashboard" className="back-link">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <div className="alert alert-danger my-4">
              <AlertCircle size={18} />
              <span>{error || 'Ticket not found.'}</span>
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
              <Link to="/customer/dashboard" className="back-link mb-2">
                <ArrowLeft size={16} /> Back to Dashboard
              </Link>
              <div className="ticket-title-row">
                <h1 className="page-title">{ticket.subject}</h1>
                <span className="ticket-id-tag">Ticket #{ticket.id}</span>
              </div>
            </div>

            {ticket.status === 'open' && (
              <button
                onClick={handleDeleteTicket}
                disabled={deleting}
                className="btn btn-danger-outline btn-sm btn-icon"
              >
                <Trash2 size={16} />
                <span>{deleting ? 'Deleting...' : 'Delete Ticket'}</span>
              </button>
            )}
          </div>

          <div className="ticket-details-grid">
            {/* Left Main Section: Details + Comments */}
            <div className="ticket-main-section">
              <div className="card">
                <div className="card-header border-bottom">
                  <h3>Issue Description</h3>
                </div>
                <div className="card-body">
                  <p className="ticket-description-text">{ticket.description}</p>
                </div>
              </div>

              {/* Comments Section */}
              <div className="card comments-card">
                <div className="card-header border-bottom">
                  <div className="comments-header-title">
                    <MessageSquare size={20} />
                    <h3>Discussion & Activity ({comments.length})</h3>
                  </div>
                </div>

                <div className="card-body">
                  {comments.length === 0 ? (
                    <div className="empty-comments">
                      <p>No comments posted yet. Add a message below if you have additional info.</p>
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

                  {/* Add Comment Form */}
                  <div className="add-comment-wrapper mt-4">
                    {commentError && (
                      <div className="alert alert-danger mb-3">
                        <AlertCircle size={16} />
                        <span>{commentError}</span>
                      </div>
                    )}
                    <form onSubmit={handleAddComment}>
                      <div className="form-group">
                        <label htmlFor="customer-comment">Add a response</label>
                        <textarea
                          id="customer-comment"
                          className="form-control textarea"
                          rows={3}
                          placeholder="Type your message here..."
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
                          <span>{submittingComment ? 'Sending...' : 'Post Message'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar Metadata Card */}
            <div className="ticket-sidebar">
              <div className="card meta-card">
                <div className="card-header border-bottom">
                  <h4>Ticket Metadata</h4>
                </div>
                <div className="meta-list">
                  <div className="meta-item">
                    <span className="meta-label">Status</span>
                    <StatusBadge status={ticket.status} />
                  </div>

                  <div className="meta-item">
                    <span className="meta-label">Priority</span>
                    <PriorityBadge priority={ticket.priority} />
                  </div>

                  <div className="meta-item">
                    <span className="meta-label">Created At</span>
                    <span className="meta-value">
                      <Clock size={14} /> {new Date(ticket.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="meta-item">
                    <span className="meta-label">Assigned Agent</span>
                    <span className="meta-value">
                      {ticket.assigned_agent_name ? (
                        <>
                          <ShieldCheck size={14} /> {ticket.assigned_agent_name}
                        </>
                      ) : (
                        <em>Unassigned</em>
                      )}
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

export default TicketDetails;
