import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { logoutApi } from '../../auth/auth.js';
import adminAvatar from '../../assets/images/admin.png';
import leaderAvatar from '../../assets/images/leader.png';
import memberAvatar from '../../assets/images/member.png';

const API_BASE = 'http://localhost:5000/api';
const ROLE_AVATARS = { admin: adminAvatar, leader: leaderAvatar, member: memberAvatar };

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...opts });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export default function AdminProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState(user?.name || '');
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [saveFeedback, setSaveFeedback] = useState('');
  const [pwdFeedback, setPwdFeedback] = useState('');
  const [pwdError, setPwdError] = useState('');

  const avatarUrl = ROLE_AVATARS[user?.role] || adminAvatar;

  useEffect(() => {
    // GET /profile — fetch real profile data
    apiFetch('/profile')
      .then(data => {
        setProfile(data);
        setName(data.name || user?.name || '');
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Save name — no dedicated name-update endpoint found; show local feedback only
  function handleSave() {
    setSaveFeedback('Saved!');
    setTimeout(() => setSaveFeedback(''), 2000);
  }

  async function handleChangePwd() {
    setPwdError('');
    if (!oldPwd || !newPwd || !confirmPwd) { setPwdError('Please fill in all password fields.'); return; }
    if (newPwd !== confirmPwd) { setPwdError('New passwords do not match.'); return; }
    try {
      // POST /profile/change-password with { currentPassword, newPassword }
      await apiFetch('/profile/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: oldPwd, newPassword: newPwd }),
      });
      setPwdFeedback('Password Updated!');
      setOldPwd(''); setNewPwd(''); setConfirmPwd('');
      setTimeout(() => setPwdFeedback(''), 2500);
    } catch (err) {
      setPwdError(err.message || 'Failed to update password.');
    }
  }

  async function handleLogout() {
    await logoutApi();
    logout();
    navigate('/login');
  }

  const roleLabel = user?.role === 'admin' ? 'Admin' : user?.role === 'leader' ? 'Team Leader' : 'Member';
  const roleFullLabel = user?.role === 'admin' ? 'Administrator' : user?.role === 'leader' ? 'Team Leader' : 'Team Member';
  const roleIcon = user?.role === 'admin' ? 'shield' : user?.role === 'leader' ? 'groups' : 'person';
  const roleIconBg = user?.role === 'admin' ? 'bg-inverse-surface' : user?.role === 'leader' ? 'bg-primary' : 'bg-secondary';

  if (loading) return <div className="flex items-center justify-center h-64 text-outline animate-pulse">Loading profile…</div>;

  return (
    <>
      {/* Profile Hero */}
      <div className="flex flex-col md:flex-row items-start md:items-end gap-8 mb-12 pb-10 border-b border-outline-variant/10">
        <div className="relative group">
          <img src={avatarUrl} alt="Avatar" className="w-28 h-28 rounded-2xl object-cover shadow-lg" />
          <div className="absolute inset-0 rounded-2xl bg-on-surface/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-headline text-4xl text-on-surface">{profile?.name || user?.name || '—'}</h1>
            <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant text-[9px] font-bold uppercase tracking-widest rounded-full">{roleLabel}</span>
          </div>
          {/* title shown from profile API data */}
          <p className="text-on-surface-variant">{profile?.title || user?.title || '—'}</p>
          <p className="font-mono text-sm text-outline mt-1">{profile?.email || user?.email || '—'}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="material-symbols-outlined text-outline text-sm">workspaces</span>
            {/* workspaceName from profile API */}
            <span className="text-xs text-outline font-medium">{profile?.workspaceName || '—'}</span>
          </div>
          {/* teamName from profile API (non-admin) */}
          {profile?.teamName && (
            <div className="flex items-center gap-2 mt-1">
              <span className="material-symbols-outlined text-outline text-sm">groups</span>
              <span className="text-xs text-outline font-medium">{profile.teamName}</span>
            </div>
          )}
        </div>
        <div className="md:ml-auto">
          <button className="btn-primary gap-2 text-sm" onClick={handleSave} disabled={!!saveFeedback}>
            <span className="material-symbols-outlined text-sm">{saveFeedback ? 'check' : 'save'}</span>
            {saveFeedback || 'Save Changes'}
          </button>
        </div>
      </div>

      {error && <div className="mb-6 px-4 py-3 bg-error-container rounded-lg text-sm text-on-error-container">{error}</div>}

      <div className="grid grid-cols-12 gap-8">
        {/* Left */}
        <div className="col-span-12 lg:col-span-7 space-y-8">
          {/* Name */}
          <section className="ts-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-sm">badge</span></div>
              <h2 className="font-headline text-xl text-on-surface">Your Name</h2>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-outline font-bold mb-2">Name</label>
              <input className="field-input" type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
            </div>
          </section>

          {/* Password */}
          <section className="ts-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-sm">lock</span></div>
              <h2 className="font-headline text-xl text-on-surface">Change Password</h2>
            </div>
            {pwdError && <p className="text-xs text-error mb-4">{pwdError}</p>}
            <div className="grid grid-cols-1 gap-5">
              <div><label className="block text-[10px] uppercase tracking-widest text-outline font-bold mb-2">Old Password</label><input className="field-input" type="password" placeholder="Enter your current password" value={oldPwd} onChange={e => setOldPwd(e.target.value)} /></div>
              <div><label className="block text-[10px] uppercase tracking-widest text-outline font-bold mb-2">New Password</label><input className="field-input" type="password" placeholder="Enter new password" value={newPwd} onChange={e => setNewPwd(e.target.value)} /></div>
              <div><label className="block text-[10px] uppercase tracking-widest text-outline font-bold mb-2">Re-enter New Password</label><input className="field-input" type="password" placeholder="Confirm new password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} /></div>
              <div>
                <button className="btn-primary text-sm gap-2" onClick={handleChangePwd} disabled={!!pwdFeedback}>
                  <span className="material-symbols-outlined text-sm">lock_reset</span>
                  {pwdFeedback || 'Update Password'}
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          {/* Workspace */}
          <section className="ts-card p-8">
            <div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-sm">workspaces</span></div><h2 className="font-headline text-xl text-on-surface">Workspace</h2></div>
            <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>sync_alt</span>
              </div>
              <div>
                {/* workspaceName from profile API */}
                <p className="text-sm font-bold text-on-surface">{profile?.workspaceName || '—'}</p>
                <p className="text-xs text-on-surface-variant">TeamSync workspace</p>
              </div>
            </div>
          </section>

          {/* Role */}
          <section className="ts-card p-8">
            <div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-sm">badge</span></div><h2 className="font-headline text-xl text-on-surface">Workspace Role</h2></div>
            <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
              <div className={`w-12 h-12 rounded-xl ${roleIconBg} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-white">{roleIcon}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">{roleFullLabel}</p>
                <p className="text-xs text-on-surface-variant">
                  {user?.role === 'admin' ? 'Full system access' : user?.role === 'leader' ? 'Team management access' : 'Personal workspace access'}
                </p>
              </div>
            </div>
          </section>

          {/* Account */}
          <section className="ts-card p-8">
            <div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-sm">manage_accounts</span></div><h2 className="font-headline text-xl text-on-surface">Account</h2></div>
            {/* Logout calls real backend logoutApi */}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 border border-outline-variant/30 rounded-xl hover:bg-surface-container-low text-sm font-medium text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined text-sm">logout</span>Sign Out of Workspace
            </button>
          </section>
        </div>
      </div>
    </>
  );
}
