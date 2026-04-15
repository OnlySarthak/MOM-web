import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INIT_TASKS = [
  { name: 'Refactor Auth Middleware', category: 'Engineering · API', team: 'My Team', assignee: 'JD', priority: 'Critical', status: 'in-progress', due: 'Apr 16, 2026' },
  { name: 'Update API Documentation', category: 'Engineering · Docs', team: 'My Team', assignee: 'DC', priority: 'Medium', status: 'todo', due: '—' },
  { name: 'Cloud Security Audit', category: 'Engineering · Security', team: 'My Team', assignee: 'MV', priority: 'High', status: 'completed', due: 'Apr 8, 2026' },
  { name: 'Optimize Asset Pipeline', category: 'DevOps · Performance', team: 'My Team', assignee: 'JD', priority: 'Low', status: 'todo', due: '—' },
  { name: 'Design System V2 — Component Audit', category: 'Design · System', team: 'My Team', assignee: 'EV', priority: 'High', status: 'in-progress', due: 'Apr 20, 2026' },
];

const ASSIGNEE_MAP = {
  JD: { name: 'Jane Doe', color: 'bg-primary' },
  DC: { name: 'David Chen', color: 'bg-secondary' },
  EV: { name: 'Elena Vance', color: 'bg-tertiary' },
  MV: { name: 'Marcus V.', color: 'bg-outline' },
};

const PRIORITY_CLASS = { Critical: 'badge-critical', High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' };

export default function LeaderTasks() {
  const [tasks, setTasks] = useState(INIT_TASKS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQ, setSearchQ] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', assignee: '', priority: 'Medium', due: '' });

  const filtered = tasks.filter(t => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchSearch = !searchQ || t.name.toLowerCase().includes(searchQ.toLowerCase());
    return matchStatus && matchSearch;
  });

  const total = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const completed = tasks.filter(t => t.status === 'completed').length;

  function deleteTask(idx) {
    const realIdx = tasks.indexOf(filtered[idx]);
    if (window.confirm(`Delete "${tasks[realIdx].name}"?`)) { const u = [...tasks]; u.splice(realIdx, 1); setTasks(u); }
  }

  function handleNewTask(e) {
    e.preventDefault();
    const due = form.due ? new Date(form.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
    setTasks([{ ...form, category: form.category || 'General', team: 'My Team', due, status: 'todo' }, ...tasks]);
    setShowModal(false);
    setForm({ name: '', category: '', assignee: '', priority: 'Medium', due: '' });
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">Tasks</h1>
          <p className="font-headline italic text-xl text-outline">Track, assign, and deliver with precision.</p>
        </div>
        <button className="btn-primary gap-2 text-sm" onClick={() => setShowModal(true)}><span className="material-symbols-outlined">add</span>Assign Task</button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span className="text-[10px] uppercase tracking-widest text-outline font-semibold mr-2">Filter:</span>
        {['all','in-progress','todo','completed'].map(f => (
          <button key={f} className={`filter-chip px-4 py-2 rounded-full border border-outline-variant/20 text-sm font-medium transition-all ${statusFilter === f ? 'active' : 'hover:bg-surface-container'}`} onClick={() => setStatusFilter(f)}>
            {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f === 'todo' ? 'To Do' : 'Completed'}
          </button>
        ))}
        <div className="ml-auto">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
            <input className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary" placeholder="Search tasks..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="ts-card p-4 flex items-center gap-4"><div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-primary text-sm">list</span></div><div><p className="font-headline text-4xl font-bold text-on-surface">{total}</p><p className="text-xs text-outline">Total tasks</p></div></div>
        <div className="ts-card p-4 flex items-center gap-4"><div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-primary text-sm">pending_actions</span></div><div><p className="font-headline text-4xl font-bold text-primary">{inProgress}</p><p className="text-xs text-outline">In progress</p></div></div>
        <div className="ts-card p-4 flex items-center gap-4"><div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-on-surface-variant text-sm">radio_button_unchecked</span></div><div><p className="font-headline text-4xl font-bold text-on-surface">{todo}</p><p className="text-xs text-outline">To do</p></div></div>
        <div className="ts-card p-4 flex items-center gap-4"><div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span></div><div><p className="font-headline text-4xl font-bold text-secondary">{completed}</p><p className="text-xs text-outline">Completed</p></div></div>
      </div>

      <div className="ts-card overflow-hidden">
        <table className="ts-table">
          <thead><tr><th>Task Name</th><th>Assignee</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filtered.map((t, idx) => {
              const a = ASSIGNEE_MAP[t.assignee] || { name: 'Unassigned', color: 'bg-surface-container-high' };
              const isCompleted = t.status === 'completed';
              return (
                <tr key={idx} className="task-row">
                  <td>
                    <div className="flex items-center gap-3">
                      <div><p className={`font-medium text-on-surface ${isCompleted ? 'line-through opacity-60' : ''}`}>{t.name}</p><p className="text-xs text-outline">{t.category}</p></div>
                    </div>
                  </td>
                  <td><div className="flex items-center gap-2"><div className={`w-7 h-7 rounded-full ${a.color} text-white text-[9px] font-bold flex items-center justify-center`}>{t.assignee}</div><span className="text-sm">{a.name}</span></div></td>
                  <td>{t.status === 'in-progress' ? <span className="flex items-center gap-1.5 text-xs"><span className="animate-ping inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>In Progress</span> : t.status === 'completed' ? <span className="flex items-center gap-1.5 text-xs text-secondary"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>Completed</span> : <span className="text-xs text-outline">To Do</span>}</td>
                  <td className="task-actions"><div className="flex items-center gap-1">
                    <button className="p-1.5 text-outline hover:text-primary rounded-lg"><span className="material-symbols-outlined text-sm">edit</span></button>
                    <button className="p-1.5 text-outline hover:text-error rounded-lg" onClick={() => deleteTask(idx)}><span className="material-symbols-outlined text-sm">delete</span></button>
                  </div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={`ts-modal-overlay ${showModal ? 'open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
        <div className="ts-modal">
          <div className="ts-modal-header"><h2>Assign Task</h2><button className="ts-close-btn" onClick={() => setShowModal(false)}><span className="material-symbols-outlined">close</span></button></div>
          <div className="ts-modal-body">
            <form id="leader-task-form" className="space-y-5" onSubmit={handleNewTask}>
              <div><label className="ts-label">Task Name *</label><input className="ts-field" type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div><label className="ts-label">Category</label><input className="ts-field" type="text" placeholder="e.g. Engineering · API" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="ts-label">Assignee</label>
                  <select className="ts-field" value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })}>
                    <option value="">Unassigned</option><option value="JD">Jane Doe</option><option value="DC">David Chen</option><option value="EV">Elena Vance</option><option value="MV">Marcus V.</option>
                  </select>
                </div>
                <div><label className="ts-label">Priority</label>
                  <select className="ts-field" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    <option>Medium</option><option>Critical</option><option>High</option><option>Low</option>
                  </select>
                </div>
              </div>
              <div><label className="ts-label">Due Date</label><input className="ts-field" type="date" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} /></div>
            </form>
          </div>
          <div className="ts-modal-footer">
            <button className="btn-secondary text-sm" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn-primary text-sm" onClick={() => document.getElementById('leader-task-form').requestSubmit()}><span className="material-symbols-outlined text-sm">add</span>Assign Task</button>
          </div>
        </div>
      </div>
    </>
  );
}
