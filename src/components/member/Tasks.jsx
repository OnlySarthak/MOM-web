import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';

const API_BASE = 'http://localhost:5000/api';

const STATE_DISPLAY = { in_progress: 'in-progress', pending: 'todo', completed: 'completed' };
// Next state cycle: todo→in-progress→completed→in-progress
const NEXT_STATE = { pending: 'in_progress', in_progress: 'completed', completed: 'in_progress' };

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...opts });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export default function MemberTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, inProgress: 0, todo: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQ, setSearchQ] = useState('');
  const [showSelfAssign, setShowSelfAssign] = useState(false);
  const [selfTaskName, setSelfTaskName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  function loadTasks() {
    setLoading(true);
    apiFetch('/member/tasks')
      .then(res => {
        const list = Array.isArray(res) ? res : (res.tasks || []);
        const total = res.totalTasks ?? list.length;
        const inProgress = res.inProgressTasks ?? list.filter(t => t.state === 'in_progress').length;
        const todo = res.pendingTasks ?? list.filter(t => t.state === 'pending').length;
        const completed = res.completedTasks ?? list.filter(t => t.state === 'completed').length;
        setTasks(list);
        setStats({ total, inProgress, todo, completed });
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadTasks(); }, []);

  const filtered = tasks.filter(t => {
    const uiState = STATE_DISPLAY[t.state] || t.state;
    const matchStatus = statusFilter === 'all' || uiState === statusFilter;
    const matchSearch = !searchQ || (t.title || '').toLowerCase().includes(searchQ.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Cycle task status forward: pending → in_progress → completed → in_progress
  function cycleStatus(taskId, currentState) {
    const nextState = NEXT_STATE[currentState] || 'in_progress';
    // Optimistic UI update
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, state: nextState } : t));
    // No dedicated status-update endpoint in member routes — update optimistically only
    // (backend would need PATCH /member/tasks/:id/status to persist)
  }

  function deleteTask(taskId, title) {
    if (window.confirm(`Delete "${title}"?`)) {
      apiFetch(`/member/tasks/${taskId}`, { method: 'DELETE' })
        .then(() => loadTasks())
        .catch(e => alert('Failed to delete: ' + e.message));
    }
  }

  function startRename(taskId, currentTitle) {
    setRenamingId(taskId);
    setRenameValue(currentTitle);
  }

  function commitRename(taskId) {
    if (renameValue.trim()) {
      // Optimistic UI update
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, title: renameValue.trim() } : t));
      apiFetch(`/member/tasks/rename/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: renameValue.trim() }),
      }).catch(e => { alert('Rename failed: ' + e.message); loadTasks(); });
    }
    setRenamingId(null);
  }

  async function handleSelfAssign(e) {
    e.preventDefault();
    if (!selfTaskName.trim()) return;
    setSubmitting(true);
    try {
      await apiFetch('/member/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle: selfTaskName.trim() }),
      });
      setShowSelfAssign(false);
      setSelfTaskName('');
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
          <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">My Tasks</h1>
          <p className="font-headline italic text-xl text-outline">Your assigned work, at a glance.</p>
        </div>
        <button className="btn-primary gap-2 text-sm" onClick={() => setShowSelfAssign(true)}>
          <span className="material-symbols-outlined">assignment_ind</span>Assign Task to Self
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
        <div className="ts-card p-4 flex items-center gap-4"><div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-primary text-sm">list</span></div><div><p className="font-headline text-4xl font-bold text-on-surface">{stats.total}</p><p className="text-xs text-outline">Total tasks</p></div></div>
        <div className="ts-card p-4 flex items-center gap-4"><div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-primary text-sm">pending_actions</span></div><div><p className="font-headline text-4xl font-bold text-primary">{stats.inProgress}</p><p className="text-xs text-outline">In progress</p></div></div>
        <div className="ts-card p-4 flex items-center gap-4"><div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-on-surface-variant text-sm">radio_button_unchecked</span></div><div><p className="font-headline text-4xl font-bold text-on-surface">{stats.todo}</p><p className="text-xs text-outline">To do</p></div></div>
        <div className="ts-card p-4 flex items-center gap-4"><div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span></div><div><p className="font-headline text-4xl font-bold text-secondary">{stats.completed}</p><p className="text-xs text-outline">Completed</p></div></div>
      </div>

      {/* Tasks Table */}
      <div className="ts-card overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-outline animate-pulse">Loading tasks…</div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-sm text-error">Failed to load tasks: {error}</div>
        ) : (
          <table className="ts-table">
            <thead><tr><th>Task Name</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={3} className="text-center text-outline py-8 text-sm">No tasks found.</td></tr>
              ) : filtered.map((t, idx) => {
                const uiState = STATE_DISPLAY[t.state] || t.state;
                const isRenaming = renamingId === t._id;
                return (
                  <tr key={t._id || idx} className="task-row group">
                    <td>
                      {isRenaming ? (
                        <input
                          className="ts-field py-1 text-sm"
                          value={renameValue}
                          autoFocus
                          onChange={e => setRenameValue(e.target.value)}
                          onBlur={() => commitRename(t._id)}
                          onKeyDown={e => { if (e.key === 'Enter') commitRename(t._id); if (e.key === 'Escape') setRenamingId(null); }}
                        />
                      ) : (
                        <p className={`font-medium text-on-surface ${t.state === 'completed' ? 'line-through opacity-60' : ''}`}>{t.title || '—'}</p>
                      )}
                    </td>
                    <td>
                      {/* Click to cycle status (optimistic update) */}
                      <button
                        className="flex items-center gap-1.5 text-xs font-medium hover:opacity-80 transition-opacity"
                        onClick={() => cycleStatus(t._id, t.state)}
                        title="Click to advance status"
                      >
                        {uiState === 'in-progress'
                          ? <><span className="animate-ping inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>In Progress</>
                          : uiState === 'completed'
                          ? <><span className="material-symbols-outlined text-sm text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span><span className="text-secondary">Completed</span></>
                          : <span className="text-outline">To Do</span>}
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-1.5 text-outline hover:text-primary rounded-lg transition-colors"
                          onClick={() => startRename(t._id, t.title)}
                          title="Rename task"
                        ><span className="material-symbols-outlined text-sm">edit</span></button>
                        <button
                          className="p-1.5 text-outline hover:text-error rounded-lg transition-colors"
                          onClick={() => deleteTask(t._id, t.title)}
                          title="Delete task"
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

      {/* Assign Task to Self Modal */}
      <div className={`ts-modal-overlay ${showSelfAssign ? 'open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setShowSelfAssign(false); }}>
        <div className="ts-modal">
          <div className="ts-modal-header">
            <h2>Assign Task to Self</h2>
            <button className="ts-close-btn" onClick={() => setShowSelfAssign(false)}><span className="material-symbols-outlined">close</span></button>
          </div>
          <div className="ts-modal-body">
            <form id="self-task-form" className="space-y-5" onSubmit={handleSelfAssign}>
              <div>
                <label className="ts-label">Task Name *</label>
                <input
                  className="ts-field"
                  type="text"
                  placeholder="e.g. Review design mockups"
                  required
                  value={selfTaskName}
                  onChange={e => setSelfTaskName(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="ts-modal-footer">
            <button className="btn-secondary text-sm" onClick={() => setShowSelfAssign(false)}>Cancel</button>
            <button className="btn-primary text-sm" disabled={submitting} onClick={() => document.getElementById('self-task-form').requestSubmit()}>
              <span className="material-symbols-outlined text-sm">add</span>{submitting ? 'Assigning…' : 'Assign to Self'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
