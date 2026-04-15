import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import { dashboardForRole } from '../../auth/auth.js';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(dashboardForRole(user.role), { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="bg-surface font-body text-on-surface antialiased overflow-x-hidden">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-10 h-16 bg-[#faf9f6]/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>sync_alt</span>
          </div>
          <span className="font-headline text-xl italic text-on-surface">TeamSync</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Features</a>
          <a href="#roles" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Roles</a>
          <a href="#demo" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Demo</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors px-4 py-2">Sign In</Link>
          <Link to="/login" className="btn-primary text-sm">Get Started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-24 px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-10 w-48 h-48 bg-primary-fixed/40 rounded-full blur-2xl"></div>
        </div>

        <div className="relative text-center max-w-5xl mx-auto">
          <div className="fade-up fade-up-d1 inline-flex items-center gap-2 px-4 py-1.5 bg-primary-fixed rounded-full text-xs font-bold uppercase tracking-widest text-on-primary-fixed-variant mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Digital Atelier · Team Collaboration v2.0
          </div>
          <h1 className="fade-up fade-up-d2 font-headline text-6xl md:text-8xl text-on-surface tracking-tight leading-none mb-6">
            Collaborate<br />
            <span className="italic text-primary">with Clarity.</span>
          </h1>
          <p className="fade-up fade-up-d3 font-body text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-12">
            TeamSync brings your team's meetings, minutes, and tasks into one beautifully crafted workspace — built for the modern atelier.
          </p>
          <div className="fade-up fade-up-d4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="btn-primary text-base px-8 py-3">
              <span className="material-symbols-outlined">login</span>
              Enter the Atelier
            </Link>
            <a href="#demo" className="btn-secondary text-base px-8 py-3">
              <span className="material-symbols-outlined">play_circle</span>
              See Demo Logins
            </a>
          </div>
        </div>

        {/* Bento preview */}
        <div className="relative mt-20 w-full max-w-5xl mx-auto fade-up fade-up-d4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 bg-white rounded-2xl p-6 shadow-[0_10px_50px_rgba(27,28,26,0.08)] border border-outline-variant/15 float">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-sm">calendar_today</span></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-outline">Upcoming</p>
                  <p className="text-sm font-semibold text-on-surface">Product Strategy Sync</p>
                </div>
                <span className="ml-auto badge-scheduled"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>Today</span>
              </div>
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-primary-container text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white">JT</div>
                <div className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white">EV</div>
                <div className="w-7 h-7 rounded-full bg-[#7f2500] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white">MC</div>
                <div className="w-7 h-7 rounded-full bg-surface-container text-on-surface flex items-center justify-center text-[10px] font-bold ring-2 ring-white">+4</div>
              </div>
            </div>
            <div className="bg-[#2f312f] rounded-2xl p-6 text-white">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Open Tasks</p>
              <p className="font-headline text-4xl font-bold">12</p>
              <div className="ts-progress-track mt-4"><div className="ts-progress-fill" style={{ width: '72%' }}></div></div>
              <p className="text-xs text-zinc-400 mt-2">72% completed</p>
            </div>
            <div className="bg-primary-fixed/30 rounded-2xl p-6">
              <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">MOMs</p>
              <p className="font-headline text-3xl font-bold text-on-surface">32</p>
              <p className="text-xs text-on-surface-variant mt-1">Synced documents</p>
            </div>
            <div className="col-span-2 bg-white rounded-2xl p-6 shadow-[0_10px_50px_rgba(27,28,26,0.05)] border border-outline-variant/15">
              <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-3">Team Velocity</p>
              <div className="flex items-end gap-2 h-16">
                <div className="w-6 bg-primary/20 rounded-sm" style={{ height: '40%' }}></div>
                <div className="w-6 bg-primary/40 rounded-sm" style={{ height: '60%' }}></div>
                <div className="w-6 bg-primary/60 rounded-sm" style={{ height: '75%' }}></div>
                <div className="w-6 bg-primary/80 rounded-sm" style={{ height: '55%' }}></div>
                <div className="w-6 bg-primary rounded-sm" style={{ height: '90%' }}></div>
                <div className="w-6 bg-primary/70 rounded-sm" style={{ height: '80%' }}></div>
                <div className="w-6 bg-primary/90 rounded-sm" style={{ height: '95%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-headline text-5xl text-on-surface mb-4">Everything your team needs.</h2>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto">Built for precision, designed for creativity. Every feature serves your workflow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="ts-card p-8 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-primary text-2xl">calendar_today</span>
              </div>
              <h3 className="font-headline text-2xl text-on-surface mb-2">Meeting Management</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Schedule, track, and review all your meetings in one place. Never miss a context again.</p>
            </div>
            <div className="ts-card p-8 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-primary text-2xl">description</span>
              </div>
              <h3 className="font-headline text-2xl text-on-surface mb-2">Minutes of Meeting</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Auto-capture decisions and action items. Every dialogue, every commitment — documented.</p>
            </div>
            <div className="ts-card p-8 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-primary text-2xl">assignment</span>
              </div>
              <h3 className="font-headline text-2xl text-on-surface mb-2">Task Tracking</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Assign, prioritize, and close tasks linked directly to your meetings and decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Roles ── */}
      <section id="roles" className="py-32 px-6 bg-surface-container-low/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-headline text-5xl text-on-surface mb-4">Role-based Access.</h2>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto">Every team member sees exactly what they need — nothing more, nothing less.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-outline-variant/15 text-center hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-[#2f312f] flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-white text-2xl">shield</span>
              </div>
              <h3 className="font-headline text-2xl text-on-surface mb-2">Admin</h3>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">Full system access — users, teams, analytics, and every dashboard.</p>
              <span className="inline-block px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold rounded-full">admin@teamsync.app</span>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-primary/20 text-center hover:-translate-y-1 transition-transform shadow-lg shadow-primary/5">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-white text-2xl">groups</span>
              </div>
              <h3 className="font-headline text-2xl text-on-surface mb-2">Team Leader</h3>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">Team dashboard with progress tracking, MOM review, and task assignment.</p>
              <span className="inline-block px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold rounded-full">leader@teamsync.app</span>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-outline-variant/15 text-center hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-secondary text-white flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-2xl">person</span>
              </div>
              <h3 className="font-headline text-2xl text-on-surface mb-2">Member</h3>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">Personal dashboard with assigned tasks, upcoming meetings, and team MOMs.</p>
              <span className="inline-block px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold rounded-full">member@teamsync.app</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Demo CTA ── */}
      <section id="demo" className="py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-headline text-5xl text-on-surface mb-6">Ready to explore?</h2>
          <p className="text-on-surface-variant text-lg mb-12">Use any of these demo accounts to experience TeamSync as different roles. Password for all: role name + <code className="font-mono bg-surface-container px-2 py-0.5 rounded text-sm">123</code></p>
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="ts-card p-6 text-center">
              <p className="font-mono text-xs text-outline mb-1">Admin</p>
              <p className="text-sm font-bold text-on-surface">admin@teamsync.app</p>
              <p className="font-mono text-xs text-primary mt-1">admin123</p>
            </div>
            <div className="ts-card p-6 text-center">
              <p className="font-mono text-xs text-outline mb-1">Leader</p>
              <p className="text-sm font-bold text-on-surface">leader@teamsync.app</p>
              <p className="font-mono text-xs text-primary mt-1">leader123</p>
            </div>
            <div className="ts-card p-6 text-center">
              <p className="font-mono text-xs text-outline mb-1">Member</p>
              <p className="text-sm font-bold text-on-surface">member@teamsync.app</p>
              <p className="font-mono text-xs text-primary mt-1">member123</p>
            </div>
          </div>
          <Link to="/login" className="btn-primary text-lg px-10 py-4">
            <span className="material-symbols-outlined">login</span>
            Sign In Now
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-outline-variant/15 py-12 px-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-headline text-lg italic text-on-surface">TeamSync</span>
            <span className="text-[10px] uppercase tracking-widest text-outline">Digital Atelier</span>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-outline">© 2024 TeamSync Digital Atelier</p>
        </div>
      </footer>
    </div>
  );
}
