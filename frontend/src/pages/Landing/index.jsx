import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowRight, Zap, LineChart, ShieldCheck, Ticket } from 'lucide-react';
import heroBannerImg from '../../assets/landing_hero_banner.jpg';
import './index.css';

const Landing = () => {
  return (
    <div className="landing-page-container" style={{ background: '#ffffff', minHeight: '100vh' }}>
      {/* Top Navbar */}
      <nav className="landing-navbar">
        <div className="sidebar-header" style={{ padding: 0 }}>
          <div className="sidebar-logo-icon" style={{ background: '#ffffff', color: '#0f172a' }}>
            <HelpCircle size={20} />
          </div>
          <span className="sidebar-brand-name" style={{ color: '#ffffff' }}>HelpDesk</span>
        </div>

        <div className="landing-nav-links" style={{ display: 'flex', gap: '2.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
          <Link to="/" style={{ color: '#ffffff', fontWeight: 700 }}>Home</Link>
          <a href="#features" style={{ color: '#cbd5e1' }}>Features</a>
          <a href="#about" style={{ color: '#cbd5e1' }}>About</a>
        </div>

        <div className="landing-auth-buttons" style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" className="btn-dark" style={{ background: 'transparent', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
            Login
          </Link>
          <Link to="/register" className="btn-dark" style={{ background: '#ffffff', color: '#0f172a', border: '1px solid #ffffff' }}>
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero-section">
        <div className="hero-content">
          <h1 className="landing-headline">
            Better Support<br />for a Smoother<br />Tomorrow
          </h1>
          <p className="landing-subtext">
            Create, track and resolve support tickets with ease. Fast, simple and efficient.
          </p>

          <Link to="/register" className="btn-dark" style={{ padding: '0.9rem 2.25rem', fontSize: '1rem', borderRadius: '4px' }}>
            <span>Get Started</span>
            <ArrowRight size={18} />
          </Link>

          {/* Bottom Highlight Badges */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={18} color="#0f172a" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem' }}>Fast Resolution</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Get help quickly</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LineChart size={18} color="#0f172a" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem' }}>Track Progress</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Stay informed</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} color="#0f172a" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem' }}>Trusted Platform</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Secure & Reliable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Hero Banner Graphic */}
        <div className="hero-illustration" style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            border: '1px solid #cbd5e1',
            position: 'relative'
          }}>
            <img 
              src={heroBannerImg} 
              alt="HelpDesk System Illustration" 
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }} 
            />

            {/* Floated Ticket Tag Overlay */}
            <div style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: '#ffffff',
              padding: '0.85rem 1.25rem',
              borderRadius: '6px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              border: '1px solid #cbd5e1'
            }}>
              <Ticket size={22} color="#0f172a" />
              <div style={{ textAlign: 'left' }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: '#0f172a' }}>New Ticket</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>#4827</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
