import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [roleTab, setRoleTab] = useState('customer'); // 'customer' or 'agent'
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setRoleTab(role);
    if (role === 'agent') {
      setEmail('admin.agent@support.com');
      setPassword('password123');
    } else {
      setEmail('john@example.com');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setSubmitting(true);
      const user = await login(email, password);
      if (user.role === 'agent') {
        navigate('/agent/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="split-auth-container">
      {/* Left Dark Branding Panel */}
      <div className="split-left-panel">
        <div>
          <div className="sidebar-header" style={{ padding: 0, marginBottom: '4rem' }}>
            <div className="sidebar-logo-icon">
              <HelpCircle size={22} />
            </div>
            <span className="sidebar-brand-name">HelpDesk</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2 }}>
            Welcome back
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '1rem' }}>
            Sign in to your account to continue
          </p>
        </div>

        <div style={{ color: '#64748b', fontSize: '0.875rem', fontStyle: 'italic' }}>
          Good support builds stronger relationships.
        </div>
      </div>

      {/* Right Form Card Panel */}
      <div className="split-right-panel">
        <div className="auth-form-card">
          {/* Customer / Agent Role Tab Toggle */}
          <div className="role-tab-selector">
            <button
              type="button"
              className={`role-tab-btn ${roleTab === 'customer' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('customer')}
            >
              Customer
            </button>
            <button
              type="button"
              className={`role-tab-btn ${roleTab === 'agent' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('agent')}
            >
              Admin / Agent
            </button>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Login</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
            Enter your email and password
          </p>

          {/* Quick Demo Credentials Info Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 0.85rem',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '0.775rem',
            color: '#475569',
            marginBottom: '1.5rem'
          }}>
            <ShieldCheck size={16} color="#16a34a" />
            <span>
              Pre-filled {roleTab === 'agent' ? 'Agent / Admin' : 'Customer'} demo credentials ready for 1-click login!
            </span>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group-field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                className="form-input-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group-field">
              <label htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input-control"
                  placeholder="Enter your password"
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 1.5rem', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#475569' }}>
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <a href="#" style={{ color: '#0284c7', fontWeight: 600 }}>Forgot password?</a>
            </div>

            <button type="submit" disabled={submitting} className="btn-dark" style={{ width: '100%' }}>
              {submitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#0284c7', fontWeight: 700 }}>
              Register Customer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
