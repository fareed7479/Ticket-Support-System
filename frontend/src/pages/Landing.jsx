import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowRight, Zap, LineChart, ShieldCheck, Ticket } from 'lucide-react';
import heroBannerImg from '../assets/landing_hero_banner.jpg';

const Landing = () => {
  return (
    <div className="landing-page-container" style={{ background: '#ffffff', minHeight: '100vh' }}>
      {/* Top Navbar matching Mockup #1 */}
      <nav className="landing-navbar">
        <div className="sidebar-header" style={{ padding: 0 }}>
          <div className="sidebar-logo-icon" style={{ background: '#0b1329', color: '#fff' }}>
            <HelpCircle size={20} />
          </div>
          <span className="sidebar-brand-name" style={{ color: '#0b1329' }}>HelpDesk</span>
        </div>

        <div className="landing-nav-links" style={{ display: 'flex', gap: '2.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
          <Link to="/" style={{ color: '#0b1329', fontWeight: 700 }}>Home</Link>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <div className="landing-auth-buttons" style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" className="btn-dark" style={{ background: 'transparent', color: '#0b1329', border: '1px solid #cbd5e1' }}>
            Login
          </Link>
          <Link to="/register" className="btn-dark">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section matching Mockup #1 */}
      <section className="landing-hero-section">
        <div className="hero-content">
          <h1 className="landing-headline">
            Better Support<br />for a Smoother<br />Tomorrow
          </h1>
          <p className="landing-subtext">
            Create, track and resolve support tickets with ease. Fast, simple and efficient.
          </p>

          <Link to="/register" className="btn-dark" style={{ padding: '0.9rem 2.25rem', fontSize: '1rem', borderRadius: '9999px' }}>
            <span>Get Started</span>
            <ArrowRight size={18} />
          </Link>

          {/* Bottom Highlight Badges matching Mockup #1 */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={18} color="#16a34a" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem' }}>Fast Resolution</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Get help quickly</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LineChart size={18} color="#0284c7" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem' }}>Track Progress</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Stay informed</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} color="#7e22ce" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem' }}>Trusted Platform</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Secure & Reliable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Hero Banner Graphic matching Mockup #1 */}
        <div className="hero-illustration" style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            position: 'relative'
          }}>
            <img 
              src={heroBannerImg} 
              alt="HelpDesk System Illustration" 
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '24px' }} 
            />

            {/* Floated Ticket Tag Overlay matching Mockup #1 */}
            <div style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: '#ffffff',
              padding: '0.85rem 1.25rem',
              borderRadius: '14px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              border: '1px solid #e2e8f0'
            }}>
              <Ticket size={22} color="#16a34a" />
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
