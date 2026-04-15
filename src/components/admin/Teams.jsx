import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';

const TEAMS = [
  { id: 'alpha', name: 'Atelier Alpha', letter: 'Α', dept: 'Design & Brand — Product UI, Design System, Brand Standards', color: 'bg-primary', progress: 84, members: ['JP','SK','EV'], extraMembers: 3, tasks: 12 },
  { id: 'beta', name: 'Studio Beta', letter: 'Β', dept: 'Engineering — Backend, Auth, API, Cloud Infrastructure', color: 'bg-secondary', progress: 61, members: ['DC','JD'], extraMembers: 4, tasks: 19 },
  { id: 'gamma', name: 'Craft Gamma', letter: 'Γ', dept: 'Product — Roadmap, Analytics, Growth, User Research', color: 'bg-tertiary', progress: 92, members: ['MV','AK'], extraMembers: 2, tasks: 8 },
  { id: 'delta', name: 'Nexus Delta', letter: 'Δ', dept: 'Sales & Operations — Pipeline, CRM, Client Success', color: 'bg-inverse-surface', progress: 45, members: ['CJ','LM'], extraMembers: 0, tasks: 15 },
  { id: 'epsilon', name: 'Studio Epsilon', letter: 'Ε', dept: 'Marketing & Content — Campaigns, Content, Social Media', color: 'bg-outline', progress: 78, members: ['NR','PL'], extraMembers: 1, tasks: 11 },
];

const MEMBER_COLORS = {
  JP: 'bg-primary', SK: 'bg-secondary', EV: 'bg-tertiary', DC: 'bg-secondary',
  JD: 'bg-primary', MV: 'bg-tertiary', AK: 'bg-outline', CJ: 'bg-inverse-surface',
  LM: 'bg-secondary', NR: 'bg-outline', PL: 'bg-primary-fixed'
};

const GREEK = ['Ζ','Η','Θ','Ι','Κ','Λ','Μ','Ν','Ξ','Ο'];

