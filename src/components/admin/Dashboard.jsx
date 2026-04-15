import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';

export default function AdminDashboard() {
  return (
    <>
      {/* Page Hero */}
      <div className="mb-10">
        <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">System Overview</h1>
        <p className="font-headline italic text-xl text-outline">Monitor and manage the entire TeamSync workspace.</p>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">group</span>
            </div>
            <span className="font-mono text-[10px] text-outline uppercase tracking-widest">Users</span>
          </div>
          <p className="font-headline text-4xl font-bold text-on-surface">48</p>
          <p className="text-xs text-on-surface-variant mt-1">+3 this month</p>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
            </div>
            <span className="font-mono text-[10px] text-outline uppercase tracking-widest">Meetings</span>
          </div>
          <p className="font-headline text-4xl font-bold text-on-surface">124</p>
          <p className="text-xs text-on-surface-variant mt-1">This quarter</p>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">assignment</span>
            </div>
            <span className="font-mono text-[10px] text-outline uppercase tracking-widest">Tasks</span>
          </div>
          <p className="font-headline text-4xl font-bold text-on-surface">317</p>
          <p className="text-xs text-on-surface-variant mt-1">72% completed</p>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">hub</span>
            </div>
            <span className="font-mono text-[10px] text-outline uppercase tracking-widest">Teams</span>
          </div>
          <p className="font-headline text-4xl font-bold text-on-surface">6</p>
          <p className="text-xs text-on-surface-variant mt-1">Active ateliers</p>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6 mb-10">
        {/* Team Directory */}
        <div className="col-span-12 lg:col-span-7 ts-card overflow-hidden">
          <div className="px-6 py-5 flex items-center justify-between border-b border-outline-variant/10">
            <h2 className="font-headline text-2xl text-on-surface">Team Directory</h2>
            <Link to="/admin/users" className="text-xs font-medium text-primary hover:underline">Manage all users →</Link>
          </div>
          <table className="ts-table">
            <thead>
              <tr>
                <th>Member</th><th>Role</th><th>Department</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar name="Julian Thorne" size="36" round={true} />
                    <div><p className="font-medium text-on-surface">Julian Thorne</p><p className="text-xs text-outline font-mono">julian.t@teamsync.io</p></div>
                  </div>
                </td>
                <td><span className="text-sm font-medium">Admin</span></td>
                <td><span className="text-sm text-on-surface-variant">Design</span></td>
                <td><span className="badge-scheduled"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>Active</span></td>
                <td className="text-right"><Link to="/admin/users" className="text-xs text-primary hover:underline">Edit</Link></td>
              </tr>
              <tr>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar name="Elena Vance" size="36" round={true} />
                    <div><p className="font-medium text-on-surface">Elena Vance</p><p className="text-xs text-outline font-mono">e.vance@teamsync.io</p></div>
                  </div>
                </td>
                <td><span className="text-sm font-medium">Team Lead</span></td>
                <td><span className="text-sm text-on-surface-variant">Engineering</span></td>
                <td><span className="badge-draft">Invited</span></td>
                <td className="text-right"><Link to="/admin/users" className="text-xs text-primary hover:underline">Edit</Link></td>
              </tr>
              <tr>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar name="Marcus Chen" size="36" round={true} />
                    <div><p className="font-medium text-on-surface">Marcus Chen</p><p className="text-xs text-outline font-mono">m.chen@teamsync.io</p></div>
                  </div>
                </td>
                <td><span className="text-sm font-medium">Member</span></td>
                <td><span className="text-sm text-on-surface-variant">Product</span></td>
                <td><span className="badge-scheduled"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>Active</span></td>
                <td className="text-right"><Link to="/admin/users" className="text-xs text-primary hover:underline">Edit</Link></td>
              </tr>
              <tr>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar name="Sienna Brooks" size="36" round={true} />
                    <div><p className="font-medium text-on-surface">Sienna Brooks</p><p className="text-xs text-outline font-mono">s.brooks@teamsync.io</p></div>
                  </div>
                </td>
                <td><span className="text-sm font-medium">Member</span></td>
                <td><span className="text-sm text-on-surface-variant">Design</span></td>
                <td><span className="badge-completed">Deactivated</span></td>
                <td className="text-right"><Link to="/admin/users" className="text-xs text-primary hover:underline">Edit</Link></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* System Health & Quick Links */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          {/* System health */}
          <div className="ts-card p-6 flex-1">
            <h2 className="font-headline text-2xl text-on-surface mb-5">System Health</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-on-surface">Team Productivity</span>
                  <span className="font-mono text-xs text-primary font-bold">84%</span>
                </div>
                <div className="ts-progress-track"><div className="ts-progress-fill" style={{ width: '84%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-on-surface">Meeting Attendance</span>
                  <span className="font-mono text-xs text-primary font-bold">91%</span>
                </div>
                <div className="ts-progress-track"><div className="ts-progress-fill" style={{ width: '91%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-on-surface">Task Completion Rate</span>
                  <span className="font-mono text-xs text-primary font-bold">72%</span>
                </div>
                <div className="ts-progress-track"><div className="ts-progress-fill" style={{ width: '72%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-on-surface">MOM Coverage</span>
                  <span className="font-mono text-xs text-primary font-bold">96%</span>
                </div>
                <div className="ts-progress-track"><div className="ts-progress-fill" style={{ width: '96%' }}></div></div>
              </div>
            </div>
          </div>
          {/* Quick admin links */}
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/users" className="ts-card p-5 hover:-translate-y-1 transition-all flex flex-col gap-3 cursor-pointer group">
              <span className="material-symbols-outlined text-primary text-2xl">manage_accounts</span>
              <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">User Management</p>
            </Link>
            <Link to="/admin/teams" className="ts-card p-5 hover:-translate-y-1 transition-all flex flex-col gap-3 cursor-pointer group">
              <span className="material-symbols-outlined text-primary text-2xl">hub</span>
              <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Teams</p>
            </Link>
            <Link to="/admin/meetings" className="ts-card p-5 hover:-translate-y-1 transition-all flex flex-col gap-3 cursor-pointer group">
              <span className="material-symbols-outlined text-primary text-2xl">calendar_today</span>
              <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Meetings</p>
            </Link>
            <Link to="/admin/tasks" className="ts-card p-5 hover:-translate-y-1 transition-all flex flex-col gap-3 cursor-pointer group">
              <span className="material-symbols-outlined text-primary text-2xl">assignment</span>
              <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Tasks</p>
            </Link>
          </div>
        </div>
      </div>


    </>
  );
}
