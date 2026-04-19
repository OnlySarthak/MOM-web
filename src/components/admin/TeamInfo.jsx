import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import Avatar from 'react-avatar';

const TEAM_DATA = {
  alpha: {
    name: 'Atelier Alpha', letter: 'Α', dept: 'Design & Brand', color: 'bg-primary', progress: 84,
    members: [
      { initials: 'JP', name: 'James Parker', role: 'Team Leader', email: 'j.parker@teamsync.io', status: 'Active', color: 'bg-primary', isLeader: true },
      { initials: 'SK', name: 'Sara Kim', role: 'UI Designer', email: 's.kim@teamsync.io', status: 'Active', color: 'bg-secondary', isLeader: false },
      { initials: 'EV', name: 'Elena Vance', role: 'Brand Lead', email: 'e.vance@teamsync.io', status: 'Active', color: 'bg-tertiary', isLeader: false },
      { initials: 'RT', name: 'Ryan Torres', role: 'Illustrator', email: 'r.torres@teamsync.io', status: 'Active', color: 'bg-outline', isLeader: false },
      { initials: 'LW', name: 'Lisa Wong', role: 'UX Researcher', email: 'l.wong@teamsync.io', status: 'Invited', color: 'bg-primary', isLeader: false },
      { initials: 'DM', name: 'Derek Miles', role: 'Motion Designer', email: 'd.miles@teamsync.io', status: 'Active', color: 'bg-secondary', isLeader: false },
    ],
    tasks: [
      { name: 'Design System V2 — Component Audit', assignee: 'EV', status: 'In Progress' },
      { name: 'Brand Guidelines Update', assignee: 'SK', status: 'To Do' },
      { name: 'Icon Library Expansion', assignee: 'RT', status: 'To Do' },
      { name: 'Motion Principles Doc', assignee: 'DM', status: 'Completed' },
    ],
    stats: { open: 3, completed: 9, meetings: 6, members: 6 },
    meetings: [
      { title: 'Sprint Review #12', date: 'Apr 12, 2026' },
      { title: 'Design Critique Session', date: 'Apr 14, 2026' },
      { title: 'Brand Alignment Sync', date: 'Apr 18, 2026' },
    ]
  },
  beta: {
    name: 'Studio Beta', letter: 'Β', dept: 'Engineering', color: 'bg-secondary', progress: 61,
    members: [
      { initials: 'DC', name: 'David Chen', role: 'Tech Lead', email: 'd.chen@teamsync.io', status: 'Active', color: 'bg-secondary', isLeader: true },
      { initials: 'JD', name: 'Jane Doe', role: 'Backend Dev', email: 'j.doe@teamsync.io', status: 'Active', color: 'bg-primary', isLeader: false },
      { initials: 'AP', name: 'Alex Park', role: 'DevOps', email: 'a.park@teamsync.io', status: 'Active', color: 'bg-outline', isLeader: false },
      { initials: 'KR', name: 'Kim Reyes', role: 'API Engineer', email: 'k.reyes@teamsync.io', status: 'Active', color: 'bg-tertiary', isLeader: false },
      { initials: 'NO', name: 'Nina Ortiz', role: 'QA Engineer', email: 'n.ortiz@teamsync.io', status: 'Active', color: 'bg-secondary', isLeader: false },
      { initials: 'TL', name: 'Tom Lee', role: 'SRE', email: 't.lee@teamsync.io', status: 'Active', color: 'bg-primary', isLeader: false },
    ],
    tasks: [
      { name: 'Refactor Auth Middleware', assignee: 'JD', status: 'In Progress' },
      { name: 'Update API Documentation', assignee: 'DC', status: 'To Do' },
      { name: 'Optimize Asset Pipeline', assignee: 'AP', status: 'To Do' },
      { name: 'Cloud Security Audit', assignee: 'KR', status: 'Completed' },
    ],
    stats: { open: 5, completed: 14, meetings: 8, members: 6 },
    meetings: [
      { title: 'Architecture Sprint Planning', date: 'Apr 11, 2026' },
      { title: 'API Review', date: 'Apr 15, 2026' },
      { title: 'Infra Cost Analysis', date: 'Apr 19, 2026' },
    ]
  },
  gamma: {
    name: 'Craft Gamma', letter: 'Γ', dept: 'Product', color: 'bg-tertiary', progress: 92,
    members: [
      { initials: 'MV', name: 'Marcus Vega', role: 'Product Manager', email: 'm.vega@teamsync.io', status: 'Active', color: 'bg-tertiary', isLeader: true },
      { initials: 'AK', name: 'Anya Kapoor', role: 'Data Analyst', email: 'a.kapoor@teamsync.io', status: 'Active', color: 'bg-outline', isLeader: false },
      { initials: 'BT', name: 'Ben Torres', role: 'Growth Lead', email: 'b.torres@teamsync.io', status: 'Active', color: 'bg-primary', isLeader: false },
      { initials: 'CH', name: 'Clara Hughes', role: 'User Researcher', email: 'c.hughes@teamsync.io', status: 'Active', color: 'bg-secondary', isLeader: false },
    ],
    tasks: [
      { name: 'Roadmap Q2 Planning', assignee: 'MV', status: 'Completed' },
      { name: 'User Interview Synthesis', assignee: 'CH', status: 'In Progress' },
    ],
    stats: { open: 1, completed: 7, meetings: 4, members: 4 },
    meetings: [
      { title: 'Quarterly Roadmap Review', date: 'Apr 10, 2026' },
      { title: 'Growth Metrics Standup', date: 'Apr 16, 2026' },
    ]
  },
  delta: {
    name: 'Nexus Delta', letter: 'Δ', dept: 'Sales & Operations', color: 'bg-inverse-surface', progress: 45,
    members: [
      { initials: 'CJ', name: 'Chris Jordan', role: 'Sales Director', email: 'c.jordan@teamsync.io', status: 'Active', color: 'bg-inverse-surface', isLeader: true },
      { initials: 'LM', name: 'Laura Mendez', role: 'Account Manager', email: 'l.mendez@teamsync.io', status: 'Active', color: 'bg-secondary', isLeader: false },
    ],
    tasks: [
      { name: 'Pipeline Cleanup Sprint', assignee: 'CJ', status: 'In Progress' },
      { name: 'CRM Migration Phase 2', assignee: 'LM', status: 'To Do' },
    ],
    stats: { open: 4, completed: 11, meetings: 5, members: 2 },
    meetings: [
      { title: 'Client Onboarding Sync', date: 'Apr 13, 2026' },
      { title: 'Pipeline Review', date: 'Apr 17, 2026' },
    ]
  },
  epsilon: {
    name: 'Studio Epsilon', letter: 'Ε', dept: 'Marketing & Content', color: 'bg-outline', progress: 78,
    members: [
      { initials: 'NR', name: 'Nadia Rossi', role: 'Content Lead', email: 'n.rossi@teamsync.io', status: 'Active', color: 'bg-outline', isLeader: true },
      { initials: 'PL', name: 'Peter Lin', role: 'Social Media', email: 'p.lin@teamsync.io', status: 'Active', color: 'bg-primary-fixed', isLeader: false },
      { initials: 'SW', name: 'Sophie Webb', role: 'Copywriter', email: 's.webb@teamsync.io', status: 'Active', color: 'bg-secondary', isLeader: false },
    ],
    tasks: [
      { name: 'Q2 Campaign Launch', assignee: 'NR', status: 'In Progress' },
      { name: 'Blog Content Calendar', assignee: 'SW', status: 'To Do' },
    ],
    stats: { open: 3, completed: 8, meetings: 4, members: 3 },
    meetings: [
      { title: 'Content Strategy Retro', date: 'Apr 9, 2026' },
      { title: 'Campaign Kickoff', date: 'Apr 16, 2026' },
    ]
  }
};

