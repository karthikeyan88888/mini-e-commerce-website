import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      login(token, user);

      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate(from);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (role: 'CUSTOMER' | 'ADMIN') => {
    if (role === 'ADMIN') {
      setEmail('admin@nexoro.io');
      setPassword('Admin@123');
    } else {
      setEmail('customer@nexoro.io');
      setPassword('Customer@123');
    }
  };

  return (
    <div className="pt-28 pb-20 px-6 min-h-screen flex items-center justify-center bg-[#070707]">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-copper flex items-center justify-center font-bold text-black font-headline">
              N
            </div>
            <span className="text-xl font-extrabold font-headline tracking-widest text-white">
              NEXORO
            </span>
          </Link>
          <h1 className="text-2xl font-bold font-headline text-white">Client & Admin Access</h1>
          <p className="text-xs text-white/50 mt-1">
            Sign in to manage orders, track shipments, or access the operations console.
          </p>
        </div>

        {/* Demo Credentials Quick Selector */}
        <div className="mb-6 p-4 rounded-2xl bg-[#0e0f13] border border-copper/30 space-y-2.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-copper block font-semibold">
            QUICK HACKATHON DEMO PRESETS
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('ADMIN')}
              className="py-2 px-3 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/50 text-[11px] font-bold text-amber-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Fill Admin (Operations)</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('CUSTOMER')}
              className="py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-copper" />
              <span>Fill Customer (Buyer)</span>
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-8 rounded-3xl bg-[#0e0f13] border border-white/10 shadow-2xl">
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-xs text-red-200 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nexoro.io"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-copper transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-copper transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 bg-copper hover:bg-copper-hover text-black font-extrabold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-copper/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <span>{isLoading ? 'AUTHENTICATING...' : 'SIGN IN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-white/50">
            <span>Don&apos;t have an account? </span>
            <Link to="/register" className="text-copper hover:underline font-semibold">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
