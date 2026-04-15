import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';

const INIT_TASKS = [
  { name: 'Refactor Auth Middleware', category: 'Engineering · API', status: 'in-progress' },
  { name: 'Update API Documentation', category: 'Engineering · Docs', status: 'todo' },
  { name: 'Cloud Security Audit', category: 'Engineering · Security', status: 'completed' },
  { name: 'Optimize Asset Pipeline', category: 'DevOps · Performance', status: 'todo' },
];

export default function MemberTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(INIT_TASKS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQ, setSearchQ] = useState('');

  const filtered = tasks.filter(t => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchSearch = !searchQ || t.name.toLowerCase().includes(searchQ.toLowerCase());
    return matchStatus && matchSearch;
  });

  const total = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const completed = tasks.filter(t => t.status === 'completed').length;

  function cycleStatus(idx) {
    const realIdx = tasks.indexOf(filtered[idx]);
    const t = tasks[realIdx];
    // Pending → In Progress → Completed → In Progress
    const newStatus = t.status === 'todo' ? 'in-progress' : t.status === 'in-progress' ? 'completed' : 'in-progress';
    const updated = [...tasks];
    updated[realIdx] = { ...t, status: newStatus };
    setTasks(updated);
  }

  function deleteTask(idx) {
    const realIdx = tasks.indexOf(filtered[idx]);
    if (window.confirm(`Delete "${tasks[realIdx].name}"?`)) {
      const updated = [...tasks];
      updated.splice(realIdx, 1);
      setTasks(updated);
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">My Tasks</h1>
          <p className="font-headline italic text-xl text-outline">Your assigned work, at a glance.</p>
        </div>
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
          <thead><tr><th>Task Name</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filtered.map((t, idx) => {
              const isCompleted = t.status === 'completed';
              return (
                <tr key={idx} className="task-row">
                  <td>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className={`font-medium text-on-surface ${isCompleted ? 'line-through opacity-60' : ''}`}>{t.name}</p>
                        <p className="text-xs text-outline">{t.category}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <button
                      className="flex items-center gap-1.5 text-xs font-medium hover:opacity-80 transition-opacity"
                      onClick={() => cycleStatus(idx)}
                      title="Click to advance status"
                    >
                      {t.status === 'in-progress'
                        ? <><span className="animate-ping inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>In Progress</>
                        : t.status === 'completed'
                        ? <><span className="material-symbols-outlined text-sm text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span><span className="text-secondary">Completed</span></>
                        : <span className="text-outline">To Do</span>}
                    </button>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1.5 text-outline hover:text-error rounded-lg transition-colors"
                        onClick={() => deleteTask(idx)}
                        title="Delete task"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
