import { useState } from 'react';
import Avatar from 'react-avatar';

const INIT_TASKS = [
  { name: 'Refactor Auth Middleware', category: 'Engineering · API', team: 'Studio Beta', assignee: 'JD', priority: 'Critical', status: 'in-progress', due: 'Apr 16, 2026' },
  { name: 'Update API Documentation', category: 'Engineering · Docs', team: 'Studio Beta', assignee: 'DC', priority: 'Medium', status: 'todo', due: '—' },
  { name: 'Cloud Security Audit', category: 'Engineering · Security', team: 'Studio Beta', assignee: 'MV', priority: 'High', status: 'completed', due: 'Apr 8, 2026' },
  { name: 'Optimize Asset Pipeline', category: 'DevOps · Performance', team: 'Studio Beta', assignee: 'JD', priority: 'Low', status: 'todo', due: '—' },
  { name: 'Design System V2 — Component Audit', category: 'Design · System', team: 'Atelier Alpha', assignee: 'EV', priority: 'High', status: 'in-progress', due: 'Apr 20, 2026' },
  { name: 'Brand Guidelines Update', category: 'Design · Brand', team: 'Atelier Alpha', assignee: 'DC', priority: 'Medium', status: 'todo', due: '—' },
  { name: 'User Interview Synthesis', category: 'Product · Research', team: 'Craft Gamma', assignee: 'MV', priority: 'Medium', status: 'in-progress', due: 'Apr 22, 2026' },
  { name: 'Pipeline Cleanup Sprint', category: 'Sales · Pipeline', team: 'Nexus Delta', assignee: 'JD', priority: 'High', status: 'in-progress', due: 'Apr 18, 2026' },
  { name: 'Q2 Campaign Launch', category: 'Marketing · Campaign', team: 'Studio Epsilon', assignee: 'EV', priority: 'High', status: 'in-progress', due: 'Apr 20, 2026' },
];

const ASSIGNEE_MAP = {
  JD: { name: 'Jane Doe', color: 'bg-primary' },
  DC: { name: 'David Chen', color: 'bg-secondary' },
  EV: { name: 'Elena Vance', color: 'bg-tertiary' },
  MV: { name: 'Marcus V.', color: 'bg-outline' },
};

export default function AdminTasks() {
  const [tasks, setTasks] = useState(INIT_TASKS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [searchQ, setSearchQ] = useState('');

  const filtered = tasks.filter(t => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchTeam = !teamFilter || t.team === teamFilter;
    const matchAssignee = !assigneeFilter || (ASSIGNEE_MAP[t.assignee]?.name === assigneeFilter);
    const matchSearch = !searchQ || t.name.toLowerCase().includes(searchQ.toLowerCase());
    return matchStatus && matchTeam && matchAssignee && matchSearch;
  });

  const total = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const completed = tasks.filter(t => t.status === 'completed').length;

  function deleteTask(idx) {
    const realIdx = tasks.indexOf(filtered[idx]);
    if (window.confirm(`Delete "${tasks[realIdx].name}"?`)) {
      const updated = [...tasks]; updated.splice(realIdx, 1); setTasks(updated);
    }
  }

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
              <option>Atelier Alpha</option><option>Studio Beta</option><option>Craft Gamma</option><option>Nexus Delta</option><option>Studio Epsilon</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-sm">expand_more</span>
          </div>
          <div className="relative">
            <select className="appearance-none pl-4 pr-10 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm cursor-pointer focus:outline-none" value={assigneeFilter} onChange={e => setAssigneeFilter(e.target.value)}>
              <option value="">All Assignees</option>
              <option>Jane Doe</option><option>David Chen</option><option>Elena Vance</option><option>Marcus V.</option>
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
        <table className="ts-table">
          <thead><tr><th>Task Name</th><th>Team</th><th>Assignee</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filtered.map((t, idx) => {
              const a = ASSIGNEE_MAP[t.assignee] || { name: 'Unassigned', color: 'bg-surface-container-high' };
              const isCompleted = t.status === 'completed';
              return (
                <tr key={idx} className="task-row">
                  <td>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className={`font-medium text-on-surface ${isCompleted ? 'line-through opacity-60' : ''}`}>{t.name}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge-team">{t.team}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={a.name} size="28" round={true} />
                      <span className="text-sm">{a.name}</span>
                    </div>
                  </td>
                  <td>
                    {t.status === 'in-progress'
                      ? <span className="flex items-center gap-1.5 text-xs font-medium"><span className="animate-ping inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>In Progress</span>
                      : t.status === 'completed'
                      ? <span className="flex items-center gap-1.5 text-xs font-medium text-secondary"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>Completed</span>
                      : <span className="text-xs text-outline">To Do</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="text-xs text-outline">Showing {filtered.length} of {tasks.length} tasks</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-outline-variant/15 text-outline hover:bg-surface-container-low transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
            <button className="p-2 rounded-lg border border-outline-variant/15 text-on-surface bg-surface-container-low hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
          </div>
        </div>
      </div>
    </>
  );
}
