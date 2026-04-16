import { useState } from 'react';
import Avatar from 'react-avatar';

const INIT_USERS = [
  { name: 'Julian Thorne', initials: 'JT', email: 'julian.t@teamsync.io', role: 'Admin', dept: 'Design', meetings: 24, status: 'Active', color: 'bg-inverse-surface' },
  { name: 'Elena Vance', initials: 'EV', email: 'e.vance@teamsync.io', role: 'Team Leader', dept: 'Engineering', meetings: 18, status: 'Active', color: 'bg-primary' },
  { name: 'Marcus Chen', initials: 'MC', email: 'm.chen@teamsync.io', role: 'Member', dept: 'Product', meetings: 12, status: 'Active', color: 'bg-secondary' },
  { name: 'Sienna Brooks', initials: 'SB', email: 's.brooks@teamsync.io', role: 'Member', dept: 'Design', meetings: 5, status: 'Deactivated', color: 'bg-surface-container-high' },
];

const INIT_PENDING = [
  { email: 'alex.r@teamsync.io', role: 'Team Leader', daysAgo: 2 },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(INIT_USERS);
  const [pending, setPending] = useState(INIT_PENDING);
  const [searchQ, setSearchQ] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [openDD, setOpenDD] = useState(null);
  const [invForm, setInvForm] = useState({ fname: '', lname: '', email: '', role: 'Member', password: '' });

  const COLORS = ['bg-primary','bg-secondary','bg-tertiary','bg-outline','bg-inverse-surface'];

  const filtered = users.filter(u => {
    const matchName = !searchQ || u.name.toLowerCase().includes(searchQ.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    const matchStatus = !statusFilter || u.status === statusFilter;
    return matchName && matchRole && matchStatus;
  });

  const total = users.length;
  const active = users.filter(u => u.status === 'Active').length;
  const invited = pending.length;
  const deactivated = users.filter(u => u.status === 'Deactivated').length;

  function openInviteModal() { setInvForm({ fname: '', lname: '', email: '', role: 'Member', password: '' }); setShowInvite(true); }
  function closeInviteModal() { setShowInvite(false); }
  function handleInvite(e) {
    e.preventDefault();
    const name = invForm.fname + ' ' + invForm.lname;
    const initials = (invForm.fname[0] + invForm.lname[0]).toUpperCase();
    setUsers([...users, { name, initials, email: invForm.email, role: invForm.role, dept: 'General', meetings: 0, status: 'Active', color: COLORS[users.length % COLORS.length] }]);
    closeInviteModal();
  }

  function toggleUserStatus(idx) {
    const u = users[idx];
    const newStatus = u.status === 'Active' ? 'Deactivated' : 'Active';
    if (window.confirm(`${newStatus === 'Deactivated' ? 'Deactivate' : 'Reactivate'} ${u.name}?`)) {
      const updated = [...users];
      updated[idx] = { ...u, status: newStatus };
      setUsers(updated);
    }
  }

  function removeUser(idx) {
    if (window.confirm(`Remove ${users[idx].name}? This cannot be undone.`)) {
      const updated = [...users];
      updated.splice(idx, 1);
      setUsers(updated);
    }
    setOpenDD(null);
  }

  function resendInvite(idx) { alert('Invitation resent to ' + pending[idx].email); }
  function revokeInvite(idx) {
    if (window.confirm(`Revoke invitation for ${pending[idx].email}?`)) {
      const updated = [...pending];
      updated.splice(idx, 1);
      setPending(updated);
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-12 items-start md:items-end justify-between">
        <div>
          <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">User Management</h1>
          <p className="font-headline italic text-xl text-outline">Oversee access, roles, and workspace membership.</p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button className="btn-primary gap-2 text-sm" onClick={openInviteModal}><span className="material-symbols-outlined text-sm">person_add</span>Add New User</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card text-center"><p className="font-headline text-4xl font-bold text-on-surface mb-1">{total}</p><p className="text-xs text-outline uppercase tracking-widest font-mono">Total</p></div>
        <div className="stat-card text-center"><p className="font-headline text-4xl font-bold text-primary mb-1">{active}</p><p className="text-xs text-outline uppercase tracking-widest font-mono">Active</p></div>
        <div className="stat-card text-center"><p className="font-headline text-4xl font-bold text-tertiary mb-1">{invited}</p><p className="text-xs text-outline uppercase tracking-widest font-mono">Members</p></div>
        <div className="stat-card text-center"><p className="font-headline text-4xl font-bold text-on-surface-variant mb-1">{deactivated}</p><p className="text-xs text-outline uppercase tracking-widest font-mono">Deactivated</p></div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
          <input className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" placeholder="Search users…" value={searchQ} onChange={e => setSearchQ(e.target.value)} />
        </div>
        <div className="relative">
          <select className="appearance-none pl-4 pr-10 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm cursor-pointer focus:outline-none" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="">Role: All</option>
            <option value="Admin">Admin</option>
            <option value="Team Leader">Team Leader</option>
            <option value="Member">Member</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
        </div>
        <div className="relative">
          <select className="appearance-none pl-4 pr-10 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm cursor-pointer focus:outline-none" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Status: All</option>
            <option value="Active">Active</option>
            <option value="Invited">Invited</option>
            <option value="Deactivated">Deactivated</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="ts-card overflow-hidden">
        <table className="ts-table">
          <thead>
            <tr>
              <th>User</th><th>Role</th><th>Department</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, idx) => {
              const realIdx = users.indexOf(u);
              const isDeactivated = u.status === 'Deactivated';
              const roleColor = u.role === 'Admin' ? 'text-on-surface-variant' : u.role === 'Team Leader' ? 'text-primary' : 'text-on-surface-variant';
              return (
                <tr key={idx} className={`group ${isDeactivated ? 'opacity-60' : ''}`}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} size="40" round={true} />
                      <div><p className="font-semibold text-on-surface">{u.name}</p><p className="text-xs text-outline font-mono">{u.email}</p></div>
                    </div>
                  </td>
                  <td><span className={`text-xs font-bold uppercase tracking-wider ${roleColor}`}>{u.role}</span></td>
                  <td><span className="text-sm text-on-surface-variant">{u.dept}</span></td>
                  <td>
                    {u.status === 'Active'
                      ? <span className="badge-active text-[9px]"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>Active</span>
                      : <span className="badge-deactivated text-[9px]">Deactivated</span>}
                  </td>
                  <td>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className={`p-1.5 text-outline hover:text-${isDeactivated ? 'primary' : 'error'} rounded-lg transition-colors`} onClick={() => toggleUserStatus(realIdx)}><span className="material-symbols-outlined text-sm">{isDeactivated ? 'person' : 'person_off'}</span></button>
                      <div className="relative">
                        <button className="p-1.5 text-outline hover:text-on-surface rounded-lg transition-colors user-more-btn" onClick={() => setOpenDD(openDD === realIdx ? null : realIdx)}><span className="material-symbols-outlined text-sm">more_vert</span></button>
                        <div className={`ts-dropdown ${openDD === realIdx ? 'open' : ''}`}>
                          <button className="ts-dropdown-item"><span className="material-symbols-outlined text-sm">person</span>View Profile</button>
                          <div className="ts-dropdown-sep"></div>
                          <button className="ts-dropdown-item danger" onClick={() => removeUser(realIdx)}><span className="material-symbols-outlined text-sm">person_remove</span>Remove User</button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <div className={`ts-modal-overlay ${showInvite ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closeInviteModal(); }}>
        <div className="ts-modal">
          <div className="ts-modal-header">
            <h2>Add New User</h2>
            <button className="ts-close-btn" onClick={closeInviteModal}><span className="material-symbols-outlined">close</span></button>
          </div>
          <div className="ts-modal-body">
            <form id="invite-form" className="space-y-5" onSubmit={handleInvite}>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="ts-label">First Name *</label><input className="ts-field" type="text" placeholder="First name" required value={invForm.fname} onChange={e => setInvForm({ ...invForm, fname: e.target.value })} /></div>
                <div><label className="ts-label">Last Name *</label><input className="ts-field" type="text" placeholder="Last name" required value={invForm.lname} onChange={e => setInvForm({ ...invForm, lname: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="ts-label">Email Address *</label><input className="ts-field" type="email" placeholder="name@teamsync.io" required value={invForm.email} onChange={e => setInvForm({ ...invForm, email: e.target.value })} /></div>
                <div><label className="ts-label">Role</label>
                  <select className="ts-field" value={invForm.role} onChange={e => setInvForm({ ...invForm, role: e.target.value })}>
                    <option>Member</option><option>Team Leader</option><option>Admin</option>
                  </select>
                </div>
              </div>
              <div><label className="ts-label">Password *</label><input className="ts-field" type="password" placeholder="••••••••" required value={invForm.password} onChange={e => setInvForm({ ...invForm, password: e.target.value })} /></div>
            </form>
          </div>
          <div className="ts-modal-footer">
            <button className="btn-secondary text-sm" onClick={closeInviteModal}>Cancel</button>
            <button className="btn-primary text-sm" onClick={() => document.getElementById('invite-form').requestSubmit()}>
              <span className="material-symbols-outlined text-sm">check</span>Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
