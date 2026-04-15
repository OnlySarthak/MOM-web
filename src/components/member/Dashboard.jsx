import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import Avatar from 'react-avatar';

export default function MemberDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening');
  }, []);

  return (
    <>
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">{greeting}, {user.name.split(' ')[0]}.</h1>
        <p className="font-headline italic text-xl text-outline">Here's what's happening in your workspace today.</p>
      </div>

      {/* Personal Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { icon: 'assignment', label: 'Tasks assigned to you', value: 4 },
          { icon: 'calendar_today', label: 'Meetings today', value: 2 },
          { icon: 'check_circle', label: 'Completed this week', value: 3 },
          { icon: 'description', label: "MOMs you're in", value: 6 },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary">{s.icon}</span>
            </div>
            <p className="font-headline text-3xl font-bold text-on-surface">{s.value}</p>
            <p className="text-xs text-on-surface-variant mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main bento grid */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Recent Meetings */}
        <div className="col-span-12 lg:col-span-5 ts-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl text-on-surface">Recent Meetings</h2>
            <Link to="/member/meetings" className="text-xs font-medium text-primary hover:underline">All meetings</Link>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/8 transition-colors cursor-pointer group" onClick={() => navigate('/member/meeting-detail')}>
              <div className="mb-2">
                <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Product Strategy Sync</p>
              </div>
              <p className="text-xs text-on-surface-variant">Apr 24, 2026 · 10:30 AM · 45 mins</p>
              <div className="flex -space-x-1.5 mt-3">
                <Avatar name="Sarah Miller" size="24" round={true} style={{ border: '2px solid white' }} />
                <Avatar name="David Chen" size="24" round={true} style={{ marginLeft: '-4px', border: '2px solid white' }} />
                <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-[8px] font-bold ring-2 ring-white" style={{ marginLeft: '-4px' }}>+3</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10 hover:bg-surface-container transition-colors cursor-pointer" onClick={() => navigate('/member/meeting-detail')}>
              <div className="mb-2">
                <p className="text-sm font-semibold text-on-surface">Weekly Engineering Review</p>
              </div>
              <p className="text-xs text-on-surface-variant">Apr 22, 2026 · 14:00 PM · 60 mins</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10 hover:bg-surface-container transition-colors cursor-pointer" onClick={() => navigate('/member/meeting-detail')}>
              <div className="mb-2">
                <p className="text-sm font-semibold text-on-surface">Design Review: Mobile UI</p>
              </div>
              <p className="text-xs text-on-surface-variant">Apr 26, 2026 · 16:30 PM · 30 mins</p>
            </div>
          </div>
        </div>

        {/* My Tasks */}
        <div className="col-span-12 lg:col-span-7 ts-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl text-on-surface">My Tasks</h2>
            <Link to="/member/tasks" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors">
              <div className="flex-1">
                <p className="text-sm font-medium text-on-surface line-through opacity-60">Cloud Security Audit</p>
                <p className="text-xs text-outline">Engineering · Security</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-secondary"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>Completed</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors border border-primary/10 bg-primary/3">
              <div className="flex-1">
                <p className="text-sm font-medium text-on-surface">Refactor Auth Middleware</p>
                <p className="text-xs text-outline">Engineering · API</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-medium"><span className="animate-ping inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>In Progress</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors">
              <div className="flex-1">
                <p className="text-sm font-medium text-on-surface">Update API Documentation</p>
                <p className="text-xs text-outline">Engineering · Docs</p>
              </div>
              <span className="text-xs text-outline">To Do</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors">
              <div className="flex-1">
                <p className="text-sm font-medium text-on-surface">Optimize Asset Pipeline</p>
                <p className="text-xs text-outline">DevOps · Performance</p>
              </div>
              <span className="text-xs text-outline">To Do</span>
            </div>
          </div>
          <Link to="/member/tasks" className="mt-4 flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-outline-variant/30 text-xs text-outline hover:border-primary/30 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-sm">add</span>Add new task
          </Link>
        </div>
      </div>

      {/* Recent MOMs */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-headline text-2xl text-on-surface">Recent Minutes</h2>
          <Link to="/member/mom-list" className="text-xs font-medium text-primary hover:underline">View all MOMs</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="ts-card p-6 hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => navigate('/member/mom-detail')}>
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">Project Atelier-X</span>
            <h3 className="font-headline text-xl text-on-surface mt-2 mb-2">Q4 Brand Strategy & Visual Language Sync</h3>
            <p className="text-xs text-on-surface-variant line-clamp-2 mb-4">Discussed the transition to the "Digital Atelier" concept with focus on tactile textures and typography hierarchy.</p>
            <div className="flex justify-between items-center pt-3 border-t border-outline-variant/10">
              <div className="flex -space-x-2">
                <Avatar name="Julian Pierce" size="24" round={true} style={{ border: '2px solid white' }} />
                <Avatar name="Sarah Kim" size="24" round={true} style={{ marginLeft: '-8px', border: '2px solid white' }} />
                <div className="w-6 h-6 rounded-full bg-surface-container text-on-surface flex items-center justify-center text-[8px] font-bold ring-2 ring-white" style={{ marginLeft: '-8px' }}>+2</div>
              </div>
              <span className="font-mono text-[10px] text-outline">Oct 24, 2023</span>
            </div>
          </div>
          <div className="ts-card p-6 hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => navigate('/member/mom-detail')}>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#7f2500] font-bold">Engineering</span>
            <h3 className="font-headline text-xl text-on-surface mt-2 mb-2">Micro-interaction Framework & Tailwind Config</h3>
            <p className="text-xs text-on-surface-variant line-clamp-2 mb-4">Review of new design system tokens, mapping Material Design roles to the bespoke "Atelier" palette.</p>
            <div className="flex justify-between items-center pt-3 border-t border-outline-variant/10">
              <div className="flex -space-x-2">
                <Avatar name="David Chen" size="24" round={true} style={{ border: '2px solid white' }} />
                <div className="w-6 h-6 rounded-full bg-surface-container text-on-surface flex items-center justify-center text-[8px] font-bold ring-2 ring-white" style={{ marginLeft: '-8px' }}>+1</div>
              </div>
              <span className="font-mono text-[10px] text-outline">Oct 21, 2023</span>
            </div>
          </div>
          <Link to="/member/mom-list" className="ts-card p-6 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 hover:border-primary/30 hover:bg-primary/3 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-2xl">add</span>
            </div>
            <p className="font-headline text-lg text-on-surface">View All MOMs</p>
            <p className="text-xs text-outline mt-1">32 documents synchronized</p>
          </Link>
        </div>
      </div>
    </>
  );
}
