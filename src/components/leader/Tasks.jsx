import { useEffect, useState } from 'react';
import Avatar from 'react-avatar';

const API_BASE = 'http://localhost:5000/api';

const STATE_DISPLAY = { in_progress: 'in-progress', pending: 'todo', completed: 'completed' };
// Reverse map for sending to API (backend uses underscore format)
const STATE_BACKEND = { 'todo': 'pending', 'in-progress': 'in_progress', 'completed': 'completed' };

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...opts });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export default function LeaderTasks() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ totalTasks: 0, inProgress: 0, todo: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQ, setSearchQ] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', responsibleId: '' });
  const [teamMembers, setTeamMembers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [memberFilter, setMemberFilter] = useState('all');

  function loadTasks() {
    setLoading(true);
    const query = memberFilter !== 'all' ? `?memberId=${memberFilter}` : '';
    apiFetch(`/leader/tasks${query}`)
      .then(res => {
        const list = Array.isArray(res) ? res : (res.tasks || res.data || []);
        setTasks(list);
        setStats({
          totalTasks: list.length,
          inProgress: list.filter(t => t.state === 'in_progress').length,
          todo: list.filter(t => t.state === 'pending').length,
          completed: list.filter(t => t.state === 'completed').length,
        });
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadTasks();
  }, [memberFilter]);

  useEffect(() => {
    // Load team members for assign dropdown and member filter
    apiFetch('/leader/tasks/lookout/team-members')
      .then(res => setTeamMembers(Array.isArray(res) ? res : (res.data || [])))
      .catch(() => {});
  }, []);

  const filtered = tasks.filter(t => {
    const uiState = STATE_DISPLAY[t.state] || t.state;
    const matchStatus = statusFilter === 'all' || uiState === statusFilter;
    const matchSearch = !searchQ || (t.title || '').toLowerCase().includes(searchQ.toLowerCase());
    return matchStatus && matchSearch;
  });

  function deleteTask(id, title) {
    if (window.confirm(`Delete "${title}"?`)) {
      apiFetch(`/leader/tasks/${id}`, { method: 'DELETE' })
        .then(() => loadTasks())
        .catch(e => alert('Failed to delete: ' + e.message));
    }
  }

  async function handleAssignTask(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch('/leader/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle: form.title, assignedToId: form.responsibleId }),
      });
      setShowModal(false);
      setForm({ title: '', responsibleId: '' });
      loadTasks();
    } catch (err) {
      alert('Failed to assign task: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">Tasks</h1>
          <p className="font-headline italic text-xl text-outline">Track, assign, and deliver with precision.</p>
        </div>
        <button className="btn-primary gap-2 text-sm" onClick={() => setShowModal(true)}>
          <span className="material-symbols-outlined">add</span>Assign Task
        </button>
      </div>

      {/* Status filter chips */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span className="text-[10px] uppercase tracking-widest text-outline font-semibold mr-2">Filter:</span>
        {['all', 'in-progress', 'todo', 'completed'].map(f => (
          <button
            key={f}
            className={`filter-chip px-4 py-2 rounded-full border border-outline-variant/20 text-sm font-medium transition-all ${statusFilter === f ? 'active' : 'hover:bg-surface-container'}`}
            onClick={() => setStatusFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f === 'todo' ? 'To Do' : 'Completed'}
          </button>
        ))}
        
        {/* Member Filter Dropdown */}
        <select 
          className="ml-4 pl-4 pr-10 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
          value={memberFilter}
          onChange={e => setMemberFilter(e.target.value)}
        >
          <option value="all">All Members</option>
          {teamMembers.map(m => (
             m.userId && <option key={m.userId._id} value={m.userId._id}>{m.userId.name}</option>
          ))}
        </select>

        <div className="ml-auto">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
            <input
              className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary"
              placeholder="Search tasks..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="ts-card p-4 flex items-center gap-4"><div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-primary text-sm">list</span></div><div><p className="font-headline text-4xl font-bold text-on-surface">{stats.totalTasks}</p><p className="text-xs text-outline">Total tasks</p></div></div>
        <div className="ts-card p-4 flex items-center gap-4"><div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-primary text-sm">pending_actions</span></div><div><p className="font-headline text-4xl font-bold text-primary">{stats.inProgress}</p><p className="text-xs text-outline">In progress</p></div></div>
        <div className="ts-card p-4 flex items-center gap-4"><div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-on-surface-variant text-sm">radio_button_unchecked</span></div><div><p className="font-headline text-4xl font-bold text-on-surface">{stats.todo}</p><p className="text-xs text-outline">To do</p></div></div>
        <div className="ts-card p-4 flex items-center gap-4"><div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span></div><div><p className="font-headline text-4xl font-bold text-secondary">{stats.completed}</p><p className="text-xs text-outline">Completed</p></div></div>
      </div>

      {/* Table */}
      <div className="ts-card overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-outline animate-pulse">Loading tasks…</div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-sm text-error">Failed to load tasks: {error}</div>
        ) : (
          <table className="ts-table">
            <thead><tr><th>Task Name</th><th>Assignee</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center text-outline py-8 text-sm">No tasks found.</td></tr>
              ) : filtered.map((t, idx) => {
                const uiState = STATE_DISPLAY[t.state] || t.state;
                const isCompleted = t.state === 'completed';
                return (
                  <tr key={t._id || idx} className="task-row">
                    <td>
                      <p className={`font-medium text-on-surface ${isCompleted ? 'line-through opacity-60' : ''}`}>{t.title || '—'}</p>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={t.resposibleName || t.responsibleId || 'User'} size="28" round={true} />
                        <span className="text-sm">{t.resposibleName || '—'}</span>
                      </div>
                    </td>
                    <td>
                      {uiState === 'in-progress'
                        ? <span className="flex items-center gap-1.5 text-xs"><span className="animate-ping inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>In Progress</span>
                        : uiState === 'completed'
                        ? <span className="flex items-center gap-1.5 text-xs text-secondary"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>Completed</span>
                        : <span className="text-xs text-outline">To Do</span>}
                    </td>
                    <td className="task-actions">
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1.5 text-outline hover:text-error rounded-lg"
                          onClick={() => deleteTask(t._id, t.title)}
                        ><span className="material-symbols-outlined text-sm">delete</span></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Assign Task Modal */}
      <div className={`ts-modal-overlay ${showModal ? 'open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
        <div className="ts-modal">
          <div className="ts-modal-header"><h2>Assign Task</h2><button className="ts-close-btn" onClick={() => setShowModal(false)}><span className="material-symbols-outlined">close</span></button></div>
          <div className="ts-modal-body">
            <form id="leader-task-form" className="space-y-5" onSubmit={handleAssignTask}>
              <div>
                <label className="ts-label">Task Title *</label>
                <input className="ts-field" type="text" placeholder="e.g. Refactor Auth Middleware" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="ts-label">Assignee (Team Member)</label>
                {/* Assignee must be a non-leader team member */}
                <select className="ts-field" value={form.responsibleId} onChange={e => setForm({ ...form, responsibleId: e.target.value })}>
                  <option value="">Select member…</option>
                  {teamMembers.map(m => (
                    <option key={m.userId?._id || m._id} value={m.userId?._id || m._id}>
                      {m.userId?.name || 'Unknown Member'}
                    </option>
                  ))}

                </select>
              </div>
            </form>
          </div>
          <div className="ts-modal-footer">
            <button className="btn-secondary text-sm" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn-primary text-sm" disabled={submitting} onClick={() => document.getElementById('leader-task-form').requestSubmit()}>
              <span className="material-symbols-outlined text-sm">add</span>{submitting ? 'Assigning…' : 'Assign Task'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
