import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import { dashboardForRole } from '../../auth/auth.js';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(dashboardForRole(user.role), { replace: true });
    }
  }, [user, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = login(email.trim(), password);
      if (result.success) {
        navigate(dashboardForRole(result.user.role), { replace: true });
      } else {
        setError(result.error);
        setLoading(false);
      }
    }, 600);
  }

  function fillDemo(demoEmail, demoPassword) {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(demoEmail, demoPassword);
      if (result.success) {
        navigate(dashboardForRole(result.user.role), { replace: true });
      } else {
        setError(result.error);
        setLoading(false);
      }
    }, 600);
  }

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex">
      {/* ── Left Panel — Branding ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#2f312f] p-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-20">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>sync_alt</span>
            </div>
            <div>
              <h1 className="font-headline text-2xl italic text-white leading-tight">TeamSync</h1>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">Digital Atelier</p>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="font-headline text-5xl text-white leading-tight">
              Where great<br />
              <span className="italic text-primary-fixed/80">teams align.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-sm">
              Built for modern teams who value clarity, craft, and collaboration in every meeting.
            </p>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
            <span className="material-symbols-outlined text-primary-fixed/60">calendar_today</span>
            <p className="text-zinc-300 text-sm">Smart meeting management & scheduling</p>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
            <span className="material-symbols-outlined text-primary-fixed/60">description</span>
            <p className="text-zinc-300 text-sm">Auto-captured minutes of meeting</p>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
            <span className="material-symbols-outlined text-primary-fixed/60">assignment</span>
            <p className="text-zinc-300 text-sm">Linked task tracking & accountability</p>
          </div>
        </div>
      </div>

      {/* ── Right Panel — Login Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 fade-in">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <h1 className="font-headline text-3xl italic text-on-surface">TeamSync</h1>
            <p className="text-[10px] uppercase tracking-widest text-outline mt-1">Digital Atelier</p>
          </div>

          <h2 className="font-headline text-4xl text-on-surface mb-2">Welcome back.</h2>
          <p className="text-on-surface-variant mb-10">Sign in to your workspace to continue.</p>

          {/* Error message */}
          {error && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-error-container rounded-lg">
              <span className="material-symbols-outlined text-on-error-container text-sm">error</span>
              <span className="text-on-error-container text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-2">Email Address</label>
              <input
                type="email"
                className="auth-input"
                placeholder="hello@teamsync.app"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input pr-12"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-2">
              <span className="material-symbols-outlined">login</span>
              <span>{loading ? 'Signing in…' : 'Sign In'}</span>
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-10">
            <p className="text-[10px] uppercase tracking-widest text-outline font-semibold mb-4 text-center">— Quick Demo Access —</p>
            <div className="space-y-3">
              <button className="demo-chip w-full flex items-center gap-4 p-4 border border-outline-variant/20 rounded-xl bg-surface-container-low hover:bg-surface-container" onClick={() => fillDemo('admin@teamsync.app', 'admin123')}>
                <div className="w-10 h-10 rounded-xl bg-[#2f312f] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-white text-lg">shield</span>
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold text-on-surface">Admin Account</p>
                  <p className="font-mono text-xs text-outline">admin@teamsync.app · admin123</p>
                </div>
                <span className="material-symbols-outlined text-outline text-sm">arrow_forward</span>
              </button>
              <button className="demo-chip w-full flex items-center gap-4 p-4 border border-primary/20 rounded-xl bg-primary/5 hover:bg-primary/10" onClick={() => fillDemo('leader@teamsync.app', 'leader123')}>
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-white text-lg">groups</span>
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold text-on-surface">Team Leader</p>
                  <p className="font-mono text-xs text-outline">leader@teamsync.app · leader123</p>
                </div>
                <span className="material-symbols-outlined text-outline text-sm">arrow_forward</span>
              </button>
              <button className="demo-chip w-full flex items-center gap-4 p-4 border border-outline-variant/20 rounded-xl bg-surface-container-low hover:bg-surface-container" onClick={() => fillDemo('member@teamsync.app', 'member123')}>
                <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-lg">person</span>
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold text-on-surface">Team Member</p>
                  <p className="font-mono text-xs text-outline">member@teamsync.app · member123</p>
                </div>
                <span className="material-symbols-outlined text-outline text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-outline mt-8">
            <Link to="/" className="hover:text-primary transition-colors inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
