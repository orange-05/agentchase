'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Check, Crown, Zap, Shield, ArrowRight, Loader2 } from 'lucide-react';

type Plan = 'pay_per_chase' | 'unlimited';

export default function PaymentPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login');
        return;
      }
      setUser(user);

      // Check if user already has an active subscription
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (sub) {
        router.replace('/dashboard');
        return;
      }

      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const handlePayoneerPayment = async (plan: Plan) => {
    if (!user) return;
    setSelectedPlan(plan);
    setProcessing(true);

    const amount = plan === 'pay_per_chase' ? 99 : 499;

    try {
      const res = await fetch('/api/payoneer/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          amount,
          userId: user.id,
          email: user.email,
        }),
      });
      const data = await res.json();

      if (data.success) {
        showToast('✅ Subscription activated! Redirecting to dashboard...', true);
        setTimeout(() => router.replace('/dashboard'), 1500);
      } else {
        showToast('❌ ' + (data.error || 'Payment failed. Please try again.'), false);
      }
    } catch {
      showToast('❌ Network error. Please check your connection.', false);
    } finally {
      setProcessing(false);
      setSelectedPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🕵️</div>
          <p className="text-zinc-400">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.15); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.3); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(300px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(300px) rotate(-360deg); }
        }

        .payment-page {
          min-height: 100vh;
          background: #000;
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .payment-page::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 30% 20%, rgba(59,130,246,0.06) 0%, transparent 50%),
                      radial-gradient(circle at 70% 80%, rgba(168,85,247,0.04) 0%, transparent 50%);
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.4;
        }

        .orb-1 {
          width: 400px; height: 400px;
          background: rgba(59, 130, 246, 0.15);
          top: -100px; right: -100px;
          animation: float 8s ease-in-out infinite;
        }

        .orb-2 {
          width: 300px; height: 300px;
          background: rgba(168, 85, 247, 0.12);
          bottom: -50px; left: -50px;
          animation: float 10s ease-in-out infinite 2s;
        }

        .payment-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 24px;
          position: relative;
          z-index: 1;
        }

        .payment-header {
          text-align: center;
          margin-bottom: 60px;
          animation: slide-up 0.6s ease-out;
        }

        .payment-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.2);
          padding: 8px 20px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 500;
          color: #93c5fd;
          margin-bottom: 24px;
        }

        .payment-title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800;
          margin-bottom: 16px;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .payment-subtitle {
          font-size: 1.1rem;
          color: #71717a;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          animation: slide-up 0.8s ease-out 0.1s backwards;
        }

        @media (max-width: 700px) {
          .plans-grid { grid-template-columns: 1fr; }
        }

        .plan-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 40px 36px;
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: default;
        }

        .plan-card:hover {
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-6px);
          box-shadow: 0 20px 60px -12px rgba(0,0,0,0.6);
        }

        .plan-card.recommended {
          border: 2px solid rgba(59,130,246,0.5);
          background: rgba(59,130,246,0.04);
          animation: glow-pulse 3s ease-in-out infinite;
        }

        .plan-card.recommended:hover {
          border-color: rgba(59,130,246,0.7);
        }

        .recommended-tag {
          position: absolute;
          top: -1px;
          right: 28px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 5px 18px;
          border-radius: 0 0 14px 14px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .plan-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .plan-name {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .plan-desc {
          font-size: 0.85rem;
          color: #71717a;
          margin-bottom: 24px;
        }

        .plan-price {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .plan-currency {
          font-size: 1.5rem;
          font-weight: 600;
          vertical-align: super;
          margin-right: 4px;
          color: #a1a1aa;
        }

        .plan-period {
          font-size: 0.85rem;
          color: #71717a;
          margin-top: 4px;
          margin-bottom: 28px;
        }

        .plan-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 32px;
        }

        .plan-features li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;
          color: #d4d4d8;
        }

        .plan-features .check-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          background: rgba(34,197,94,0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #22c55e;
        }

        .payoneer-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 18px 24px;
          border-radius: 18px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .payoneer-btn.primary {
          background: linear-gradient(135deg, #ff6c00, #ff4500);
          color: #fff;
        }

        .payoneer-btn.primary:hover {
          transform: scale(1.03);
          box-shadow: 0 8px 30px rgba(255,108,0,0.35);
        }

        .payoneer-btn.secondary {
          background: rgba(255,108,0,0.1);
          border: 1px solid rgba(255,108,0,0.3);
          color: #ff6c00;
        }

        .payoneer-btn.secondary:hover {
          background: rgba(255,108,0,0.15);
          border-color: rgba(255,108,0,0.5);
        }

        .payoneer-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .payoneer-logo {
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .security-bar {
          text-align: center;
          margin-top: 48px;
          animation: slide-up 1s ease-out 0.2s backwards;
        }

        .security-items {
          display: flex;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        .security-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: #71717a;
        }

        .security-icon {
          color: #3b82f6;
        }

        .skip-link {
          display: block;
          text-align: center;
          margin-top: 32px;
          font-size: 0.85rem;
          color: #52525b;
          cursor: pointer;
          transition: color 0.2s;
          text-decoration: underline;
          text-underline-offset: 3px;
          background: none;
          border: none;
        }

        .skip-link:hover {
          color: #a1a1aa;
        }

        .toast-payment {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          border-radius: 16px;
          font-size: 0.9rem;
          font-weight: 500;
          max-width: 500px;
          width: calc(100% - 48px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: slide-up 0.3s ease-out;
        }

        .toast-payment.ok {
          background: #052e16;
          border: 1px solid #166534;
          color: #86efac;
        }

        .toast-payment.err {
          background: #450a0a;
          border: 1px solid #991b1b;
          color: #fca5a5;
        }

        .user-greeting {
          text-align: center;
          margin-bottom: 12px;
          font-size: 0.9rem;
          color: #52525b;
        }

        .user-email {
          color: #a1a1aa;
          font-weight: 500;
        }
      `}</style>

      <div className="payment-page">
        {/* Ambient orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Toast */}
        {toast && (
          <div className={`toast-payment ${toast.ok ? 'ok' : 'err'}`}>
            <span>{toast.msg}</span>
          </div>
        )}

        <div className="payment-container">
          {/* Header */}
          <div className="payment-header">
            <div className="payment-badge">
              <Crown size={14} />
              Choose Your Plan
            </div>

            {user?.email && (
              <p className="user-greeting">
                Welcome back, <span className="user-email">{user.email}</span>
              </p>
            )}

            <h1 className="payment-title">
              Unlock Your AI<br />
              <span style={{
                background: 'linear-gradient(135deg, #ff6c00, #f97316, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Collection Agent
              </span>
            </h1>
            <p className="payment-subtitle">
              Start chasing payments automatically. Pick a plan and pay securely with Payoneer.
            </p>
          </div>

          {/* Plans */}
          <div className="plans-grid">
            {/* Plan 1: Pay Per Chase */}
            <div className="plan-card">
              <div className="plan-icon" style={{ background: 'rgba(249,115,22,0.1)' }}>
                <Zap size={28} color="#f97316" />
              </div>
              <h3 className="plan-name">Pay-Per-Chase</h3>
              <p className="plan-desc">Perfect for getting started</p>
              <p className="plan-price">
                <span className="plan-currency">₹</span>99
              </p>
              <p className="plan-period">per successful chase</p>

              <ul className="plan-features">
                <li>
                  <span className="check-icon"><Check size={12} /></span>
                  Unlimited Invoices
                </li>
                <li>
                  <span className="check-icon"><Check size={12} /></span>
                  AI-Powered Reminders
                </li>
                <li>
                  <span className="check-icon"><Check size={12} /></span>
                  Invoice Intelligence
                </li>
                <li>
                  <span className="check-icon"><Check size={12} /></span>
                  Payoneer Withdrawal
                </li>
              </ul>

              <button
                className="payoneer-btn secondary"
                onClick={() => handlePayoneerPayment('pay_per_chase')}
                disabled={processing}
                id="btn-pay-per-chase"
              >
                {processing && selectedPlan === 'pay_per_chase' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="payoneer-logo">Payoneer</span>
                    Pay ₹99
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {/* Plan 2: Unlimited Agent */}
            <div className="plan-card recommended">
              <div className="recommended-tag">Recommended</div>
              <div className="plan-icon" style={{ background: 'rgba(59,130,246,0.1)' }}>
                <Crown size={28} color="#3b82f6" />
              </div>
              <h3 className="plan-name">Unlimited Agent</h3>
              <p className="plan-desc">For serious freelancers</p>
              <p className="plan-price">
                <span className="plan-currency">₹</span>499
              </p>
              <p className="plan-period">per month</p>

              <ul className="plan-features">
                <li>
                  <span className="check-icon"><Check size={12} /></span>
                  Unlimited Chases
                </li>
                <li>
                  <span className="check-icon"><Check size={12} /></span>
                  Priority AI Agent
                </li>
                <li>
                  <span className="check-icon"><Check size={12} /></span>
                  Advanced Analytics
                </li>
                <li>
                  <span className="check-icon"><Check size={12} /></span>
                  WhatsApp Reminders (Soon)
                </li>
                <li>
                  <span className="check-icon"><Check size={12} /></span>
                  Premium Support
                </li>
              </ul>

              <button
                className="payoneer-btn primary"
                onClick={() => handlePayoneerPayment('unlimited')}
                disabled={processing}
                id="btn-unlimited"
              >
                {processing && selectedPlan === 'unlimited' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="payoneer-logo">Payoneer</span>
                    Pay ₹499/mo
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Security bar */}
          <div className="security-bar">
            <div className="security-items">
              <div className="security-item">
                <Shield size={14} className="security-icon" />
                Secure Payment
              </div>
              <div className="security-item">
                <Shield size={14} className="security-icon" />
                Cancel Anytime
              </div>
              <div className="security-item">
                <Shield size={14} className="security-icon" />
                Money-Back Guarantee
              </div>
            </div>
          </div>

          {/* Skip for now (free trial) */}
          <button
            className="skip-link"
            onClick={async () => {
              if (!user) return;
              // Activate a 14-day free trial
              await supabase.from('subscriptions').insert({
                user_id: user.id,
                plan: 'trial',
                status: 'active',
                payment_method: 'trial',
                amount: 0,
                expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              });
              router.replace('/dashboard');
            }}
          >
            Start 14-day free trial instead →
          </button>
        </div>
      </div>
    </>
  );
}
