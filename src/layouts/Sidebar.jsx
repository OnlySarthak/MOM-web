import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import Avatar from 'react-avatar';

const NAV_ITEMS = {
  admin: [
    { icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', key: 'dashboard' },
    { icon: 'calendar_today', label: 'Meetings', path: '/admin/meetings', key: 'meetings' },
    { icon: 'description', label: 'MOMs', path: '/admin/mom-list', key: 'moms' },
    { icon: 'assignment', label: 'Tasks', path: '/admin/tasks', key: 'tasks' },
    { icon: 'group', label: 'Users', path: '/admin/users', key: 'users' },
    { icon: 'hub', label: 'Teams', path: '/admin/teams', key: 'teams' },
    { icon: 'person', label: 'Profile', path: '/admin/profile', key: 'profile' },
  ],
  leader: [
    { icon: 'dashboard', label: 'Dashboard', path: '/leader/dashboard', key: 'dashboard' },
    { icon: 'calendar_today', label: 'Meetings', path: '/leader/meetings', key: 'meetings' },
    { icon: 'description', label: 'MOMs', path: '/leader/mom-list', key: 'moms' },
    { icon: 'assignment', label: 'Tasks', path: '/leader/tasks', key: 'tasks' },
    { icon: 'hub', label: 'Team', path: '/leader/teams', key: 'teams' },
    { icon: 'person', label: 'Profile', path: '/leader/profile', key: 'profile' },
  ],
  member: [
    { icon: 'dashboard', label: 'Dashboard', path: '/member/dashboard', key: 'dashboard' },
    { icon: 'calendar_today', label: 'Meetings', path: '/member/meetings', key: 'meetings' },
    { icon: 'description', label: 'MOMs', path: '/member/mom-list', key: 'moms' },
    { icon: 'assignment', label: 'Tasks', path: '/member/tasks', key: 'tasks' },
    { icon: 'person', label: 'Profile', path: '/member/profile', key: 'profile' },
  ]
};

/* Map URL segments to sidebar keys for sub-pages */
function deriveActiveKey(pathname) {
  if (pathname.includes('/meeting-detail') || pathname.includes('/meetings')) return 'meetings';
  if (pathname.includes('/mom-detail') || pathname.includes('/mom-list')) return 'moms';
  if (pathname.includes('/team-info') || pathname.includes('/teams')) return 'teams';
  if (pathname.includes('/tasks')) return 'tasks';
  if (pathname.includes('/users')) return 'users';
  if (pathname.includes('/profile')) return 'profile';
  if (pathname.includes('/dashboard')) return 'dashboard';
  return 'dashboard';
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const items = NAV_ITEMS[user.role] || NAV_ITEMS.member;
  const roleLabel = user.role === 'admin' ? 'System Administrator' : user.role === 'leader' ? 'Team Leader' : 'Member';
  const rolePrefix = `/${user.role}`;
  const activeKey = deriveActiveKey(location.pathname);

  return (
    <aside id="ts-sidebar">
      <div className="px-6 mb-10">
        <h1 className="font-headline text-xl italic text-white">TeamSync</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1">{roleLabel}</p>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {items.map(item => {
          const isActive = item.key === activeKey;
          const base = 'flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200';
          const cls = isActive
            ? `${base} text-white border-l-2 border-[#dce1ff] bg-white/5 font-medium`
            : `${base} text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg`;
          return (
            <Link key={item.key} className={cls} to={item.path}>
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-4 pt-6 border-t border-white/5 space-y-1">
        <div className="flex items-center gap-3 px-2 py-3 mb-2">
          <Avatar name={user.name} size="32" round={true} />
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-zinc-500 truncate">{roleLabel}</p>
          </div>
        </div>
        <Link className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200 rounded-lg" to={`${rolePrefix}/profile`}>
          <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
          <span className="text-xs font-medium">My Account</span>
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200 rounded-lg">
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className="text-xs font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
