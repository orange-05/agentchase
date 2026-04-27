'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle parallax on hero
    const onScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.backgroundPositionY = `${window.scrollY * 0.4}px`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { font-family: 'Inter', system-ui, sans-serif; background: #000; color: #fff; overflow-x: hidden; }

        .hero-bg {
          background: linear-gradient(135deg, #0f172a 0%, #1e2937 50%, #0f172a 100%);
        }

        .glass {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(12px);
        }

        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 25px 50px -12px rgba(59,130,246,0.4);
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #2563eb;
          color: #fff;
          padding: 18px 40px;
          border-radius: 24px;
          font-size: 1.1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }
        .btn-primary:hover { background: #1d4ed8; transform: scale(1.05); }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          color: #fff;
          padding: 18px 32px;
          border-radius: 24px;
          font-size: 1.1rem;
          font-weight: 500;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.3);
          transition: border-color 0.2s;
        }
        .btn-ghost:hover { border-color: #fff; }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          padding: 10px 24px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.2);
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 32px;
        }

        .dot-green { color: #4ade80; font-size: 0.5rem; }

        .gradient-text {
          background: linear-gradient(to right, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          font-size: 1.25rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #fff;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-link {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 0.9rem;
          padding: 8px 16px;
          border-radius: 12px;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #fff; }

        .nav-cta {
          background: #2563eb;
          color: #fff;
          text-decoration: none;
          padding: 10px 22px;
          border-radius: 14px;
          font-size: 0.9rem;
          font-weight: 600;
          transition: background 0.2s;
        }
        .nav-cta:hover { background: #1d4ed8; }

        section { width: 100%; }

        .container { max-width: 1152px; margin: 0 auto; padding: 0 24px; }

        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding-top: 80px;
        }

        .hero-inner {
          text-align: center;
          padding: 80px 0 64px;
          width: 100%;
        }

        h1.hero-title {
          font-size: clamp(3rem, 8vw, 5rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }

        .hero-sub {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          color: #a1a1aa;
          max-width: 700px;
          margin: 0 auto 48px;
          line-height: 1.7;
        }

        .hero-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
          align-items: center;
          margin-bottom: 48px;
        }

        .hero-perks {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          justify-content: center;
          font-size: 0.875rem;
          color: #71717a;
        }

        .perk {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .perk-check { color: #22c55e; font-weight: 700; }

        .trusted-bar {
          padding: 32px 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          text-align: center;
          color: #71717a;
        }

        .trusted-logos {
          display: flex;
          justify-content: center;
          gap: 48px;
          margin-top: 16px;
          opacity: 0.6;
        }

        .trusted-logos span {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.03em;
        }

        .features-section {
          padding: 96px 0;
          background: #09090b;
        }

        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }

        h2.section-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          margin-bottom: 12px;
        }

        .section-sub {
          color: #71717a;
          font-size: 1rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }

        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 40px;
        }

        .feature-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          margin-bottom: 24px;
        }

        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .feature-card p {
          color: #71717a;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .pricing-section {
          padding: 96px 0;
          background: #000;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
          max-width: 900px;
          margin: 0 auto;
        }

        .pricing-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid #3f3f46;
          border-radius: 24px;
          padding: 40px;
          position: relative;
          overflow: hidden;
        }

        .pricing-card.recommended {
          border: 2px solid #2563eb;
        }

        .recommended-badge {
          position: absolute;
          top: -1px;
          right: 24px;
          background: #2563eb;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 20px;
          border-radius: 0 0 12px 12px;
          letter-spacing: 0.08em;
        }

        .pricing-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .pricing-amount {
          font-size: 3.5rem;
          font-weight: 800;
          margin: 24px 0 0;
          letter-spacing: -0.03em;
        }

        .pricing-period {
          color: #71717a;
          font-size: 0.875rem;
          margin-bottom: 8px;
        }

        .pricing-features {
          list-style: none;
          margin: 32px 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .pricing-features li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.95rem;
        }

        .check-green { color: #22c55e; font-weight: 700; }

        .btn-plan {
          display: block;
          width: 100%;
          text-align: center;
          padding: 18px;
          border-radius: 18px;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }
        .btn-plan.light { background: #fff; color: #000; }
        .btn-plan.light:hover { background: #f4f4f5; transform: scale(1.03); }
        .btn-plan.blue { background: #2563eb; color: #fff; }
        .btn-plan.blue:hover { background: #1d4ed8; transform: scale(1.03); }

        footer {
          padding: 64px 0;
          text-align: center;
          color: #71717a;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-size: 0.95rem;
          line-height: 1.8;
        }

        @media (max-width: 640px) {
          nav { padding: 12px 16px; }
          .hero-inner { padding: 60px 0 48px; }
          .hero-ctas { flex-direction: column; }
          .trusted-logos { gap: 24px; }
        }
      `}</style>

      {/* Navbar */}
      <nav>
        <Link href="/" className="nav-logo">
          🕵️ AgentChase
        </Link>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <Link href="/login" className="nav-cta">Sign In</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-bg hero-section" ref={heroRef as any}>
        <div className="container">
          <div className="hero-inner">
            <div className="badge">
              <span className="dot-green">●</span>
              Built for Indian Freelancers &amp; Solopreneurs
            </div>

            <h1 className="hero-title">
              Never Chase<br />
              <span className="gradient-text">Payments Again</span>
            </h1>

            <p className="hero-sub">
              Your personal AI agent that automatically sends smart reminders,<br />
              tracks payments &amp; helps you get paid faster.
            </p>

            <div className="hero-ctas">
              <Link href="/login" className="btn-primary">
                Start Free Trial →
              </Link>
              <a href="#features" className="btn-ghost">
                See How It Works
              </a>
            </div>

            <div className="hero-perks">
              <div className="perk"><span className="perk-check">✓</span> No Credit Card</div>
              <div className="perk"><span className="perk-check">✓</span> 14 Days Free</div>
              <div className="perk"><span className="perk-check">✓</span> Cancel Anytime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted bar */}
      <div className="trusted-bar">
        <p style={{ fontSize: '0.8rem', marginBottom: '16px' }}>Trusted by freelancers using</p>
        <div className="trusted-logos">
          <span>Payoneer</span>
          <span>UPI</span>
          <span>Google Pay</span>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Your AI Collection Agent</h2>
            <p className="section-sub">Smart. Polite. Relentless.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card card-hover">
              <div className="feature-icon" style={{ background: 'rgba(59,130,246,0.12)' }}>📄</div>
              <h3>Instant Invoice Intelligence</h3>
              <p>Upload PDF or enter details → AI extracts client, amount, due date automatically.</p>
            </div>
            <div className="feature-card card-hover">
              <div className="feature-icon" style={{ background: 'rgba(168,85,247,0.12)' }}>🤖</div>
              <h3>Agentic Follow-ups</h3>
              <p>AI decides tone (polite → firm) and sends personalized reminders at perfect timing.</p>
            </div>
            <div className="feature-card card-hover">
              <div className="feature-icon" style={{ background: 'rgba(34,197,94,0.12)' }}>💰</div>
              <h3>Payoneer & UPI Ready</h3>
              <p>Track payments easily. Withdraw earnings via Payoneer or UPI instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Choose Your Plan</h2>
            <p className="section-sub">Start free. Grow with confidence.</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card card-hover">
              <h3>Pay-Per-Chase</h3>
              <p className="pricing-amount">₹99</p>
              <p className="pricing-period">per successful chase</p>
              <ul className="pricing-features">
                <li><span className="check-green">✓</span> Unlimited Invoices</li>
                <li><span className="check-green">✓</span> AI Reminders</li>
                <li><span className="check-green">✓</span> Payoneer Withdrawal</li>
              </ul>
              <Link href="/login" className="btn-plan light">Get Started Free</Link>
            </div>

            <div className="pricing-card recommended card-hover">
              <div className="recommended-badge">RECOMMENDED</div>
              <h3>Unlimited Agent</h3>
              <p className="pricing-amount">₹499</p>
              <p className="pricing-period">/month</p>
              <ul className="pricing-features">
                <li><span className="check-green">✓</span> Unlimited Chases</li>
                <li><span className="check-green">✓</span> Priority AI Agent</li>
                <li><span className="check-green">✓</span> Payoneer + UPI</li>
                <li><span className="check-green">✓</span> WhatsApp Reminders (Soon)</li>
              </ul>
              <Link href="/login" className="btn-plan blue">Start 14 Days Free Trial</Link>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <p>Made with ❤️ in Bengaluru for Indian creators</p>
        <p>© 2026 AgentChase • Powered by Gemini AI</p>
      </footer>
    </>
  );
}
