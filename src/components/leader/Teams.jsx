import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';

const TEAM_ROLES = ["Developer", "Designer", "QA Engineer", "DevOps", "Product Manager", "Tester",
        "Adviser", "Leader", "Bench", "HR", "Sales", "Marketing", "Leader", "Manager"];

// The leader's own name — used to disable role editing for self
const LEADER_NAME = 'James Parker';

const INIT_MEMBERS = [
  { initials: 'JP', name: 'James Parker', role: 'Team Leader', teamRole: 'Tech Lead', color: 'bg-primary', status: 'Active', isLeader: true },
  { initials: 'SK', name: 'Sara Kim', role: 'UI Designer', teamRole: 'Designer', color: 'bg-secondary', status: 'Active', isLeader: false },
  { initials: 'EV', name: 'Elena Vance', role: 'Brand Lead', teamRole: 'Brand Lead', color: 'bg-tertiary', status: 'Active', isLeader: false },
  { initials: 'RT', name: 'Ryan Torres', role: 'Illustrator', teamRole: 'Illustrator', color: 'bg-outline', status: 'Active', isLeader: false },
  { initials: 'LW', name: 'Lisa Wong', role: 'UX Researcher', teamRole: 'UX Researcher', color: 'bg-primary', status: 'Invited', isLeader: false },
  { initials: 'DM', name: 'Derek Miles', role: 'Motion Designer', teamRole: 'Motion Designer', color: 'bg-secondary', status: 'Active', isLeader: false },
];

const MY_TEAM = {
  name: 'Atelier Alpha', letter: 'Α', dept: 'Design & Brand — Product UI, Design System, Brand Standards', color: 'bg-primary', progress: 84,
  tasks: [
    { name: 'Design System V2 — Component Audit', assignee: 'EV', status: 'in-progress' },
    { name: 'Brand Guidelines Update', assignee: 'SK', status: 'todo' },
    { name: 'Icon Library Expansion', assignee: 'RT', status: 'todo' },
    { name: 'Motion Principles Doc', assignee: 'DM', status: 'completed' },
  ],
  stats: { open: 3, completed: 9, meetings: 6, members: 6 },
};

export default function LeaderTeams() {
  const navigate = useNavigate();
  const [members, setMembers] = useState(INIT_MEMBERS);
  const [editingIdx, setEditingIdx] = useState(null);

  function updateTeamRole(idx, newRole) {
    const updated = [...members];
    updated[idx] = { ...updated[idx], teamRole: newRole };
    setMembers(updated);
    setEditingIdx(null);
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl ${MY_TEAM.color} text-white flex items-center justify-center text-2xl font-bold font-headline shadow-lg`}>{MY_TEAM.letter}</div>
          <div>
            <h1 className="font-headline text-4xl text-on-surface tracking-tight">{MY_TEAM.name}</h1>
            <p className="font-headline italic text-lg text-outline mt-1">{MY_TEAM.dept}</p>
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
                {members.map((m, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={m.name} size="36" round={true} />
                        <div>
                          <span className="font-medium text-on-surface block">{m.name}</span>
                          {m.isLeader && <span className="text-[9px] font-bold uppercase tracking-wider text-primary">Team Lead</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      {editingIdx === i && !m.isLeader ? (
                        <select
                          className="ts-field py-1 text-xs"
                          defaultValue={m.teamRole}
                          autoFocus
                          onChange={e => updateTeamRole(i, e.target.value)}
                          onBlur={e => updateTeamRole(i, e.target.value)}
                        >
                          {TEAM_ROLES.map(r => <option key={r}>{r}</option>)}
                        </select>
                      ) : (
                        <span className="text-xs text-on-surface-variant">{m.teamRole}</span>
                      )}
                    </td>
                    <td>
                      {/* Team lead cannot edit their own role */}
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
                {MY_TEAM.tasks.map((t, i) => (
                  <tr key={i}>
                    <td className={`font-medium ${t.status === 'completed' ? 'line-through opacity-60' : ''}`}>{t.name}</td>
                    <td><Avatar name={t.assignee} size="28" round={true} /></td>
                    <td>
                      {t.status === 'in-progress' ? <span className="flex items-center gap-1.5 text-xs"><span className="animate-ping inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>In Progress</span>
                        : t.status === 'completed' ? <span className="flex items-center gap-1.5 text-xs text-secondary"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>Completed</span>
                        : <span className="text-xs text-outline">To Do</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="ts-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-sm">speed</span></div>
              <h2 className="font-headline text-xl text-on-surface">Sprint Progress</h2>
            </div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase tracking-widest text-outline font-bold">Overall Progress</span>
                <span className="font-mono text-sm text-primary font-bold">{MY_TEAM.progress}%</span>
              </div>
              <div className="ts-progress-track h-3"><div className="ts-progress-fill h-3" style={{ width: `${MY_TEAM.progress}%` }}></div></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="stat-card text-center" style={{ padding: '1rem' }}><p className="font-headline text-2xl font-bold text-primary mb-0.5">{MY_TEAM.stats.open}</p><p className="text-[9px] text-outline uppercase tracking-widest font-mono">Total Tasks</p></div>
              <div className="stat-card text-center" style={{ padding: '1rem' }}><p className="font-headline text-2xl font-bold text-secondary mb-0.5">{MY_TEAM.stats.completed}</p><p className="text-[9px] text-outline uppercase tracking-widest font-mono">Completed</p></div>
              <div className="stat-card text-center" style={{ padding: '1rem' }}><p className="font-headline text-2xl font-bold text-on-surface mb-0.5">{MY_TEAM.stats.meetings}</p><p className="text-[9px] text-outline uppercase tracking-widest font-mono">Task Completion Rate</p></div>
              <div className="stat-card text-center" style={{ padding: '1rem' }}><p className="font-headline text-2xl font-bold text-on-surface mb-0.5">{MY_TEAM.stats.members}</p><p className="text-[9px] text-outline uppercase tracking-widest font-mono">Att. Rate</p></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
