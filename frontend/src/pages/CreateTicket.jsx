import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { ArrowLeft, Send, AlertCircle, HelpCircle } from 'lucide-react';

const CreateTicket = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!subject.trim()) {
      setError('Please provide a subject for your ticket');
      return;
    }

    if (!description.trim()) {
      setError('Please provide detailed description of the issue');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/tickets', {
        subject: subject.trim(),
        description: description.trim(),
        priority
      });

      navigate('/customer/dashboard');
    } catch (err) {
      console.error('Error creating ticket:', err);
      const msg = err.response?.data?.error || 'Failed to submit support ticket';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="container container-sm">
          <Link to="/customer/dashboard" className="back-link">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          <div className="card form-card">
            <div className="card-header">
              <h2 className="card-title">Create New Support Ticket</h2>
              <p className="card-subtitle">
                Describe the problem you are experiencing. Our support team will respond shortly.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger mb-4">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="ticket-subject">Subject</label>
                <input
                  id="ticket-subject"
                  type="text"
                  className="form-control"
                  placeholder="Brief summary of the issue..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="ticket-priority">Priority Level</label>
                <select
                  id="ticket-priority"
                  className="form-control"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low - General inquiry or feature request</option>
                  <option value="medium">Medium - System issue affecting workflow</option>
                  <option value="high">High - Critical system blocking issue</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="ticket-description">Detailed Description</label>
                <textarea
                  id="ticket-description"
                  className="form-control textarea"
                  rows={6}
                  placeholder="Please provide steps to reproduce, error messages, or context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-actions">
                <Link to="/customer/dashboard" className="btn btn-secondary">
                  Cancel
                </Link>
                <button type="submit" disabled={submitting} className="btn btn-primary btn-icon">
                  <Send size={16} />
                  <span>{submitting ? 'Submitting...' : 'Submit Ticket'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateTicket;
