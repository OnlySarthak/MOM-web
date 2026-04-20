import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';

const API_BASE = 'http://localhost:5000/api';

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...opts });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

const GREEK = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ'];

export default function AdminTeams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [form, setForm] = useState({ name: '', dept: 'Engineering', projectName: '', leader: '', desc: '' });
  const [leaders, setLeaders] = useState([]);
  const [fetchingLeaders, setFetchingLeaders] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);


  function loadTeams() {
    setLoading(true);
    apiFetch('/admin/teams')
      .then(res => setTeams(res.teams || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  function loadLeaders() {
    setFetchingLeaders(true);
    apiFetch('/admin/lookout/leaders')
      .then(res => {
        if (res.success) setLeaders(res.data || []);
      })
      .catch(e => console.error("Failed to load leaders:", e))
      .finally(() => setFetchingLeaders(false));
  }

  useEffect(() => {
    loadTeams();
    loadLeaders();
  }, []);


  function openCreateTeamModal() {
    setShowModal(true);
    setForm({ name: '', dept: 'Engineering', projectName: '', leader: '', desc: '' });
    setSubmitError(null);
    loadLeaders(); // Refresh leaders when opening modal
  }

  function closeCreateTeamModal() { setShowModal(false); }

  async function handleCreateTeam(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await apiFetch('/admin/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: form.name,
          leaderId: form.leader,
          project: form.projectName,
          teamDescription: form.desc,
          teamFunctionalRole: form.dept,
        }),
      });
      closeCreateTeamModal();
      loadTeams();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const COLORS = ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-inverse-surface', 'bg-outline'];

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">Teams</h1>
          <p className="font-headline italic text-xl text-outline">Your squads, departments, and project groups.</p>
        </div>
        <button className="btn-primary gap-2 text-sm flex-shrink-0" onClick={openCreateTeamModal}>
          <span className="material-symbols-outlined text-sm">add</span>
          Create Team
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-outline animate-pulse">Loading teams…</div>
      ) : error ? (
        <div className="flex items-center justify-center h-64 text-error text-sm">Failed to load teams: {error}</div>
      ) : (
        /* Team Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((t, idx) => {
            const color = COLORS[idx % COLORS.length];
            const letter = GREEK[idx % GREEK.length];
            return (
              <div key={t.id || idx} className="ts-card p-6 hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onClick={() => navigate(`/admin/team-info?id=${t.id}`)}>
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl ${color} text-white flex items-center justify-center text-lg font-bold font-headline`}>{letter}</div>
                  <div className="relative">
                    <button className="text-outline hover:text-on-surface opacity-0 group-hover:opacity-100 transition-all" onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === idx ? null : idx); }}>
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                    <div className={`ts-dropdown ${openDropdown === idx ? 'open' : ''}`}>
                      <button className="ts-dropdown-item" onClick={(e) => { e.stopPropagation(); navigate(`/admin/team-info?id=${t.id}`); setOpenDropdown(null); }}>
                        <span className="material-symbols-outlined text-sm">visibility</span>View Details
                      </button>
                    </div>
                  </div>
                </div>
                <h3 className="font-headline text-2xl text-on-surface mb-1">{t.teamName}</h3>
                <p className="text-xs text-on-surface-variant mb-5">{t.teamFunctionalRole || '—'} — {t.teamDescription || '—'} </p>
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-outline font-bold">Sprint Progress</span>
                    {/* sprint progress = totalProductivityScore (TeamProductivityScore) */}
                    <span className="font-mono text-xs text-primary font-bold">{t.TeamProductivityScore ?? 0}%</span>
                  </div>
                  <div className="ts-progress-track"><div className="ts-progress-fill" style={{ width: `${t.TeamProductivityScore ?? 0}%` }}></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {(t.members || []).slice(0, 3).map((name, mi) => (
                      <Avatar key={mi} name={name} size="32" round={true} style={{ marginLeft: '-8px', border: '2px solid white' }} />
                    ))}
                    {(t.members || []).length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold ring-2 ring-white">+{t.members.length - 3}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">assignment</span>
                    {/* tasks = totalTasksCompleted from backend */}
                    <span>{t.totalTasksCompleted ?? 0} tasks</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Team card */}
          <div className="ts-card p-6 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 hover:border-primary/30 hover:bg-primary/3 transition-all cursor-pointer group" onClick={openCreateTeamModal}>
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-primary text-3xl">add</span>
            </div>
            <h4 className="font-headline text-2xl text-on-surface mb-2">New Team</h4>
            <p className="text-xs text-outline text-center max-w-[180px]">Create a new squad or department team</p>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      <div className={`ts-modal-overlay ${showModal ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closeCreateTeamModal(); }}>
        <div className="ts-modal">
          <div className="ts-modal-header">
            <h2>Create New Team</h2>
            <button className="ts-close-btn" onClick={closeCreateTeamModal}><span className="material-symbols-outlined">close</span></button>
          </div>
          <div className="ts-modal-body">
            <form id="create-team-form" className="space-y-5" onSubmit={handleCreateTeam}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="ts-label">Team Name *</label>
                  <input className="ts-field" type="text" placeholder="e.g. Atelier Alpha" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="ts-label">Project Name</label>
                  <input className="ts-field" type="text" placeholder="e.g. Website Revamp" value={form.projectName} onChange={e => setForm({ ...form, projectName: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="ts-label">Team Functional Role</label>
                <select className="ts-field" value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing & Content">Marketing & Content</option>
                  <option value="Design">Design</option>
                  <option value="Product">Product</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales / Business Development">Sales / Business Development</option>
                  <option value="Research & Strategy">Research & Strategy</option>
                </select>
              </div>
              <div>
                <label className="ts-label">Team Leader *</label>
                <select
                  className="ts-field"
                  required
                  value={form.leader}
                  onChange={e => setForm({ ...form, leader: e.target.value })}
                >
                  <option value="" disabled>Select a leader...</option>
                  {leaders.map(l => (
                    <option key={l._id} value={l._id}>{l.name} ({l.email})</option>
                  ))}
                  {leaders.length === 0 && !fetchingLeaders && (
                    <option disabled>No available leaders found</option>
                  )}
                  {fetchingLeaders && (
                    <option disabled>Loading leaders...</option>
                  )}
                </select>
              </div>

              <div>
                <label className="ts-label">Description</label>
                <textarea className="ts-field resize-none h-20" placeholder="Brief team description…" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}></textarea>
              </div>
              {submitError && <p className="text-xs text-error">{submitError}</p>}
            </form>
          </div>
          <div className="ts-modal-footer">
            <button className="btn-secondary text-sm" onClick={closeCreateTeamModal}>Cancel</button>
            <button className="btn-primary text-sm" disabled={submitting} onClick={() => document.getElementById('create-team-form').requestSubmit()}>
              <span className="material-symbols-outlined text-sm">add</span>{submitting ? 'Creating…' : 'Create Team'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
