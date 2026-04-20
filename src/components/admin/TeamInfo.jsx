import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import Avatar from 'react-avatar';

const API_BASE = 'http://localhost:5000/api';

const STATE_DISPLAY = { in_progress: 'In Progress', pending: 'To Do', completed: 'Completed' };

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...opts });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export default function AdminTeamInfo() {
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('id');

  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showAddMember, setShowAddMember] = useState(false);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [fetchingMembers, setFetchingMembers] = useState(false);
  const [addMemberForm, setAddMemberForm] = useState({ userId: '' });

  const [showReplace, setShowReplace] = useState(false);
  const [availableLeaders, setAvailableLeaders] = useState([]);
  const [fetchingLeaders, setFetchingLeaders] = useState(false);
  const [replaceLeaderId, setReplaceLeaderId] = useState('');

  const [submitting, setSubmitting] = useState(false);

  function loadTeam() {
    if (!teamId) { setLoading(false); return; }
    apiFetch(`/admin/teams/${teamId}`)
      .then(res => setTeamData(res.data || res))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  function loadAvailableMembers() {
    setFetchingMembers(true);
    apiFetch('/admin/lookout/members')
      .then(res => { if (res.success) setAvailableMembers(res.data || []); })
      .catch(e => console.error("Failed to load members:", e))
      .finally(() => setFetchingMembers(false));
  }

  function loadAvailableLeaders() {
    setFetchingLeaders(true);
    apiFetch('/admin/lookout/leaders')
      .then(res => { if (res.success) setAvailableLeaders(res.data || []); })
      .catch(e => console.error("Failed to load leaders:", e))
      .finally(() => setFetchingLeaders(false));
  }

  useEffect(() => { loadTeam(); }, [teamId]);

  // Load candidates when modals open
  useEffect(() => { if (showAddMember) loadAvailableMembers(); }, [showAddMember]);
  useEffect(() => { if (showReplace) loadAvailableLeaders(); }, [showReplace]);

  async function handleAddMember(e) {
    e.preventDefault();
    if (!addMemberForm.userId) return;
    setSubmitting(true);
    try {
      await apiFetch(`/admin/teams/${teamId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: addMemberForm.userId, systemRole: 'member' }),
      });
      setShowAddMember(false);
      setAddMemberForm({ userId: '' });
      loadTeam();
    } catch (err) {
      alert('Failed to add member: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemoveMember(memberId, memberName) {
    if (!window.confirm(`Remove ${memberName}?`)) return;
    try {
      await apiFetch(`/admin/teams/${teamId}/members/${memberId}`, { method: 'DELETE' });
      loadTeam();
    } catch (err) {
      alert('Failed to remove member: ' + err.message);
    }
  }

  async function handleReplaceLeader(e) {
    e.preventDefault();
    if (!replaceLeaderId) return;
    setSubmitting(true);
    try {
      await apiFetch(`/admin/teams/${teamId}/leader`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newLeaderId: replaceLeaderId }),
      });
      setShowReplace(false);
      setReplaceLeaderId('');
      loadTeam();
    } catch (err) {
      alert('Failed to replace leader: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }


  if (loading) return <div className="flex items-center justify-center h-64 text-outline animate-pulse">Loading team…</div>;


  if (error) return <div className="flex items-center justify-center h-64 text-error text-sm">Failed to load team: {error}</div>;
  if (!teamData) return (
    <>
      <Link to="/admin/teams" className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:-translate-x-1 transition-transform mb-8">
        <span className="material-symbols-outlined text-sm">arrow_back</span>Back to Teams
      </Link>
      <div className="flex items-center justify-center h-64 text-outline text-sm">No team ID provided — navigate from the Teams list.</div>
    </>
  );

  const members = Array.isArray(teamData.members) ? teamData.members : [];
  const tasks = Array.isArray(teamData.tasks) ? teamData.tasks : [];
  const meetings = Array.isArray(teamData.meetings) ? teamData.meetings : [];
  const stats = teamData.stats || {};
  const progress = teamData.TeamProductivityScore ?? teamData.progress ?? 0;

  // Derive first letter for avatar from team name
  const teamLetter = (teamData.name || teamData.teamName || 'T')[0].toUpperCase();
  const teamName = teamData.name || teamData.teamName || '—';
  const teamDept = teamData.teamFunctionalRole || teamData.dept || '—';

  return (
    <>
      {/* Back breadcrumb */}
      <Link to="/admin/teams" className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:-translate-x-1 transition-transform mb-8">
        <span className="material-symbols-outlined text-sm">arrow_back</span>Back to Teams
      </Link>

      {/* Team Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold font-headline shadow-lg">{teamLetter}</div>
          <div>
            <h1 className="font-headline text-4xl text-on-surface tracking-tight">{teamName}</h1>
            <p className="font-headline italic text-lg text-outline mt-1">{teamDept}</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
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
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">{members.length} Members</span>
                <button className="btn-primary text-xs gap-1.5 py-1.5 px-3" onClick={() => setShowAddMember(true)}>
                  <span className="material-symbols-outlined text-sm">person_add</span>Add Member
                </button>
              </div>
            </div>
            <table className="ts-table">
              <thead><tr><th>Member</th><th>Team Role</th><th>Email</th><th>Actions</th></tr></thead>
              <tbody>
                {members.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-outline py-6 text-sm">No members found.</td></tr>
                ) : members.map((m, i) => {
                  const memberName = m.name || '—';
                  const memberEmail = m.email || '—';
                  const memberId = m.id;
                  return (
                    <tr key={i} className="group">

                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar name={memberName} size="36" round={true} />
                          <div>
                            <span className="font-medium text-on-surface block">{memberName}</span>
                            {m.isLeader && <span className="text-[9px] font-bold uppercase tracking-wider text-primary">Team Lead</span>}
                          </div>
                        </div>
                      </td>
                      <td><span className="text-xs text-on-surface-variant">{m.functionalRole || '—'}</span></td>
                      <td><span className="text-xs font-mono text-outline">{memberEmail}</span></td>
                      <td>
                        {m.isLeader ? (
                          <button className="text-xs font-medium text-primary hover:underline" onClick={() => setShowReplace(true)}>Replace Leader</button>
                        ) : (
                          <button className="text-xs font-medium text-error hover:underline" onClick={() => handleRemoveMember(memberId, memberName)}>Remove</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
              <Link to="/admin/tasks" className="text-xs font-medium text-primary hover:underline">View all →</Link>
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
                        {uiState === 'In Progress'
                          ? <span className="flex items-center gap-1.5 text-xs font-medium"><span className="animate-ping inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>In Progress</span>
                          : uiState === 'Completed'
                          ? <span className="flex items-center gap-1.5 text-xs font-medium text-secondary"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>Completed</span>
                          : <span className="text-xs text-outline">To Do</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Stats + Meetings */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Sprint Stats — TeamProductivityScore from API */}
          <div className="ts-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-sm">speed</span></div>
              <h2 className="font-headline text-xl text-on-surface">Sprint Progress</h2>
            </div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase tracking-widest text-outline font-bold">Overall Progress</span>
                <span className="font-mono text-sm text-primary font-bold">{progress}%</span>
              </div>
              <div className="ts-progress-track h-3"><div className="ts-progress-fill h-3" style={{ width: `${progress}%` }}></div></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="stat-card text-center" style={{ padding: '1rem' }}><p className="font-headline text-2xl font-bold text-primary mb-0.5">{stats.pendingTasks ?? stats.open ?? '—'}</p><p className="text-[9px] text-outline uppercase tracking-widest font-mono">Open Tasks</p></div>
              <div className="stat-card text-center" style={{ padding: '1rem' }}><p className="font-headline text-2xl font-bold text-secondary mb-0.5">{stats.completedTasks ?? stats.completed ?? '—'}</p><p className="text-[9px] text-outline uppercase tracking-widest font-mono">Completed</p></div>
              <div className="stat-card text-center" style={{ padding: '1rem' }}><p className="font-headline text-2xl font-bold text-on-surface mb-0.5">{stats.totalMeetings ?? meetings.length}</p><p className="text-[9px] text-outline uppercase tracking-widest font-mono">Meetings</p></div>
              <div className="stat-card text-center" style={{ padding: '1rem' }}><p className="font-headline text-2xl font-bold text-on-surface mb-0.5">{members.length}</p><p className="text-[9px] text-outline uppercase tracking-widest font-mono">Members</p></div>
            </div>
          </div>

          {/* Recent Meetings */}
          <div className="ts-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-sm">calendar_today</span></div>
              <h2 className="font-headline text-xl text-on-surface">Recent Meetings</h2>
            </div>
            <div className="space-y-4">
              {meetings.length === 0 ? (
                <p className="text-sm text-outline italic">No meetings found.</p>
              ) : meetings.map((m, i) => {
                const displayDate = m.meetingDate
                  ? new Date(m.meetingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—';
                return (
                  <Link key={i} to={`/admin/meeting-detail?id=${m._id}`} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors">
                    <div>
                      <p className="text-sm font-medium text-on-surface">{m.title || '—'}</p>
                      <p className="text-[10px] font-mono text-outline mt-0.5">{displayDate}</p>
                    </div>
                    <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <div className={`ts-modal-overlay ${showAddMember ? 'open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setShowAddMember(false); }}>
        <div className="ts-modal">
          <div className="ts-modal-header"><h2>Add Member</h2><button className="ts-close-btn" onClick={() => setShowAddMember(false)}><span className="material-symbols-outlined">close</span></button></div>
          <div className="ts-modal-body">
            <form id="add-member-form" className="space-y-5" onSubmit={handleAddMember}>
              <div>
                <label className="ts-label">Select User *</label>
                <select 
                  className="ts-field" 
                  required 
                  value={addMemberForm.userId} 
                  onChange={e => setAddMemberForm({ userId: e.target.value })}
                >
                  <option value="" disabled>Choose an available member...</option>
                  {availableMembers.map(m => (
                    <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                  ))}
                  {availableMembers.length === 0 && !fetchingMembers && (
                    <option disabled>No available members found</option>
                  )}
                  {fetchingMembers && (
                    <option disabled>Loading members...</option>
                  )}
                </select>
              </div>

            </form>
          </div>
          <div className="ts-modal-footer">
            <button className="btn-secondary text-sm" onClick={() => setShowAddMember(false)}>Cancel</button>
            <button className="btn-primary text-sm" disabled={submitting} onClick={() => document.getElementById('add-member-form').requestSubmit()}>
              <span className="material-symbols-outlined text-sm">person_add</span>{submitting ? 'Adding…' : 'Add Member'}
            </button>
          </div>
        </div>
      </div>

      {/* Replace Leader Modal */}
      <div className={`ts-modal-overlay ${showReplace ? 'open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setShowReplace(false); }}>
        <div className="ts-modal">
          <div className="ts-modal-header"><h2>Replace Team Leader</h2><button className="ts-close-btn" onClick={() => setShowReplace(false)}><span className="material-symbols-outlined">close</span></button></div>
          <div className="ts-modal-body">
            <form id="replace-leader-form" className="space-y-5" onSubmit={handleReplaceLeader}>
              <div>
                <label className="ts-label">Select New Leader *</label>
                <select 
                  className="ts-field" 
                  required 
                  value={replaceLeaderId} 
                  onChange={e => setReplaceLeaderId(e.target.value)}
                >
                  <option value="" disabled>Choose a leader candidate...</option>
                  {availableLeaders.map(l => (
                    <option key={l._id} value={l._id}>{l.name} ({l.email})</option>
                  ))}
                  {availableLeaders.length === 0 && !fetchingLeaders && (
                    <option disabled>No available leaders found</option>
                  )}
                  {fetchingLeaders && (
                    <option disabled>Loading leaders...</option>
                  )}
                </select>
              </div>

            </form>
          </div>
          <div className="ts-modal-footer">
            <button className="btn-secondary text-sm" onClick={() => setShowReplace(false)}>Cancel</button>
            <button className="btn-primary text-sm" onClick={() => document.getElementById('replace-leader-form').requestSubmit()}>
              <span className="material-symbols-outlined text-sm">swap_horiz</span>Replace Leader
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
