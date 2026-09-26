import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';
import './index.css';

const CreateTicket = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!subject.trim() || !description.trim()) {
      setError('Subject and description are required.');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/tickets', {
        subject: subject.trim(),
        description: description.trim(),
        priority
      });
      navigate('/customer/tickets');
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError(err.response?.data?.error || 'Failed to submit ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Top Header */}
        <div className="top-header">
          <div>
            <h1 className="welcome-title">Create a Support Ticket</h1>
            <p className="welcome-subtitle">Provide details about your issue and we'll get back to you.</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="form-card-container">
          <div className="card-wrapper">
            {error && (
              <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group-field">
                <label htmlFor="ticket-subject">
                  Subject <span className="req">*</span>
                </label>
                <input
                  id="ticket-subject"
                  type="text"
                  className="form-input-control"
                  placeholder="Enter ticket subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-field">
                <label htmlFor="ticket-description">
                  Description <span className="req">*</span>
                </label>
                <textarea
                  id="ticket-description"
                  className="form-input-control"
                  rows={6}
                  placeholder="Describe your issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ resize: 'vertical' }}
                  required
                />
              </div>

              <div className="form-group-field">
                <label htmlFor="ticket-priority">Priority</label>
                <select
                  id="ticket-priority"
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="submit" disabled={submitting} className="btn-dark">
                  {submitting ? 'Creating Ticket...' : 'Create Ticket'}
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
