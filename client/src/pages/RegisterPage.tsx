import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'ADMIN'>('CUSTOMER');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      const { token, user } = res.data;
      login(token, user);

      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/catalog');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Registration failed. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 px-6 min-h-screen flex items-center justify-center bg-[#070707]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-copper flex items-center justify-center font-bold text-black font-headline">
              N
            </div>
            <span className="text-xl font-extrabold font-headline tracking-widest text-white">
              NEXORO
            </span>
          </Link>
          <h1 className="text-2xl font-bold font-headline text-white">Create Your Account</h1>
          <p className="text-xs text-white/50 mt-1">
            Join the NEXORO community for priority releases and custom configuration.
          </p>
        </div>

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
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Vance"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-copper transition-colors"
                />
              </div>
            </div>

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
                  placeholder="alex@example.com"
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
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-copper transition-colors"
                />
              </div>
            </div>

            {/* Account Role Selector */}
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Account Role Tier
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('CUSTOMER')}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all ${
                    role === 'CUSTOMER'
                      ? 'bg-copper text-black shadow-md shadow-copper/20'
                      : 'bg-black/40 text-white/60 border border-white/10 hover:text-white'
                  }`}
                >
                  CUSTOMER
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    role === 'ADMIN'
                      ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                      : 'bg-black/40 text-white/60 border border-white/10 hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>ADMINISTRATOR</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3.5 bg-copper hover:bg-copper-hover text-black font-extrabold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-copper/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <span>{isLoading ? 'CREATING ACCOUNT...' : 'REGISTER ACCOUNT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-white/50">
            <span>Already registered? </span>
            <Link to="/login" className="text-copper hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