export default function AdminTeamInfo() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const teamId = searchParams.get('id') || 'alpha';
  const team = TEAM_DATA[teamId] || TEAM_DATA.alpha;

  const [showAddMember, setShowAddMember] = useState(false);
  const [addMemberEmail, setAddMemberEmail] = useState('');
  const [showReplace, setShowReplace] = useState(false);
  const [replaceEmail, setReplaceEmail] = useState('');

  function handleAddMember(e) {
    e.preventDefault();
    alert(`Member with email "${addMemberEmail}" added (demo).`);
    setAddMemberEmail('');
    setShowAddMember(false);
  }

  function handleReplaceLeader(e) {
    e.preventDefault();
    alert(`Leader replaced with "${replaceEmail}" (demo).`);
    setReplaceEmail('');
    setShowReplace(false);
  }

  return (
    <>
      {/* Back breadcrumb */}
      <Link to="/admin/teams" className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:-translate-x-1 transition-transform mb-8">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Teams
      </Link>

      {/* Team Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl ${team.color} text-white flex items-center justify-center text-2xl font-bold font-headline shadow-lg`}>{team.letter}</div>
          <div>
            <h1 className="font-headline text-4xl text-on-surface tracking-tight">{team.name}</h1>
            <p className="font-headline italic text-lg text-outline mt-1">{team.dept}</p>
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
                <span className="text-[10px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">{team.members.length} Members</span>
                <button className="btn-primary text-xs gap-1.5 py-1.5 px-3" onClick={() => setShowAddMember(true)}>
                  <span className="material-symbols-outlined text-sm">person_add</span>Add Member
                </button>
              </div>
            </div>
            <table className="ts-table">
              <thead>
                <tr><th>Member</th><th>Team Role</th><th>Email</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {team.members.map((m, i) => (
                  <tr key={i} className="group">
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={m.name} size="36" round={true} />
                        <span className="font-medium text-on-surface">{m.name}</span>
                      </div>
                    </td>
                    <td><span className="text-xs text-on-surface-variant">{m.role}</span></td>
                    <td><span className="text-xs font-mono text-outline">{m.email}</span></td>

                    <td>
                      {m.isLeader ? (
                        <button className="text-xs font-medium text-primary hover:underline" onClick={() => setShowReplace(true)}>Replace Leader</button>
                      ) : (
                        <button className="text-xs font-medium text-error hover:underline" onClick={() => { if(window.confirm(`Remove ${m.name}?`)) alert('Member removed (demo).'); }}>Remove Member</button>
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
              <Link to="/admin/tasks" className="text-xs font-medium text-primary hover:underline">View all →</Link>
            </div>
            <table className="ts-table">
              <thead>
                <tr><th>Task</th><th>Assignee</th><th>Status</th></tr>
              </thead>
              <tbody>
                {team.tasks.map((t, i) => (
                  <tr key={i}>
                    <td className={`font-medium ${t.status === 'Completed' ? 'line-through opacity-60' : ''}`}>{t.name}</td>
                    <td><Avatar name={t.assignee} size="28" round={true} /></td>
                    <td>
                      {t.status === 'In Progress'
                        ? <span className="flex items-center gap-1.5 text-xs font-medium"><span className="animate-ping inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>In Progress</span>
                        : t.status === 'Completed'
                        ? <span className="flex items-center gap-1.5 text-xs font-medium text-secondary"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>Completed</span>
                        : <span className="text-xs text-outline">To Do</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Stats + Meetings */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Sprint Stats */}
          <div className="ts-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-sm">speed</span></div>
              <h2 className="font-headline text-xl text-on-surface">Sprint Progress</h2>
            </div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase tracking-widest text-outline font-bold">Overall Progress</span>
                <span className="font-mono text-sm text-primary font-bold">{team.progress}%</span>
              </div>
              <div className="ts-progress-track h-3"><div className="ts-progress-fill h-3" style={{ width: `${team.progress}%` }}></div></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="stat-card text-center" style={{ padding: '1rem' }}>
                <p className="font-headline text-2xl font-bold text-primary mb-0.5">{team.stats.open}</p>
                <p className="text-[9px] text-outline uppercase tracking-widest font-mono">Open Tasks</p>
              </div>
              <div className="stat-card text-center" style={{ padding: '1rem' }}>
                <p className="font-headline text-2xl font-bold text-secondary mb-0.5">{team.stats.completed}</p>
                <p className="text-[9px] text-outline uppercase tracking-widest font-mono">Completed</p>
              </div>
              <div className="stat-card text-center" style={{ padding: '1rem' }}>
                <p className="font-headline text-2xl font-bold text-on-surface mb-0.5">{team.stats.meetings}</p>
                <p className="text-[9px] text-outline uppercase tracking-widest font-mono">Meetings</p>
              </div>
              <div className="stat-card text-center" style={{ padding: '1rem' }}>
                <p className="font-headline text-2xl font-bold text-on-surface mb-0.5">{team.stats.members}</p>
                <p className="text-[9px] text-outline uppercase tracking-widest font-mono">Members</p>
              </div>
            </div>
          </div>

          {/* Recent Meetings */}
          <div className="ts-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-sm">calendar_today</span></div>
              <h2 className="font-headline text-xl text-on-surface">Recent Meetings</h2>
            </div>
            <div className="space-y-4">
              {team.meetings.map((m, i) => (
                <Link key={i} to="/admin/meeting-detail" className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors">
                  <div>
                    <p className="text-sm font-medium text-on-surface">{m.title}</p>
                    <p className="text-[10px] font-mono text-outline mt-0.5">{m.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <div className={`ts-modal-overlay ${showAddMember ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setShowAddMember(false); }}>
        <div className="ts-modal">
          <div className="ts-modal-header">
            <h2>Add Member</h2>
            <button className="ts-close-btn" onClick={() => setShowAddMember(false)}><span className="material-symbols-outlined">close</span></button>
          </div>
          <div className="ts-modal-body">
            <form id="add-member-form" className="space-y-5" onSubmit={handleAddMember}>
              <div>
                <label className="ts-label">Member Email *</label>
                <input className="ts-field" type="email" placeholder="name@teamsync.io" required value={addMemberEmail} onChange={e => setAddMemberEmail(e.target.value)} />
              </div>
            </form>
          </div>
          <div className="ts-modal-footer">
            <button className="btn-secondary text-sm" onClick={() => setShowAddMember(false)}>Cancel</button>
            <button className="btn-primary text-sm" onClick={() => document.getElementById('add-member-form').requestSubmit()}>
              <span className="material-symbols-outlined text-sm">person_add</span>Add Member
            </button>
          </div>
        </div>
      </div>

      {/* Replace Leader Modal */}
      <div className={`ts-modal-overlay ${showReplace ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setShowReplace(false); }}>
        <div className="ts-modal">
          <div className="ts-modal-header">
            <h2>Replace Team Leader</h2>
            <button className="ts-close-btn" onClick={() => setShowReplace(false)}><span className="material-symbols-outlined">close</span></button>
          </div>
          <div className="ts-modal-body">
            <form id="replace-leader-form" className="space-y-5" onSubmit={handleReplaceLeader}>
              <div>
                <label className="ts-label">New Leader Email *</label>
                <input className="ts-field" type="email" placeholder="newleader@teamsync.io" required value={replaceEmail} onChange={e => setReplaceEmail(e.target.value)} />
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
