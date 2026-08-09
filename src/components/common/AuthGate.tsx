import React, { useState } from 'react';
import {
  Mail, KeyRound, User, ArrowRight, CheckCircle2,
  Eye, EyeOff, TrendingUp, Shield, Zap, PieChart
} from 'lucide-react';
import { Logo } from './Logo';
import { useFinance } from '../../context/FinanceContext';

type AuthView = 'signin' | 'signup' | 'otp-signin' | 'otp-signup';

/**
 * Full-screen authentication gate.
 * Shown whenever user.authMethod === 'guest'.
 * The dashboard is NEVER rendered while this is visible.
 * No X/close button — the user MUST sign in to continue.
 */
export const AuthGate: React.FC = () => {
  const {
    loginWithGoogle, loginWithEmail, signupWithEmail, verifyEmailOtp,
  } = useFinance();

  const [view, setView] = useState<AuthView>('signin');

  // Sign-in state
  const [siEmail, setSiEmail] = useState('');
  const [siPass, setSiPass]   = useState('');
  const [showSiPass, setShowSiPass] = useState(false);

  // Sign-up state
  const [suName, setSuName]         = useState('');
  const [suEmail, setSuEmail]       = useState('');
  const [suPass, setSuPass]         = useState('');
  const [suConfirm, setSuConfirm]   = useState('');
  const [showSuPass, setShowSuPass] = useState(false);

  // OTP state
  const [otpCode, setOtpCode]         = useState('');
  const [otpEmail, setOtpEmail]       = useState('');
  const [mockOtp, setMockOtp]         = useState('');

  // UI state
  const [status, setStatus]     = useState('');
  const [statusT, setStatusT]   = useState<'info' | 'error' | 'success'>('info');
  const [loading, setLoading]   = useState(false);

  const showStatus = (msg: string, t: 'info' | 'error' | 'success' = 'info') => {
    setStatus(msg); setStatusT(t);
  };

  /* ---- handlers ---- */
  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => { loginWithGoogle(); setLoading(false); }, 700);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siEmail || !siPass) return;
    setLoading(true);
    setTimeout(() => {
      const code = loginWithEmail(siEmail);
      setOtpEmail(siEmail); setMockOtp(code);
      setView('otp-signin'); setLoading(false);
      showStatus(`Code sent to ${siEmail}`, 'info');
    }, 600);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suName.trim())       { showStatus('Enter your full name', 'error'); return; }
    if (suPass.length < 6)    { showStatus('Password must be at least 6 characters', 'error'); return; }
    if (suPass !== suConfirm) { showStatus('Passwords do not match', 'error'); return; }
    setLoading(true);
    setTimeout(() => {
      const code = signupWithEmail(suName.trim(), suEmail, suPass);
      setOtpEmail(suEmail); setMockOtp(code);
      setView('otp-signup'); setLoading(false);
      showStatus(`Code sent to ${suEmail}`, 'info');
    }, 600);
  };

  const handleOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) { showStatus('Enter the 6-digit code', 'error'); return; }
    const ok = verifyEmailOtp(otpEmail, otpCode);
    if (ok) {
      showStatus('Verified! Loading your dashboard…', 'success');
      // App.tsx will detect the auth change and render the dashboard
    } else {
      showStatus('Incorrect code. Try again.', 'error');
    }
  };

  /* ---- reusable pieces ---- */
  const inputCls = "w-full bg-[#0D0D10] border border-[#27272A] rounded-xl py-3 text-sm text-white focus:outline-none focus:border-[#6366F1] transition-colors placeholder:text-[#3F3F46]";

  const StatusBar = () => status ? (
    <div className={`px-3.5 py-2.5 rounded-xl text-xs font-medium ${
      statusT === 'error'   ? 'bg-red-500/10 border border-red-500/25 text-red-400' :
      statusT === 'success' ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400' :
                              'bg-indigo-500/10 border border-indigo-500/25 text-indigo-300'
    }`}>{status}</div>
  ) : null;

  const Spinner = () => (
    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
  );

  const GoogleBtn = () => (
    <button type="button" onClick={handleGoogle} disabled={loading}
      className="w-full py-3 px-4 rounded-xl border border-[#3F3F46] bg-[#131316] hover:bg-[#1F1F22] text-white font-semibold text-sm flex items-center justify-center gap-3 transition-all hover:border-[#6366F1]/50 disabled:opacity-50">
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
      </svg>
      <span>Continue with Google</span>
    </button>
  );

  const OrDivider = () => (
    <div className="relative flex items-center justify-center">
      <div className="border-t border-[#1F1F22] w-full" />
      <span className="bg-[#0F0F12] px-3 text-[11px] font-bold text-[#3F3F46] uppercase absolute tracking-widest">or</span>
    </div>
  );

  /* ---- feature bullets for left panel ---- */
  const features = [
    { icon: TrendingUp, color: 'text-[#6366F1]', bg: 'bg-[#6366F1]/10', title: 'Net Worth Tracking', desc: 'Real-time portfolio across all accounts' },
    { icon: PieChart,   color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', title: 'Smart Budgeting',    desc: 'AI-driven budget recommendations' },
    { icon: Zap,        color: 'text-[#4EDEA3]', bg: 'bg-[#4EDEA3]/10', title: 'AI Finance Advisor', desc: 'Gemini-powered wealth insights' },
    { icon: Shield,     color: 'text-[#6366F1]', bg: 'bg-[#6366F1]/10', title: 'Fully Private',      desc: 'Your data stays on your device' },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] flex">

      {/* ── Left panel: branding + features (hidden on mobile) ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 bg-gradient-to-br from-[#0D0D10] to-[#09090B] border-r border-[#18181B] relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#6366F1]/6 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#F59E0B]/5 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <Logo variant="full" size="lg" />
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-white leading-tight">
              Your Personal<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#F59E0B]">
                Wealth OS
              </span>
            </h1>
            <p className="text-sm text-[#908FA0] leading-relaxed max-w-xs">
              Track every rupee, grow every investment, and let AI handle the complexity of your financial life.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {features.map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="flex items-center gap-3.5">
                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{title}</div>
                  <div className="text-xs text-[#504F5E]">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-[#3F3F46]">
          © 2026 Golden Penny · Author: Debraj Bhowmick
        </div>
      </div>

      {/* ── Right panel: auth form ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-0">

          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Logo variant="full" size="lg" />
          </div>

          {/* Card */}
          <div className="bg-[#0F0F12] border border-[#1F1F22] rounded-2xl overflow-hidden shadow-2xl">

            {/* Tab bar */}
            {view !== 'otp-signin' && view !== 'otp-signup' && (
              <div className="flex border-b border-[#1F1F22]">
                {(['signin', 'signup'] as AuthView[]).map(v => (
                  <button key={v} onClick={() => { setView(v); setStatus(''); }}
                    className={`flex-1 py-4 text-sm font-semibold transition-all ${
                      view === v
                        ? 'text-white border-b-2 border-[#6366F1] bg-[#131316]'
                        : 'text-[#504F5E] hover:text-[#908FA0] border-b-2 border-transparent'
                    }`}>
                    {v === 'signin' ? 'Sign In' : 'Create Account'}
                  </button>
                ))}
              </div>
            )}

            <div className="p-7 space-y-5">
              <StatusBar />

              {/* ── SIGN IN ── */}
              {view === 'signin' && (
                <>
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-white">Welcome back</h2>
                    <p className="text-xs text-[#504F5E]">Sign in to access your financial dashboard</p>
                  </div>
                  <GoogleBtn />
                  <OrDivider />
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-[#908FA0] block mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3F3F46]" />
                        <input type="email" required autoComplete="email"
                          value={siEmail} onChange={e => setSiEmail(e.target.value)}
                          className={`${inputCls} pl-10 pr-4`} placeholder="you@example.com" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#908FA0] block mb-1.5">Password</label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3F3F46]" />
                        <input type={showSiPass ? 'text' : 'password'} required autoComplete="current-password"
                          value={siPass} onChange={e => setSiPass(e.target.value)}
                          className={`${inputCls} pl-10 pr-10`} placeholder="Your password" />
                        <button type="button" onClick={() => setShowSiPass(p => !p)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3F3F46] hover:text-[#908FA0] transition-colors">
                          {showSiPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-[#6366F1] to-[#5254CC] text-white font-bold text-sm rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
                      {loading ? <Spinner /> : null}
                      <span>Send Verification Code</span>
                      {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </form>
                  <p className="text-center text-xs text-[#3F3F46]">
                    No account?{' '}
                    <button onClick={() => { setView('signup'); setStatus(''); }}
                      className="text-[#6366F1] hover:underline font-semibold">Create one free</button>
                  </p>
                </>
              )}

              {/* ── CREATE ACCOUNT ── */}
              {view === 'signup' && (
                <>
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-white">Create your account</h2>
                    <p className="text-xs text-[#504F5E]">Start managing your wealth in minutes</p>
                  </div>
                  <GoogleBtn />
                  <OrDivider />
                  <form onSubmit={handleSignUp} className="space-y-3.5">
                    <div>
                      <label className="text-xs font-medium text-[#908FA0] block mb-1.5">Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3F3F46]" />
                        <input type="text" required autoComplete="name"
                          value={suName} onChange={e => setSuName(e.target.value)}
                          className={`${inputCls} pl-10 pr-4`} placeholder="Your full name" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#908FA0] block mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3F3F46]" />
                        <input type="email" required autoComplete="email"
                          value={suEmail} onChange={e => setSuEmail(e.target.value)}
                          className={`${inputCls} pl-10 pr-4`} placeholder="you@example.com" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#908FA0] block mb-1.5">Password</label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3F3F46]" />
                        <input type={showSuPass ? 'text' : 'password'} required autoComplete="new-password"
                          value={suPass} onChange={e => setSuPass(e.target.value)}
                          className={`${inputCls} pl-10 pr-10`} placeholder="Min 6 characters" />
                        <button type="button" onClick={() => setShowSuPass(p => !p)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3F3F46] hover:text-[#908FA0] transition-colors">
                          {showSuPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#908FA0] block mb-1.5">Confirm Password</label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3F3F46]" />
                        <input type="password" required autoComplete="new-password"
                          value={suConfirm} onChange={e => setSuConfirm(e.target.value)}
                          className={`${inputCls} pl-10 pr-4`} placeholder="Repeat password" />
                      </div>
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-[#6366F1] to-[#5254CC] text-white font-bold text-sm rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-1">
                      {loading ? <Spinner /> : null}
                      <span>Create Account</span>
                      {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </form>
                  <p className="text-center text-xs text-[#3F3F46]">
                    Have an account?{' '}
                    <button onClick={() => { setView('signin'); setStatus(''); }}
                      className="text-[#6366F1] hover:underline font-semibold">Sign in</button>
                  </p>
                </>
              )}

              {/* ── OTP VERIFICATION ── */}
              {(view === 'otp-signin' || view === 'otp-signup') && (
                <form onSubmit={handleOtp} className="space-y-6">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-[#6366F1]/10 border border-[#6366F1]/25 rounded-full flex items-center justify-center mx-auto">
                      <Mail className="w-8 h-8 text-[#6366F1]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Check your inbox</h2>
                      <p className="text-xs text-[#504F5E] mt-1 leading-relaxed">
                        We sent a 6-digit code to<br />
                        <strong className="text-[#908FA0]">{otpEmail}</strong>
                      </p>
                    </div>
                  </div>

                  {mockOtp && (
                    <div className="p-4 bg-[#F59E0B]/5 border border-[#F59E0B]/15 rounded-xl text-center">
                      <div className="text-[10px] text-[#504F5E] uppercase tracking-wider mb-2">Demo mode — use this code</div>
                      <div className="text-[#F59E0B] font-mono font-black text-3xl tracking-[0.4em]">{mockOtp}</div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-medium text-[#908FA0] block mb-1.5 text-center">6-digit verification code</label>
                    <input type="text" inputMode="numeric" maxLength={6} required autoFocus
                      value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-[#0D0D10] border border-[#27272A] rounded-xl px-4 py-4 text-center text-2xl font-mono tracking-[0.6em] text-[#F59E0B] focus:outline-none focus:border-[#F59E0B] transition-colors placeholder:text-[#1F1F22]"
                      placeholder="000000" />
                  </div>

                  <div className="flex gap-2.5">
                    <button type="button"
                      onClick={() => { setView(view === 'otp-signin' ? 'signin' : 'signup'); setStatus(''); setOtpCode(''); }}
                      className="w-1/3 py-3 bg-[#131316] border border-[#27272A] text-[#908FA0] font-semibold text-xs rounded-xl hover:bg-[#1F1F22] transition-colors">
                      ← Back
                    </button>
                    <button type="submit"
                      className="w-2/3 py-3 bg-gradient-to-r from-[#4EDEA3] to-[#34C48A] text-black font-bold text-sm rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify &amp; {view === 'otp-signup' ? 'Create Account' : 'Sign In'}</span>
                    </button>
                  </div>

                  <p className="text-center text-xs text-[#3F3F46]">
                    Didn't get a code?{' '}
                    <button type="button" onClick={() => showStatus('New code sent.', 'info')}
                      className="text-[#6366F1] hover:underline">Resend</button>
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Privacy note */}
          <p className="text-center text-[10px] text-[#2A2A2E] mt-5 px-4">
            Golden Penny stores all data locally in your browser. No personal data is shared with any third party.
          </p>
        </div>
      </div>
    </div>
  );
};
