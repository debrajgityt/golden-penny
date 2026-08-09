import React, { useState, useEffect } from 'react';
import {
  X, Mail, KeyRound, User, ArrowRight, CheckCircle2,
  Eye, EyeOff, LogOut, ShieldCheck
} from 'lucide-react';
import { Logo } from './Logo';
import { useFinance } from '../../context/FinanceContext';

type AuthView = 'signin' | 'signup' | 'otp-signin' | 'otp-signup';

export const AuthModal: React.FC = () => {
  const {
    user, loginWithGoogle, loginWithEmail, signupWithEmail,
    verifyEmailOtp, logout, isAuthModalOpen, setIsAuthModalOpen,
  } = useFinance();

  const isLoggedIn = user.authMethod !== 'guest';

  const [view, setView] = useState<AuthView>('signin');

  // Sign In state
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [showSigninPass, setShowSigninPass] = useState(false);

  // Sign Up state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPass, setSignupConfirmPass] = useState('');
  const [showSignupPass, setShowSignupPass] = useState(false);

  // OTP state
  const [otpCode, setOtpCode] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [mockOtpCode, setMockOtpCode] = useState('');

  // Status
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState<'info' | 'error' | 'success'>('info');
  const [isLoading, setIsLoading] = useState(false);

  // When user logs out → reset to sign-in view
  useEffect(() => {
    if (user.authMethod === 'guest') {
      setView('signin');
      setStatusMsg('');
      setOtpCode('');
      setSigninEmail('');
      setSigninPassword('');
    }
  }, [user.authMethod]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setStatusMsg('');
  };

  const showStatus = (msg: string, type: 'info' | 'error' | 'success' = 'info') => {
    setStatusMsg(msg);
    setStatusType(type);
  };

  /* ---- handlers ---- */

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogle();
      setIsLoading(false);
      showStatus('Signed in successfully via Google!', 'success');
      setTimeout(handleClose, 900);
    }, 700);
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signinEmail || !signinPassword) return;
    setIsLoading(true);
    setTimeout(() => {
      const code = loginWithEmail(signinEmail);
      setOtpEmail(signinEmail);
      setMockOtpCode(code);
      setView('otp-signin');
      setIsLoading(false);
      showStatus(`Verification code sent to ${signinEmail}`, 'info');
    }, 600);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim()) { showStatus('Please enter your full name', 'error'); return; }
    if (!signupEmail) { showStatus('Please enter your email', 'error'); return; }
    if (signupPassword.length < 6) { showStatus('Password must be at least 6 characters', 'error'); return; }
    if (signupPassword !== signupConfirmPass) { showStatus('Passwords do not match', 'error'); return; }
    setIsLoading(true);
    setTimeout(() => {
      const code = signupWithEmail(signupName.trim(), signupEmail, signupPassword);
      setOtpEmail(signupEmail);
      setMockOtpCode(code);
      setView('otp-signup');
      setIsLoading(false);
      showStatus(`Verification code sent to ${signupEmail}`, 'info');
    }, 600);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) { showStatus('Please enter the 6-digit code', 'error'); return; }
    const success = verifyEmailOtp(otpEmail, otpCode);
    if (success) {
      showStatus(view === 'otp-signup' ? 'Account created! Welcome to Golden Penny 🎉' : 'Signed in successfully!', 'success');
      setTimeout(handleClose, 1000);
    } else {
      showStatus('Invalid code. Please try again.', 'error');
    }
  };

  const handleLogout = () => {
    logout(); // this also sets isAuthModalOpen(true) in context
  };

  /* ---- sub-components ---- */

  const StatusBar = () =>
    statusMsg ? (
      <div className={`px-3 py-2.5 rounded-xl text-xs font-medium ${
        statusType === 'error'   ? 'bg-red-500/10 border border-red-500/30 text-red-400' :
        statusType === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' :
                                   'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300'
      }`}>
        {statusMsg}
      </div>
    ) : null;

  const GoogleBtn = () => (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full py-3 px-4 rounded-xl border border-[#3F3F46] bg-[#1F1F22] hover:bg-[#27272A] text-white font-semibold text-sm flex items-center justify-center gap-3 transition-all hover:border-[#6366F1]/60 disabled:opacity-50 group"
    >
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
    <div className="relative flex items-center justify-center my-1">
      <div className="border-t border-[#27272A] w-full" />
      <span className="bg-[#18181B] px-3 text-[11px] font-bold text-[#504F5E] uppercase absolute tracking-widest">
        or
      </span>
    </div>
  );

  const inputClass = "w-full bg-[#131316] border border-[#27272A] rounded-xl py-2.5 text-sm text-white focus:outline-none focus:border-[#6366F1] transition-colors placeholder:text-[#504F5E]";
  const Spinner = () => <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />;

  /* ================================================
     LOGGED-IN VIEW
  ================================================ */
  if (isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-[#27272A] flex items-center justify-between bg-[#131316]">
            <Logo variant="full" size="md" />
            <button onClick={handleClose} className="p-1.5 text-[#908FA0] hover:text-white rounded-lg hover:bg-[#27272A] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Profile card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1F1F22] to-[#131316] border border-[#27272A] flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-[#27272A] border-2 border-[#F59E0B]/50 shrink-0 flex items-center justify-center text-[#F59E0B] font-bold text-xl">
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  : <span>{user.name.slice(0, 1).toUpperCase()}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-bold text-white">{user.name}</span>
                  {user.isVerified ? (
                    <span className="px-2 py-0.5 bg-[#4EDEA3]/10 text-[#4EDEA3] border border-[#4EDEA3]/30 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 rounded-full text-[10px] font-bold">
                      Unverified
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#908FA0] truncate mt-0.5">{user.email}</div>
                <div className="text-xs mt-1">
                  <span className="text-[#6366F1]">●</span>
                  <span className="text-[#504F5E] ml-1">
                    {user.authMethod === 'google' ? 'Signed in via Google' : 'Signed in via Email'}
                  </span>
                </div>
              </div>
            </div>

            <StatusBar />

            {/* Session info */}
            <div className="p-3 rounded-xl bg-[#131316] border border-[#1F1F22] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#4EDEA3] shrink-0 mt-0.5" />
              <div className="text-xs text-[#908FA0] leading-relaxed">
                <span className="text-white font-semibold">Active session</span> — Your financial data is private and secure. Sign out to switch accounts or end your session.
              </div>
            </div>

            {/* Sign Out button */}
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 rounded-xl border border-red-500/25 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 font-semibold text-sm flex items-center justify-center gap-2.5 transition-all group"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Sign Out of Golden Penny</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================================================
     LOGGED-OUT VIEW
  ================================================ */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#27272A] flex items-center justify-between bg-[#131316]">
          <Logo variant="full" size="md" />
          <button onClick={handleClose} className="p-1.5 text-[#908FA0] hover:text-white rounded-lg hover:bg-[#27272A] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab bar — hidden on OTP screens */}
        {view !== 'otp-signin' && view !== 'otp-signup' && (
          <div className="flex border-b border-[#27272A] bg-[#131316]">
            {(['signin', 'signup'] as AuthView[]).map((v) => (
              <button
                key={v}
                onClick={() => { setView(v); setStatusMsg(''); }}
                className={`flex-1 py-3.5 text-sm font-semibold transition-all ${
                  view === v
                    ? 'text-white border-b-2 border-[#6366F1]'
                    : 'text-[#908FA0] hover:text-white border-b-2 border-transparent'
                }`}
              >
                {v === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>
        )}

        <div className="p-6 space-y-4">
          <StatusBar />

          {/* ---- SIGN IN ---- */}
          {view === 'signin' && (
            <>
              <GoogleBtn />
              <OrDivider />
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#E4E1E6] block mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#504F5E]" />
                    <input
                      type="email" required autoComplete="email"
                      value={signinEmail} onChange={e => setSigninEmail(e.target.value)}
                      className={`${inputClass} pl-9 pr-4`}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#E4E1E6] block mb-1.5">Password</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#504F5E]" />
                    <input
                      type={showSigninPass ? 'text' : 'password'} required autoComplete="current-password"
                      value={signinPassword} onChange={e => setSigninPassword(e.target.value)}
                      className={`${inputClass} pl-9 pr-10`}
                      placeholder="Your password"
                    />
                    <button type="button" onClick={() => setShowSigninPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#504F5E] hover:text-white transition-colors">
                      {showSigninPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={isLoading}
                  className="w-full py-3 bg-[#6366F1] text-white font-bold text-sm rounded-xl hover:bg-[#5254CC] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                  {isLoading ? <Spinner /> : null}
                  <span>Send Verification Code</span>
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
              <p className="text-center text-xs text-[#504F5E]">
                No account yet?{' '}
                <button onClick={() => { setView('signup'); setStatusMsg(''); }}
                  className="text-[#6366F1] hover:underline font-semibold">
                  Create one free
                </button>
              </p>
            </>
          )}

          {/* ---- CREATE ACCOUNT ---- */}
          {view === 'signup' && (
            <>
              <GoogleBtn />
              <OrDivider />
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div>
                  <label className="text-xs font-medium text-[#E4E1E6] block mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#504F5E]" />
                    <input
                      type="text" required autoComplete="name"
                      value={signupName} onChange={e => setSignupName(e.target.value)}
                      className={`${inputClass} pl-9 pr-4`}
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#E4E1E6] block mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#504F5E]" />
                    <input
                      type="email" required autoComplete="email"
                      value={signupEmail} onChange={e => setSignupEmail(e.target.value)}
                      className={`${inputClass} pl-9 pr-4`}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#E4E1E6] block mb-1.5">Password</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#504F5E]" />
                    <input
                      type={showSignupPass ? 'text' : 'password'} required autoComplete="new-password"
                      value={signupPassword} onChange={e => setSignupPassword(e.target.value)}
                      className={`${inputClass} pl-9 pr-10`}
                      placeholder="Min 6 characters"
                    />
                    <button type="button" onClick={() => setShowSignupPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#504F5E] hover:text-white transition-colors">
                      {showSignupPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#E4E1E6] block mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#504F5E]" />
                    <input
                      type="password" required autoComplete="new-password"
                      value={signupConfirmPass} onChange={e => setSignupConfirmPass(e.target.value)}
                      className={`${inputClass} pl-9 pr-4`}
                      placeholder="Repeat password"
                    />
                  </div>
                </div>
                <button type="submit" disabled={isLoading}
                  className="w-full py-3 bg-[#6366F1] text-white font-bold text-sm rounded-xl hover:bg-[#5254CC] transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-1">
                  {isLoading ? <Spinner /> : null}
                  <span>Create Account</span>
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
              <p className="text-center text-xs text-[#504F5E]">
                Already have an account?{' '}
                <button onClick={() => { setView('signin'); setStatusMsg(''); }}
                  className="text-[#6366F1] hover:underline font-semibold">
                  Sign in
                </button>
              </p>
            </>
          )}

          {/* ---- OTP VERIFICATION ---- */}
          {(view === 'otp-signin' || view === 'otp-signup') && (
            <form onSubmit={handleOtpVerify} className="space-y-5">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-[#6366F1]/10 border border-[#6366F1]/30 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-[#6366F1]" />
                </div>
                <h3 className="text-white font-bold text-base">Check your email</h3>
                <p className="text-xs text-[#908FA0] leading-relaxed">
                  We sent a 6-digit verification code to<br />
                  <strong className="text-white">{otpEmail}</strong>
                </p>
              </div>

              {/* Demo code display */}
              {mockOtpCode && (
                <div className="p-3 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-xl text-center space-y-1">
                  <div className="text-[10px] text-[#908FA0] uppercase tracking-wider">Demo mode — use this code:</div>
                  <div className="text-[#F59E0B] font-mono font-bold text-2xl tracking-[0.3em]">{mockOtpCode}</div>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-[#E4E1E6] block mb-1.5 text-center">Enter 6-digit code</label>
                <input
                  type="text" inputMode="numeric" maxLength={6} required autoFocus
                  value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-4 py-3.5 text-center text-2xl font-mono tracking-[0.5em] text-[#F59E0B] focus:outline-none focus:border-[#F59E0B] transition-colors placeholder:text-[#27272A] placeholder:tracking-widest"
                  placeholder="------"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setView(view === 'otp-signin' ? 'signin' : 'signup');
                    setStatusMsg('');
                    setOtpCode('');
                  }}
                  className="w-1/3 py-2.5 bg-[#27272A] text-[#E4E1E6] font-semibold text-xs rounded-xl hover:bg-[#3F3F46] transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-[#4EDEA3] text-black font-bold text-sm rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify &amp; {view === 'otp-signup' ? 'Create Account' : 'Sign In'}</span>
                </button>
              </div>

              <p className="text-center text-xs text-[#504F5E]">
                Didn't receive a code?{' '}
                <button
                  type="button"
                  onClick={() => showStatus('A new code has been sent.', 'info')}
                  className="text-[#6366F1] hover:underline"
                >
                  Resend
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
