import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';

const API_BASE = 'http://localhost:5000/api';

const STATE_DISPLAY = { in_progress: 'in-progress', pending: 'todo', completed: 'completed' };

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...opts });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

const TEAM_ROLES = ['Developer', 'Designer', 'QA Engineer', 'DevOps', 'Product Manager',
  'Tester', 'Adviser', 'Bench', 'HR', 'Sales', 'Marketing', 'Manager'];

export default function LeaderTeams() {
  const navigate = useNavigate();
  const [teamData, setTeamData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingIdx, setEditingIdx] = useState(null);

  useEffect(() => { loadData(); }, []);

  function loadData() {
    setLoading(true);
    Promise.all([
      apiFetch('/leader/dashboard'),
      apiFetch('/leader/tasks'),
    ])
      .then(([dash, taskRes]) => {
        setTeamData(dash);
        const list = Array.isArray(taskRes) ? taskRes : (taskRes.tasks || taskRes.data || []);
        setTasks(list.slice(0, 5));
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  async function handleRoleUpdate(memberUserId, newRole) {
    try {
      await apiFetch(`/leader/teams/members/${memberUserId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newRole }),
      });
      // Update local state to reflect change immediately
      setTeamData(prev => ({
        ...prev,
        teamMembersTasksDetails: prev.teamMembersTasksDetails.map(m =>
          m.userId === memberUserId ? { ...m, functionalRole: newRole } : m
        )
      }));
    } catch (err) {
      alert(`Failed to update role: ${err.message}`);
    }
  }


  if (loading) return <div className="flex items-center justify-center h-64 text-outline animate-pulse">Loading team…</div>;
  if (error) return <div className="flex items-center justify-center h-64 text-error text-sm">Failed to load team: {error}</div>;

  // Members from teamMembersTasksDetails
  const members = Array.isArray(teamData?.teamMembersTasksDetails) ? teamData.teamMembersTasksDetails : [];
  const teamStats = teamData?.teamStats || {};
  const teamProgress = teamData?.teamProgress || {};
  const progressScore = teamProgress.TeamProductivityScore ?? teamStats.TeamProductivityScore ?? 0;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold font-headline shadow-lg">Α</div>
          <div>
            <h1 className="font-headline text-4xl text-on-surface tracking-tight">{teamData?.teamInfo?.teamName || 'My Team'}</h1>
            <p className="font-headline italic text-lg text-outline mt-1">{teamData?.teamInfo?.teamFunctionalRole || '—'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Members + Tasks */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Member Roster */}
          <div className="ts-card overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between border-b border-outline-variant/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-sm">groups</span></div>
                <h2 className="font-headline text-xl text-on-surface">Team Members</h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">{members.length} Members</span>
            </div>
            <table className="ts-table">
              <thead><tr><th>Member</th><th>Team Role</th><th></th></tr></thead>
              <tbody>
                {members.length === 0 ? (
                  <tr><td colSpan={3} className="text-center text-outline py-6 text-sm">No members found.</td></tr>
                ) : members.map((m, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={m.memberName || '?'} size="36" round={true} />
                        <div>
                          <span className="font-medium text-on-surface block">{m.memberName || '—'}</span>
                          {m.isLeader && <span className="text-[9px] font-bold uppercase tracking-wider text-primary">Team Lead</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      {editingIdx === i && !m.isLeader ? (
                        <select
                          className="ts-field py-1 text-xs"
                          value={m.functionalRole || 'Member'}
                          autoFocus
                          onChange={e => {
                            handleRoleUpdate(m.userId, e.target.value);
                            setEditingIdx(null);
                          }}
                          onBlur={() => setEditingIdx(null)}
                        >
                          <option value="Member">Member</option>
                          {TEAM_ROLES.filter(r => r !== 'Member').map(r => <option key={r} value={r}>{r}</option>)}
                        </select>

                      ) : (
                        <span className="text-xs text-on-surface-variant">{m.functionalRole || '—'}</span>
                      )}
                    </td>
                    <td>
                      {!m.isLeader && (
                        <button
                          className="p-1 text-outline hover:text-primary rounded-lg transition-colors"
                          title="Edit team role"
                          onClick={() => setEditingIdx(editingIdx === i ? null : i)}
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Team Tasks */}
          <div className="ts-card overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between border-b border-outline-variant/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-sm">assignment</span></div>
                <h2 className="font-headline text-xl text-on-surface">Team Tasks</h2>
              </div>
              <button className="text-xs font-medium text-primary hover:underline" onClick={() => navigate('/leader/tasks')}>View all →</button>
            </div>
            <table className="ts-table">
              <thead><tr><th>Task</th><th>Assignee</th><th>Status</th></tr></thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr><td colSpan={3} className="text-center text-outline py-6 text-sm">No tasks found.</td></tr>
                ) : tasks.map((t, i) => {
                  const uiState = STATE_DISPLAY[t.state] || t.state;
                  return (
                    <tr key={i}>
                      <td className={`font-medium ${t.state === 'completed' ? 'line-through opacity-60' : ''}`}>{t.title || '—'}</td>
                      <td><Avatar name={t.resposibleName || 'User'} size="28" round={true} /></td>
                      <td>
                        {uiState === 'in-progress'
                          ? <span className="flex items-center gap-1.5 text-xs"><span className="animate-ping inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>In Progress</span>
                          : uiState === 'completed'
                          ? <span className="flex items-center gap-1.5 text-xs text-secondary"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>Completed</span>
                          : <span className="text-xs text-outline">To Do</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Stats — using TeamProductivityScore */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="ts-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-sm">speed</span></div>
              <h2 className="font-headline text-xl text-on-surface">Sprint Progress</h2>
            </div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase tracking-widest text-outline font-bold">Overall Progress</span>
                {/* sprint progress = TeamProductivityScore */}
                <span className="font-mono text-sm text-primary font-bold">{progressScore}%</span>
              </div>
              <div className="ts-progress-track h-3"><div className="ts-progress-fill h-3" style={{ width: `${progressScore}%` }}></div></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="stat-card text-center" style={{ padding: '1rem' }}>
                <p className="font-headline text-2xl font-bold text-primary mb-0.5">{teamStats.pendingTasks ?? '—'}</p>
                <p className="text-[9px] text-outline uppercase tracking-widest font-mono">Open Tasks</p>
              </div>
              <div className="stat-card text-center" style={{ padding: '1rem' }}>
                <p className="font-headline text-2xl font-bold text-secondary mb-0.5">{teamStats.completedTasks ?? '—'}</p>
                <p className="text-[9px] text-outline uppercase tracking-widest font-mono">Completed</p>
              </div>
              <div className="stat-card text-center" style={{ padding: '1rem' }}>
                <p className="font-headline text-2xl font-bold text-on-surface mb-0.5">{teamStats.totalTasks ?? '—'}</p>
                <p className="text-[9px] text-outline uppercase tracking-widest font-mono">Total Tasks</p>
              </div>
              <div className="stat-card text-center" style={{ padding: '1rem' }}>
                <p className="font-headline text-2xl font-bold text-on-surface mb-0.5">{members.length}</p>
                <p className="text-[9px] text-outline uppercase tracking-widest font-mono">Members</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
