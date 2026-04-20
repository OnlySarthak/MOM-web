import { useEffect, useState } from 'react';
import Avatar from 'react-avatar';

const API_BASE = 'http://localhost:5000/api';

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// Backend uses 'in_progress' / 'pending' / 'completed'
// UI uses 'in-progress' / 'todo' / 'completed'
const STATE_DISPLAY = {
  in_progress: 'in-progress',
  pending: 'todo',
  completed: 'completed',
};

const STATUS_ENDPOINTS = {
  all: '/admin/tasks',
  'in-progress': '/admin/tasks/in-progress',
  todo: '/admin/tasks/todo',
  completed: '/admin/tasks/completed',
};

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('');
  const [searchQ, setSearchQ] = useState('');

  useEffect(() => {
    setLoading(true);
    const endpoint = STATUS_ENDPOINTS[statusFilter] || STATUS_ENDPOINTS.all;
    apiFetch(endpoint)
      .then(res => setTasks(res.data || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  // Normalize task state to UI display value
  const normalizeState = (state) => STATE_DISPLAY[state] || state;

  const filtered = tasks.filter(t => {
    const matchTeam = !teamFilter || t.teamId?.teamName === teamFilter;
    const matchSearch = !searchQ || (t.title || '').toLowerCase().includes(searchQ.toLowerCase());
    return matchTeam && matchSearch;
  });

  // Unique team names from fetched data
  const teamNames = [...new Set(tasks.map(t => t.teamId?.teamName).filter(Boolean))];

  const total = tasks.length;
  const inProgress = tasks.filter(t => t.state === 'in_progress').length;
  const todo = tasks.filter(t => t.state === 'pending').length;
  const completed = tasks.filter(t => t.state === 'completed').length;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">Tasks</h1>
          <p className="font-headline italic text-xl text-outline">Track, assign, and deliver with precision — by team.</p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span className="text-[10px] uppercase tracking-widest text-outline font-semibold mr-2">Filter:</span>
        {['all', 'in-progress', 'todo', 'completed'].map(f => (
          <button key={f} className={`filter-chip px-4 py-2 rounded-full border border-outline-variant/20 text-sm font-medium transition-all ${statusFilter === f ? 'active' : 'hover:bg-surface-container'}`} onClick={() => setStatusFilter(f)}>
            {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f === 'todo' ? 'To Do' : 'Completed'}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
            <input className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" placeholder="Search tasks..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
          </div>
          <div className="relative">
            <select className="appearance-none pl-4 pr-10 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm cursor-pointer focus:outline-none" value={teamFilter} onChange={e => setTeamFilter(e.target.value)}>
              <option value="">All Teams</option>
              {teamNames.map(name => <option key={name}>{name}</option>)}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-sm">expand_more</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="ts-card p-4 flex items-center gap-4"><div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-primary text-sm">list</span></div><div><p className="font-headline text-4xl font-bold text-on-surface">{total}</p><p className="text-xs text-outline">Total tasks</p></div></div>
        <div className="ts-card p-4 flex items-center gap-4"><div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-primary text-sm">pending_actions</span></div><div><p className="font-headline text-4xl font-bold text-primary">{inProgress}</p><p className="text-xs text-outline">In progress</p></div></div>
        <div className="ts-card p-4 flex items-center gap-4"><div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-on-surface-variant text-sm">radio_button_unchecked</span></div><div><p className="font-headline text-4xl font-bold text-on-surface">{todo}</p><p className="text-xs text-outline">To do</p></div></div>
        <div className="ts-card p-4 flex items-center gap-4"><div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span></div><div><p className="font-headline text-4xl font-bold text-secondary">{completed}</p><p className="text-xs text-outline">Completed</p></div></div>
      </div>

      {/* Table */}
      <div className="ts-card overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-outline animate-pulse">Loading tasks…</div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-sm text-error">Failed to load tasks: {error}</div>
        ) : (
          <table className="ts-table">
            <thead><tr><th>Task Name</th><th>Team</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={3} className="text-center text-outline py-8 text-sm">No tasks found.</td></tr>
              ) : filtered.map((t, idx) => {
                const uiState = normalizeState(t.state);
                const isCompleted = t.state === 'completed';
                return (
                  <tr key={t._id || idx} className="task-row">
                    <td>
                      <div className="flex items-center gap-3">
                        <div>
                          <p className={`font-medium text-on-surface ${isCompleted ? 'line-through opacity-60' : ''}`}>{t.title || '—'}</p>
                        </div>
                      </div>
                    </td>
                    {/* team = teamName from backend */}
                    <td><span className="badge-team">{t.teamId?.teamName || '—'}</span></td>
                    <td>
                      {uiState === 'in-progress'
                        ? <span className="flex items-center gap-1.5 text-xs font-medium"><span className="animate-ping inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>In Progress</span>
                        : uiState === 'completed'
                        ? <span className="flex items-center gap-1.5 text-xs font-medium text-secondary"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>Completed</span>
                        : <span className="text-xs text-outline">To Do</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="text-xs text-outline">Showing {filtered.length} of {tasks.length} tasks</p>
        </div>
      </div>
    </>
  );
}
