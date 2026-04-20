import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';

const API_BASE = 'http://localhost:5000/api';

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch('/admin/dashboard')
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-outline animate-pulse">Loading dashboard…</div>;
  if (error) return <div className="flex items-center justify-center h-64 text-error text-sm">Failed to load dashboard: {error}</div>;

  const { cards = {}, teamDirectory = [], systemHealth = {} } = data || {};
  const {
    totalUsers = 0, totalMeetings = 0, totalCompletedTasks = 0, totalTeams = 0
  } = cards;
  const {
    totalTasks = 0, completedTasks = 0, inProgressTasks = 0, pendingTasks = 0, taskProgress = 0
  } = systemHealth;

  const completedPct = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;
  const inProgressPct = totalTasks > 0 ? ((inProgressTasks / totalTasks) * 100).toFixed(1) : 0;
  const pendingPct = totalTasks > 0 ? ((pendingTasks / totalTasks) * 100).toFixed(1) : 0;

  return (
    <>
      {/* Page Hero */}
      <div className="mb-10">
        <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">System Overview</h1>
        <p className="font-headline italic text-xl text-outline">Monitor and manage the entire TeamSync workspace.</p>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">group</span>
            </div>
            <span className="font-mono text-[10px] text-outline uppercase tracking-widest">Users</span>
          </div>
          <p className="font-headline text-4xl font-bold text-on-surface">{totalUsers}</p>
          <p className="text-xs text-on-surface-variant mt-1">Workspace members</p>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
            </div>
            <span className="font-mono text-[10px] text-outline uppercase tracking-widest">Meetings</span>
          </div>
          <p className="font-headline text-4xl font-bold text-on-surface">{totalMeetings}</p>
          <p className="text-xs text-on-surface-variant mt-1">Total meetings</p>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">assignment</span>
            </div>
            <span className="font-mono text-[10px] text-outline uppercase tracking-widest">Tasks</span>
          </div>
          <p className="font-headline text-4xl font-bold text-on-surface">{totalCompletedTasks}</p>
          <p className="text-xs text-on-surface-variant mt-1">{completedPct}% completed</p>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">hub</span>
            </div>
            <span className="font-mono text-[10px] text-outline uppercase tracking-widest">Teams</span>
          </div>
          <p className="font-headline text-4xl font-bold text-on-surface">{totalTeams}</p>
          <p className="text-xs text-on-surface-variant mt-1">Active teams</p>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6 mb-10">
        {/* Team Directory */}
        <div className="col-span-12 lg:col-span-7 ts-card overflow-hidden">
          <div className="px-6 py-5 flex items-center justify-between border-b border-outline-variant/10">
            <h2 className="font-headline text-2xl text-on-surface">Team Directory</h2>
            <Link to="/admin/users" className="text-xs font-medium text-primary hover:underline">Manage all users →</Link>
          </div>
          {teamDirectory.length === 0 ? (
            <p className="px-6 py-8 text-sm text-outline text-center">No team members found.</p>
          ) : (
            <table className="ts-table">
              <thead>
                <tr>
                  <th>Member</th><th>Role</th><th>Team Role</th>
                  {/* team role = teamFunctionalRole from backend */}
                </tr>
              </thead>
              <tbody>
                {teamDirectory.map((member, idx) => {
                  const user = member.userId || {};
                  const team = member.teamId || {};
                  const isActive = user.status !== false;
                  return (
                    <tr key={member._id || idx}>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name || '?'} size="36" round={true} />
                          <div>
                            <p className="font-medium text-on-surface">{user.name || '—'}</p>
                            <p className="text-xs text-outline font-mono">{user.email || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="text-sm font-medium capitalize">{user.systemRole || '—'}</span></td>
                      <td><span className="text-sm text-on-surface-variant">{team.teamFunctionalRole || '—'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* System Health & Quick Links */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          {/* System health */}
          <div className="ts-card p-6 flex-1">
            <h2 className="font-headline text-2xl text-on-surface mb-5">System Health</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-on-surface">Task Progress</span>
                  <span className="font-mono text-xs text-primary font-bold">{completedTasks} / {totalTasks}</span>
                </div>
                <div className="ts-progress-track"><div className="ts-progress-fill" style={{ width: `${taskProgress}%` }}></div></div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-on-surface">Completed Tasks</span>
                  <span className="font-mono text-xs text-primary font-bold">{completedTasks}</span>
                </div>
                <div className="ts-progress-track"><div className="ts-progress-fill" style={{ width: `${completedPct}%` }}></div></div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-on-surface">In Progress Tasks</span>
                  <span className="font-mono text-xs text-primary font-bold">{inProgressTasks}</span>
                </div>
                <div className="ts-progress-track"><div className="ts-progress-fill" style={{ width: `${inProgressPct}%` }}></div></div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-on-surface">Pending Tasks</span>
                  <span className="font-mono text-xs text-primary font-bold">{pendingTasks}</span>
                </div>
                <div className="ts-progress-track"><div className="ts-progress-fill" style={{ width: `${pendingPct}%` }}></div></div>
              </div>
            </div>
          </div>
          {/* Quick admin links */}
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/users" className="ts-card p-5 hover:-translate-y-1 transition-all flex flex-col gap-3 cursor-pointer group">
              <span className="material-symbols-outlined text-primary text-2xl">manage_accounts</span>
              <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">User Management</p>
            </Link>
            <Link to="/admin/teams" className="ts-card p-5 hover:-translate-y-1 transition-all flex flex-col gap-3 cursor-pointer group">
              <span className="material-symbols-outlined text-primary text-2xl">hub</span>
              <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Teams</p>
            </Link>
            <Link to="/admin/meetings" className="ts-card p-5 hover:-translate-y-1 transition-all flex flex-col gap-3 cursor-pointer group">
              <span className="material-symbols-outlined text-primary text-2xl">calendar_today</span>
              <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Meetings</p>
            </Link>
            <Link to="/admin/tasks" className="ts-card p-5 hover:-translate-y-1 transition-all flex flex-col gap-3 cursor-pointer group">
              <span className="material-symbols-outlined text-primary text-2xl">assignment</span>
              <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Tasks</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
