import React, { useState } from 'react';
import { X, ShieldCheck, Mail, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { useFinance } from '../../context/FinanceContext';

export const AuthModal: React.FC = () => {
  const { user, loginWithGoogle, loginWithEmail, verifyEmailOtp, logout, isAuthModalOpen, setIsAuthModalOpen } = useFinance();

  const [mode, setMode] = useState<'login' | 'otp'>('login');
  const [emailInput, setEmailInput] = useState('debrajbhowmick89@gmail.com');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [otpCode, setOtpCode] = useState('492810');
  const [statusMsg, setStatusMsg] = useState('');
  const [sentCode, setSentCode] = useState('');

  if (!isAuthModalOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    const code = loginWithEmail(emailInput);
    setSentCode(code);
    setMode('otp');
    setStatusMsg(`Verification code sent to ${emailInput}. Default OTP: ${code}`);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyEmailOtp(emailInput, otpCode);
    if (success) {
      setStatusMsg('Email verified successfully!');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setMode('login');
        setStatusMsg('');
      }, 1000);
    } else {
      setStatusMsg('Invalid OTP code. Please enter 492810.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#27272A] flex items-center justify-between bg-[#131316]">
          <Logo variant="full" size="md" />
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-[#908FA0] hover:text-white rounded-lg hover:bg-[#27272A] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Active User Card */}
          <div className="p-4 rounded-xl bg-[#1F1F22] border border-[#27272A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#27272A] border border-[#F59E0B]/40 shrink-0 flex items-center justify-center text-[#F59E0B] font-bold">
                {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : user.name.slice(0, 1)}
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{user.name}</span>
                  {user.isVerified ? (
                    <span className="px-1.5 py-0.5 bg-[#4EDEA3]/10 text-[#4EDEA3] border border-[#4EDEA3]/30 rounded-md text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 rounded-md text-[10px] font-bold">
                      Unverified
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#908FA0]">{user.email}</div>
              </div>
            </div>
          </div>

          {statusMsg && (
            <div className="p-3 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/30 text-xs text-[#C0C1FF]">
              {statusMsg}
            </div>
          )}

          {/* Quick Google Sign-In */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#908FA0] uppercase tracking-wider block">
              Direct Google Account Access
            </label>
            <button
              onClick={() => {
                loginWithGoogle();
                setStatusMsg('Logged in via Gmail as Debraj Bhowmick');
                setTimeout(() => setIsAuthModalOpen(false), 800);
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-[#3F3F46] bg-[#1F1F22] hover:bg-[#27272A] text-white font-semibold text-sm flex items-center justify-center gap-3 transition-all hover:border-[#6366F1]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google (debrajbhowmick89@gmail.com)</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#27272A] w-full" />
            <span className="bg-[#18181B] px-3 text-[11px] font-bold text-[#908FA0] uppercase absolute">
              OR Email Verification
            </span>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#E4E1E6] block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#908FA0]" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#131316] border border-[#27272A] rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#6366F1]"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#E4E1E6] block mb-1">Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#908FA0]" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-[#131316] border border-[#27272A] rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#6366F1] text-white font-bold text-sm rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <span>Send Verification Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="p-3 bg-[#131316] border border-[#27272A] rounded-xl text-xs text-[#908FA0]">
                Sent 6-digit OTP code to <strong className="text-white">{emailInput}</strong>.
                {sentCode && (
                  <span className="block text-[#F59E0B] font-mono mt-1 font-bold">
                    Test Code: {sentCode}
                  </span>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-[#E4E1E6] block mb-1">Enter 6-Digit Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-4 py-2.5 text-center text-lg font-mono tracking-widest text-[#F59E0B] focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-1/3 py-2.5 bg-[#27272A] text-[#E4E1E6] font-semibold text-xs rounded-xl hover:bg-[#3F3F46]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-[#4EDEA3] text-black font-bold text-xs rounded-xl hover:opacity-90"
                >
                  Verify & Sign In
                </button>
              </div>
            </form>
          )}

          {user.authMethod !== 'guest' && (
            <button
              onClick={() => logout()}
              className="w-full text-center text-xs text-[#EF4444] hover:underline pt-2"
            >
              Log out of current session
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
