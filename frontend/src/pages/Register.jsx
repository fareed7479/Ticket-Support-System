import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import abstractBgImg from '../assets/auth_abstract_bg.jpg';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setSubmitting(true);
      await register(name.trim(), email.trim(), password);
      setSuccess('Customer account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="split-right-panel" style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Abstract Green Blob Graphic Background */}
      <img
        src={abstractBgImg}
        alt="Abstract background graphic"
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '550px',
          opacity: 0.35,
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      <div className="auth-form-card" style={{ maxWidth: '460px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
          <div className="sidebar-logo-icon" style={{ background: '#0b1329', color: '#ffffff' }}>
            <HelpCircle size={20} />
          </div>
          <span className="sidebar-brand-name" style={{ color: '#0b1329' }}>HelpDesk</span>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.25rem' }}>
          Create Customer Account
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', textAlign: 'center', marginBottom: '1.25rem' }}>
          Register as a customer to submit and track support tickets.
        </p>

        {/* Pre-defined Agent Notice matching user requirement */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 0.85rem',
          background: '#f1f5f9',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          fontSize: '0.775rem',
          color: '#475569',
          marginBottom: '1.5rem'
        }}>
          <ShieldAlert size={16} color="#0284c7" />
          <span>Note: Support Agents are pre-configured system accounts.</span>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group-field">
            <label htmlFor="reg-name">Full name</label>
            <input
              id="reg-name"
              type="text"
              className="form-input-control"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group-field">
            <label htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
              type="email"
              className="form-input-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group-field">
            <label htmlFor="reg-pass">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-pass"
                type={showPassword ? 'text' : 'password'}
                className="form-input-control"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-dark" style={{ width: '100%', marginTop: '1rem' }}>
            {submitting ? 'Registering Customer Account...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#0284c7', fontWeight: 700 }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
