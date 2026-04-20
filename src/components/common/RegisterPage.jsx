import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import { registerApi, loginApi, dashboardForRole } from '../../auth/auth.js';

export default function RegisterPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', workspace: '', password: '', confirmPwd: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.workspace || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirmPwd) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    // Step 1: Register workspace + admin via real API
    const regResult = await registerApi(form.name, form.email, form.workspace, form.password);
    if (!regResult.success) {
      setError(regResult.error);
      setLoading(false);
      return;
    }
    // Step 2: Auto log in with newly created creds
    const loginResult = await loginApi(form.email, form.password);
    if (loginResult.success) {
      setUser(loginResult.user);
      navigate(dashboardForRole(loginResult.user.role), { replace: true });
    } else {
      // Registration succeeded but auto-login failed — redirect to login
      navigate('/login', { replace: true });
    }
  }

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#2f312f] p-16 relative overflow-hidden">
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
              Set up your<br />
              <span className="italic text-primary-fixed/80">workspace.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-sm">
              Create your admin account to bring your team into the TeamSync workspace and start collaborating.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
            <span className="material-symbols-outlined text-primary-fixed/60">shield</span>
            <p className="text-zinc-300 text-sm">Full admin access to manage users & teams</p>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
            <span className="material-symbols-outlined text-primary-fixed/60">description</span>
            <p className="text-zinc-300 text-sm">AI-powered minutes of meeting capture</p>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
            <span className="material-symbols-outlined text-primary-fixed/60">assignment</span>
            <p className="text-zinc-300 text-sm">Linked task tracking & accountability</p>
          </div>
        </div>
      </div>

      {/* Right Panel — Registration Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 fade-in">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <h1 className="font-headline text-3xl italic text-on-surface">TeamSync</h1>
            <p className="text-[10px] uppercase tracking-widest text-outline mt-1">Digital Atelier</p>
          </div>

          <div className="mb-8">
            <h2 className="font-headline text-4xl text-on-surface mb-2">Create workspace.</h2>
            <p className="text-on-surface-variant">Register your admin account to get started.</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-error-container rounded-lg">
              <span className="material-symbols-outlined text-on-error-container text-sm">error</span>
              <span className="text-on-error-container text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Registration Form — calls real API */}
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-2">Admin Name *</label>
              <input type="text" name="name" className="auth-input" placeholder="Your full name" required value={form.name} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-2">Email Address *</label>
              <input type="email" name="email" className="auth-input" placeholder="admin@yourcompany.com" required value={form.email} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-2">Workspace Name *</label>
              <input type="text" name="workspace" className="auth-input" placeholder="e.g. Digital Atelier" required value={form.workspace} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-2">Password *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" className="auth-input pr-12" placeholder="Create a strong password" required value={form.password} onChange={handleChange} />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors" onClick={() => setShowPassword(!showPassword)}>
                  <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-2">Confirm Password *</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} name="confirmPwd" className="auth-input pr-12" placeholder="Confirm your password" required value={form.confirmPwd} onChange={handleChange} />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors" onClick={() => setShowConfirm(!showConfirm)}>
                  <span className="material-symbols-outlined text-lg">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-2">
              <span className="material-symbols-outlined">admin_panel_settings</span>
              <span>{loading ? 'Creating workspace…' : 'Register as Admin'}</span>
            </button>
          </form>

          <p className="text-center text-xs text-outline mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign In</Link>
          </p>
          <p className="text-center text-xs text-outline mt-3">
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
