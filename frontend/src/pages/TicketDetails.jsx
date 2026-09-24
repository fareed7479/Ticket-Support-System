import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MessageSquare, AlertCircle } from 'lucide-react';

const TicketDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const [tRes, cRes] = await Promise.all([
        api.get(`/tickets/${id}`),
        api.get(`/tickets/${id}/comments`)
      ]);

      setTicket(tRes.data);
      setComments(cRes.data);
    } catch (err) {
      console.error('Error loading ticket:', err);
      setError(err.response?.data?.error || 'Failed to load ticket.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      setCommentError('');

      const res = await api.post(`/tickets/${id}/comments`, { comment: newComment.trim() });
      setComments((prev) => [...prev, res.data.comment]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
      setCommentError('Failed to post comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading ticket details...</div>
        </main>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <Link to="/customer/tickets" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to My Tickets
          </Link>
          <div className="alert alert-danger">
            <AlertCircle size={16} />
            <span>{error || 'Ticket not found.'}</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Back Link matching Mockup #7 */}
        <Link to="/customer/tickets" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to My Tickets
        </Link>

        {/* Top Header info matching Mockup #7 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#64748b', fontSize: '0.9rem' }}>#{ticket.id}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
            <h1 className="welcome-title">{ticket.subject}</h1>
            <span className={`badge-pill badge-${ticket.status === 'closed' ? 'resolved' : ticket.status}`}>
              {ticket.status === 'closed' ? 'Resolved' : ticket.status === 'in_progress' ? 'In Progress' : 'Open'}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.35rem' }}>
            Created by you • {new Date(ticket.created_at).toLocaleString()}
          </p>
        </div>

        {/* Issue Description Card matching Mockup #7 */}
        <div className="card-wrapper">
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Description</h3>
          <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: 1.6, whitespace: 'pre-wrap' }}>
            {ticket.description}
          </p>
        </div>

        {/* Comments Section matching Mockup #7 */}
        <div className="card-wrapper">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
            Comments ({comments.length})
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

          {/* Add Comment Input Form */}
          <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
            {commentError && (
              <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
                <AlertCircle size={16} />
                <span>{commentError}</span>
              </div>
            )}
            <form onSubmit={handleAddComment}>
              <textarea
                className="form-input-control"
                rows={3}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ marginBottom: '1rem', resize: 'vertical' }}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={submittingComment || !newComment.trim()} className="btn-dark">
                  {submittingComment ? 'Posting...' : 'Comment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketDetails;
