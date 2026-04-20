import { useEffect, useState } from 'react';
import Avatar from 'react-avatar';

const API_BASE = 'http://localhost:5000/api';

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...opts });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API error ${res.status}`);
  }
  return res.json();
}


// Backend systemRole values: 'admin', 'leader', 'member'
const ROLE_DISPLAY = { admin: 'Admin', leader: 'Team Leader', member: 'Member' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQ, setSearchQ] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [invForm, setInvForm] = useState({ fname: '', lname: '', email: '', role: 'member', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  function loadUsers() {
    setLoading(true);
    apiFetch('/admin/users')
      .then(res => setUsers(res.members || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadUsers(); }, []);

  // Filtering: backend returns all users; filter client-side
  const filtered = users.filter(u => {
    const matchName = !searchQ || (u.name || '').toLowerCase().includes(searchQ.toLowerCase());
    const matchRole = !roleFilter || u.systemRole === roleFilter;
    const matchStatus = !statusFilter || u.status === (statusFilter === 'active');
    return matchName && matchRole && matchStatus;
  });


  const total = users.length;
  const active = users.filter(u => u.status !== false).length;
  const deactivated = users.filter(u => u.status === false).length;

  function openInviteModal() { setInvForm({ fname: '', lname: '', email: '', role: 'member', password: '' }); setSubmitError(null); setShowInvite(true); }
  function closeInviteModal() { setShowInvite(false); }

  async function handleInvite(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    // Merge firstName + lastName → send as single 'name' field
    const name = `${invForm.fname} ${invForm.lname}`.trim();
    try {
      await apiFetch('/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: invForm.email, systemRole: invForm.role, password: invForm.password }),
      });
      closeInviteModal();
      loadUsers(); // Refresh list
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
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
        <div className="stat-card text-center"><p className="font-headline text-4xl font-bold text-tertiary mb-1">{users.filter(u => u.systemRole === 'member').length}</p><p className="text-xs text-outline uppercase tracking-widest font-mono">Members</p></div>
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
            <option value="leader">Team Leader</option>
            <option value="member">Member</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
        </div>
        <div className="relative">
          <select className="appearance-none pl-4 pr-10 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm cursor-pointer focus:outline-none" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Status: All</option>
            <option value="active">Active</option>
            <option value="deactive">Deactivated</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
        </div>

      </div>

      {/* Users Table */}
      <div className="ts-card overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-outline animate-pulse">Loading users…</div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-sm text-error">Failed to load users: {error}</div>
        ) : (
          <table className="ts-table">
            <thead>
              <tr>
                <th>User</th>
                {/* role = systemRole from backend */}
                <th>Role</th>
                <th>Team Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-outline py-8 text-sm">No users found.</td></tr>
              ) : filtered.map((u, idx) => {

                const isDeactivated = u.status === false;
                const displayRole = ROLE_DISPLAY[u.systemRole] || u.systemRole || '—';
                const roleColor = u.systemRole === 'admin' ? 'text-on-surface-variant' : u.systemRole === 'leader' ? 'text-primary' : 'text-on-surface-variant';
                return (
                  <tr key={u.id || idx} className={`group ${isDeactivated ? 'opacity-60' : ''}`}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name || '?'} size="40" round={true} />
                        <div><p className="font-semibold text-on-surface">{u.name}</p><p className="text-xs text-outline font-mono">{u.email}</p></div>
                      </div>
                    </td>
                    {/* systemRole from backend */}
                    <td><span className={`text-xs font-bold uppercase tracking-wider ${roleColor}`}>{displayRole}</span></td>
                    <td><span className="text-sm text-on-surface-variant">{u.team || '—'}</span></td>
                    <td>
                      {u.status === false ? (
                        <span className="badge-deactivated text-[9px] uppercase tracking-wider">Deactivated</span>
                      ) : (
                        <span className="badge-active text-[9px] uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-1"></span>
                          Active
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Actions can be added later */}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
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
              {/* firstName + lastName → merged as single 'name' before sending */}
              <div className="grid grid-cols-2 gap-4">
                <div><label className="ts-label">Email Address *</label><input className="ts-field" type="email" placeholder="name@teamsync.io" required value={invForm.email} onChange={e => setInvForm({ ...invForm, email: e.target.value })} /></div>
                <div><label className="ts-label">Role</label>
                  <select className="ts-field" value={invForm.role} onChange={e => setInvForm({ ...invForm, role: e.target.value })}>
                    <option value="member">Member</option>
                    <option value="leader">Team Leader</option>
                    {/* cant add another admin */}
                  </select>
                </div>
              </div>
              <div><label className="ts-label">Password *</label><input className="ts-field" type="password" placeholder="••••••••" required value={invForm.password} onChange={e => setInvForm({ ...invForm, password: e.target.value })} /></div>
              {submitError && <p className="text-xs text-error">{submitError}</p>}
            </form>
          </div>
          <div className="ts-modal-footer">
            <button className="btn-secondary text-sm" onClick={closeInviteModal}>Cancel</button>
            <button className="btn-primary text-sm" disabled={submitting} onClick={() => document.getElementById('invite-form').requestSubmit()}>
              <span className="material-symbols-outlined text-sm">check</span>{submitting ? 'Adding…' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
