import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import Avatar from 'react-avatar';

const API_BASE = 'http://localhost:5000/api';

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

const STATE_DISPLAY = { in_progress: 'in-progress', pending: 'todo', completed: 'completed' };

export default function MemberDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening');
    apiFetch('/member/dashboard')
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-outline animate-pulse">Loading dashboard…</div>;
  if (error) return <div className="flex items-center justify-center h-64 text-error text-sm">Failed to load dashboard: {error}</div>;

  const {
    totalTasks = 0,
    todaysMeetingCount = 0,
    tasks = [],
    recentMOMs = [],
    teamMembers = [],
    teamDetails = {}
  } = data || {};

  const completedThisWeek = tasks.filter(t => t.state === 'completed').length;
  const momCount = recentMOMs.length;

  return (
    <>
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">
          {greeting}, {(user?.name || 'User').split(' ')[0]}.
        </h1>
        <p className="font-headline italic text-xl text-outline">Here's what's happening in your workspace today.</p>
      </div>

      {/* Personal Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { icon: 'assignment', label: 'Tasks assigned to you', value: totalTasks },
          { icon: 'calendar_today', label: 'Meetings today', value: todaysMeetingCount },
          { icon: 'check_circle', label: 'Completed this week', value: completedThisWeek },
          { icon: 'description', label: "MOMs you're in", value: momCount },
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

      {/* Team Information Card */}
      <div className="ts-card p-6 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-sm">groups</span>
          </div>
          <h2 className="font-headline text-xl text-on-surface">My Team</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Team Name</p>
            <p className="text-sm font-semibold text-on-surface">{teamDetails?.teamName || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Project</p>
            <p className="text-sm font-semibold text-on-surface">{teamDetails?.project || '—'}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Team Leader</p>
            <div className="flex items-center gap-2">
              <Avatar name={teamDetails?.leaderId?.name || '?'} size="24" round={true} />
              <p className="text-sm font-semibold text-on-surface">{teamDetails?.leaderId?.name || '—'}</p>
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Description</p>
            <p className="text-sm text-on-surface-variant">{teamDetails?.teamDescription || teamDetails?.teamFunctionalRole || '—'}</p>
          </div>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Team Members Table */}
        <div className="col-span-12 lg:col-span-5 ts-card overflow-hidden">
          <div className="px-6 py-5 flex items-center justify-between border-b border-outline-variant/10">
            <h2 className="font-headline text-xl text-on-surface">Team Members</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">{teamMembers.length} Members</span>
          </div>
          <table className="ts-table">
            <thead><tr><th>Member</th><th>Team Role</th></tr></thead>
            <tbody>
              {teamMembers.length === 0 ? (
                <tr><td colSpan={2} className="text-center text-outline py-6 text-sm">No members found.</td></tr>
              ) : teamMembers.map((m, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={m.userId?.name || '?'} size="32" round={true} />
                      <div>
                        <p className="text-sm font-medium text-on-surface">{m.userId?.name || '—'}</p>
                        {m.isLeader && <span className="text-[9px] font-bold uppercase tracking-wider text-primary">Leader</span>}
                      </div>
                    </div>
                  </td>
                  <td><span className="text-xs text-on-surface-variant">{m.functionalRole || '—'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* My Tasks */}
        <div className="col-span-12 lg:col-span-7 ts-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl text-on-surface">My Tasks</h2>
            <Link to="/member/tasks" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-sm text-outline italic">No tasks assigned.</p>
            ) : tasks.map((t, i) => {
              const uiState = STATE_DISPLAY[t.state] || t.state;
              const isCompleted = t.state === 'completed';
              return (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors ${uiState === 'in-progress' ? 'border border-primary/10 bg-primary/3' : ''}`}>
                  <div className="flex-1">
                    <p className={`text-sm font-medium text-on-surface ${isCompleted ? 'line-through opacity-60' : ''}`}>{t.title || '—'}</p>
                  </div>
                  {uiState === 'in-progress'
                    ? <span className="flex items-center gap-1.5 text-xs font-medium"><span className="animate-ping inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>In Progress</span>
                    : uiState === 'completed'
                    ? <span className="flex items-center gap-1.5 text-xs font-medium text-secondary"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>Completed</span>
                    : <span className="text-xs text-outline">To Do</span>}
                </div>
              );
            })}
          </div>
          <Link to="/member/tasks" className="mt-4 flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-outline-variant/30 text-xs text-outline hover:border-primary/30 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_forward</span>Go to My Tasks
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
          {recentMOMs.length === 0 ? (
            <p className="text-sm text-outline italic col-span-3">No recent MOMs.</p>
          ) : recentMOMs.map((mom, i) => (
            <div key={mom._id || i} className="ts-card p-6 hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => navigate(`/member/mom-detail?id=${mom._id}`)}>
              {/* label = contextLable */}
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">{mom.contextLable || '—'}</span>
              {/* title = MeetingTitle */}
              <h3 className="font-headline text-xl text-on-surface mt-2 mb-2">{mom.MeetingTitle || '—'}</h3>
              <p className="text-xs text-on-surface-variant line-clamp-2 mb-4">{mom.summary || ''}</p>
              <div className="flex justify-between items-center pt-3 border-t border-outline-variant/10">
                <div className="flex -space-x-2">
                  {(mom.presentAttendees || []).slice(0, 2).map((a, ai) => (
                    <Avatar key={ai} name={a.name || '?'} size="24" round={true} style={{ marginLeft: ai > 0 ? '-8px' : '0', border: '2px solid white' }} />
                  ))}
                </div>
                <span className="font-mono text-[10px] text-outline">
                  {mom.createdAt ? new Date(mom.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                </span>
              </div>
            </div>
          ))}
          <Link to="/member/mom-list" className="ts-card p-6 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 hover:border-primary/30 hover:bg-primary/3 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-2xl">add</span>
            </div>
            <p className="font-headline text-lg text-on-surface">View All MOMs</p>
          </Link>
        </div>
      </div>
    </>
  );
}