export default function AdminTeams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState(TEAMS);
  const [showModal, setShowModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedColor, setSelectedColor] = useState('bg-primary');
  const [greekIdx, setGreekIdx] = useState(0);
  const [form, setForm] = useState({ name: '', dept: '', leader: '', desc: '' });

  function openCreateTeamModal() { setShowModal(true); setSelectedColor('bg-primary'); setForm({ name: '', dept: '', leader: '', desc: '' }); }
  function closeCreateTeamModal() { setShowModal(false); }

  function handleCreateTeam(e) {
    e.preventDefault();
    const newTeam = {
      id: form.name.toLowerCase().replace(/\s+/g, '-'),
      name: form.name,
      letter: GREEK[greekIdx % GREEK.length],
      dept: form.dept || 'General',
      color: selectedColor,
      progress: 0,
      members: form.leader ? [form.leader] : [],
      extraMembers: 0,
      tasks: 0
    };
    setTeams([...teams, newTeam]);
    setGreekIdx(greekIdx + 1);
    closeCreateTeamModal();
  }

  function removeTeam(idx) {
    if (window.confirm(`Remove team "${teams[idx].name}"? This action cannot be undone.`)) {
      const updated = [...teams];
      updated.splice(idx, 1);
      setTeams(updated);
    }
    setOpenDropdown(null);
  }

  function toggleDropdown(idx) {
    setOpenDropdown(openDropdown === idx ? null : idx);
  }

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

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((t, idx) => (
          <div key={t.id} className="ts-card p-6 hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onClick={() => navigate(`/admin/team-info?id=${t.id}`)}>
            <div className="flex items-start justify-between mb-5">
              <div className={`w-12 h-12 rounded-2xl ${t.color} text-white flex items-center justify-center text-lg font-bold font-headline`}>{t.letter}</div>
              <div className="relative">
                <button className="text-outline hover:text-on-surface opacity-0 group-hover:opacity-100 transition-all" onClick={(e) => { e.stopPropagation(); toggleDropdown(idx); }}>
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
                <div className={`ts-dropdown ${openDropdown === idx ? 'open' : ''}`}>
                  <button className="ts-dropdown-item" onClick={(e) => { e.stopPropagation(); navigate(`/admin/team-info?id=${t.id}`); setOpenDropdown(null); }}>
                    <span className="material-symbols-outlined text-sm">visibility</span>View Details
                  </button>
                  <button className="ts-dropdown-item" onClick={(e) => { e.stopPropagation(); setOpenDropdown(null); }}>
                    <span className="material-symbols-outlined text-sm">edit</span>Edit Team
                  </button>
                  <div className="ts-dropdown-sep"></div>
                  <button className="ts-dropdown-item danger" onClick={(e) => { e.stopPropagation(); removeTeam(idx); }}>
                    <span className="material-symbols-outlined text-sm">delete</span>Remove Team
                  </button>
                </div>
              </div>
            </div>
            <h3 className="font-headline text-2xl text-on-surface mb-1">{t.name}</h3>
            <p className="text-xs text-on-surface-variant mb-5">{t.dept}</p>
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase tracking-widest text-outline font-bold">Sprint Progress</span>
                <span className="font-mono text-xs text-primary font-bold">{t.progress}%</span>
              </div>
              <div className="ts-progress-track"><div className="ts-progress-fill" style={{ width: `${t.progress}%` }}></div></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {t.members.map(m => (
                  <Avatar key={m} name={m} size="32" round={true} style={{ marginLeft: '-8px', border: '2px solid white' }} />
                ))}
                {t.extraMembers > 0 && <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold ring-2 ring-white">+{t.extraMembers}</div>}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">assignment</span>
                <span>{t.tasks} tasks</span>
              </div>
            </div>
          </div>
        ))}

        {/* Add Team card */}
        <div className="ts-card p-6 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 hover:border-primary/30 hover:bg-primary/3 transition-all cursor-pointer group" onClick={openCreateTeamModal}>
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
            <span className="material-symbols-outlined text-primary text-3xl">add</span>
          </div>
          <h4 className="font-headline text-2xl text-on-surface mb-2">New Team</h4>
          <p className="text-xs text-outline text-center max-w-[180px]">Create a new squad or department team</p>
        </div>
      </div>

      {/* Create Team Modal */}
      <div className={`ts-modal-overlay ${showModal ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closeCreateTeamModal(); }}>
        <div className="ts-modal">
          <div className="ts-modal-header">
            <h2>Create New Team</h2>
            <button className="ts-close-btn" onClick={closeCreateTeamModal}><span className="material-symbols-outlined">close</span></button>
          </div>
          <div className="ts-modal-body">
            <form id="create-team-form" className="space-y-5" onSubmit={handleCreateTeam}>
              <div>
                <label className="ts-label">Team Name *</label>
                <input className="ts-field" type="text" placeholder="e.g. Atelier Alpha" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="ts-label">Team Leader</label>
                <select className="ts-field" value={form.leader} onChange={e => setForm({ ...form, leader: e.target.value })}>
                  <option value="">Select a leader…</option>
                  <option value="EV">Elena Vance</option>
                  <option value="JT">Julian Thorne</option>
                  <option value="MC">Marcus Chen</option>
                </select>
              </div>
              <div>
                <label className="ts-label">Description</label>
                <textarea className="ts-field resize-none h-20" placeholder="Brief team description…" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}></textarea>
              </div>
            </form>
          </div>
          <div className="ts-modal-footer">
            <button className="btn-secondary text-sm" onClick={closeCreateTeamModal}>Cancel</button>
            <button className="btn-primary text-sm" onClick={() => document.getElementById('create-team-form').requestSubmit()}>
              <span className="material-symbols-outlined text-sm">add</span>Create Team
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
