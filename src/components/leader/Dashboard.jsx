import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';

const API_BASE = 'http://localhost:5000/api';

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

const STATE_DISPLAY = { in_progress: 'in-progress', pending: 'todo', completed: 'completed' };

export default function LeaderDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch('/leader/dashboard')
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-outline animate-pulse">Loading dashboard…</div>;
  if (error) return <div className="flex items-center justify-center h-64 text-error text-sm">Failed to load dashboard: {error}</div>;

  const teamProgress = data?.teamProgress || {};
  const recentMOM = Array.isArray(data?.recentMOM) ? data.recentMOM : [];
  const recentTasks = Array.isArray(data?.recentTasks) ? data.recentTasks : [];
  const teamMembersTasksDetails = Array.isArray(data?.teamMembersTasksDetails) ? data.teamMembersTasksDetails : [];
  const teamStats = data?.teamStats || {};
  const teamInfo = data?.teamInfo || {};

  // team progress = teamProductivityScore (TeamProductivityScore field in model)
  const progressScore = teamProgress?.TeamProductivityScore ?? teamStats?.TeamProductivityScore ?? 0;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">My Dashboard</h1>
          <p className="font-headline italic text-xl text-outline">Your team's pulse, at a glance.</p>
        </div>
        <div className="flex items-center gap-4 px-5 py-3 bg-surface-container-lower rounded-xl border border-outline-variant/15 ts-card">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-outline font-semibold">Team Progress</p>
            <div className="flex items-center gap-3 mt-1">
              {/* team progress = teamProductivityScore */}
              <p className="font-headline text-2xl font-bold text-primary">{progressScore}%</p>
              <div className="w-24 ts-progress-track"><div className="ts-progress-fill" style={{ width: `${progressScore}%` }}></div></div>
            </div>
          </div>
          <Link to="/leader/meetings" className="btn-primary text-sm">+ Create Meeting</Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-outline-variant/15 mb-8">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''} pb-4 text-sm font-semibold`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab-btn ${activeTab === 'progress' ? 'active' : ''} pb-4 text-sm font-medium text-outline hover:text-on-surface`} onClick={() => setActiveTab('progress')}>Progress Metrics</button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Team Information Card */}
          <div className="ts-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-sm">groups</span>
              </div>
              <h2 className="font-headline text-xl text-on-surface">Team Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Team Name</p>
                <p className="text-sm font-semibold text-on-surface">{teamInfo.teamName || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Project</p>
                <p className="text-sm font-semibold text-on-surface">{teamInfo.project || '—'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Description</p>
                <p className="text-sm text-on-surface-variant">{teamInfo.teamDescription || '—'}</p>
              </div>


            </div>
          </div>
          <div className="grid grid-cols-10 gap-8">
            {/* Recent MOMs */}
            <div className="col-span-10 lg:col-span-4">
              <div className="flex items-baseline justify-between mb-5">
                <h2 className="font-headline text-2xl text-on-surface">Recent MOMs</h2>
                <Link to="/leader/mom-list" className="text-[11px] font-medium text-primary hover:underline">VIEW ALL</Link>
              </div>
              <div className="space-y-4">
                {recentMOM.length === 0 ? (
                  <p className="text-sm text-outline italic">No recent MOMs.</p>
                ) : recentMOM.map((mom, i) => (
                  <article key={mom._id || i} className="ts-card p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-headline text-lg leading-tight text-on-surface">{mom.MeetingTitle || '—'}</h3>
                      <span className="font-mono text-[10px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                        {mom.createdAt ? new Date(mom.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() : '—'}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant italic font-headline opacity-80 mb-4 line-clamp-2">{mom.insights || mom.summary || '—'}</p>
                  </article>
                ))}
              </div>
            </div>

            {/* Team Tasks */}
            <div className="col-span-10 lg:col-span-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-headline text-2xl text-on-surface">Team Tasks</h2>
                <Link to="/leader/tasks" className="btn-secondary text-xs px-3 py-1.5">+ Assign Task</Link>
              </div>
              <div className="ts-card overflow-hidden">
                <table className="ts-table">
                  <thead><tr><th>Task</th><th className="text-center">Assignee</th><th>Status</th></tr></thead>
                  <tbody>
                    {recentTasks.length === 0 ? (
                      <tr><td colSpan={3} className="text-center text-outline py-6 text-sm">No tasks found.</td></tr>
                    ) : recentTasks.map((t, i) => {
                      const uiState = STATE_DISPLAY[t.state] || t.state;
                      return (
                        <tr key={t._id || i} className="cursor-pointer">
                          <td className="font-medium text-on-surface">{t.title || '—'}</td>
                          <td className="text-center">
                            <Avatar name={t.responsibleId || 'User'} size="28" round={true} className="mx-auto" />
                          </td>
                          <td>
                            {uiState === 'in-progress' ? <span className="flex items-center gap-1.5 text-xs"><span className="animate-ping inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>In Progress</span>
                              : uiState === 'completed' ? <span className="flex items-center gap-1.5 text-xs text-secondary"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>Completed</span>
                                : <span className="text-xs text-outline">To Do</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Progress Metrics */}
      {activeTab === 'progress' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              // overall progress = teamProductivityScore
              { label: 'Overall Progress', value: `${progressScore}%`, sub: 'Team productivity score', color: 'text-primary' },
              { label: 'Open Tasks', value: teamStats.pendingTasks ?? '—', sub: 'Pending tasks', color: 'text-on-surface' },
              { label: 'Completed Tasks', value: teamStats.completedTasks ?? '—', sub: 'Total completed', color: 'text-on-surface' },
              { label: 'In Progress', value: teamStats.inProgressTasks ?? '—', sub: 'Currently active', color: 'text-on-surface' },
            ].map((s, i) => (
              <div key={i} className="stat-card text-center">
                <p className="font-mono text-[10px] uppercase tracking-widest text-outline mb-2">{s.label}</p>
                <p className={`font-headline text-5xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-on-surface-variant mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="ts-card p-6">
              <h2 className="font-headline text-2xl text-on-surface mb-5">Team Breakdown</h2>
              <div className="space-y-4">
                {teamMembersTasksDetails.length === 0 ? (
                  <p className="text-sm text-outline italic">No member data available.</p>
                ) : teamMembersTasksDetails.map((m, i) => {
                  const pct = m.totalTasksAssigned > 0 ? Math.round((m.completedTasks / m.totalTasksAssigned) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <Avatar name={m.memberName || 'User'} size="32" round={true} />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-on-surface">{m.memberName}</span>
                          <span className="font-mono text-xs text-primary">{m.completedTasks}/{m.totalTasksAssigned} tasks</span>
                        </div>
                        <div className="ts-progress-track"><div className="ts-progress-fill" style={{ width: `${pct}%` }}></div></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="ts-card p-6">
              <h2 className="font-headline text-2xl text-on-surface mb-5">Status Distribution</h2>
              <div className="space-y-3">
                {[
                  { color: 'bg-primary', label: 'In Progress', value: teamStats.inProgressTasks ?? 0, textColor: 'text-primary' },
                  { color: 'bg-outline-variant', label: 'To Do', value: teamStats.pendingTasks ?? 0, textColor: '' },
                  { color: 'bg-secondary', label: 'Completed', value: teamStats.completedTasks ?? 0, textColor: 'text-secondary' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low">
                    <span className="flex items-center gap-3 text-sm font-medium"><span className={`w-3 h-3 rounded-full ${s.color}`}></span>{s.label}</span>
                    <span className={`font-mono text-sm font-bold ${s.textColor}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
