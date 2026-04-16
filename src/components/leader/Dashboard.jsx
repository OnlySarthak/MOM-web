import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';

const ASSIGNEE_FULL_NAMES = {
  JD: 'Jane Doe',
  EV: 'Elena Vance',
  MV: 'Marcus V.',
  DC: 'David Chen',
};

export default function LeaderDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">My Dashboard</h1>
          <p className="font-headline italic text-xl text-outline">Your team's pulse, at a glance.</p>
        </div>
        <div className="flex items-center gap-4 px-5 py-3 bg-surface-container-lower rounded-xl border border-outline-variant/15 ts-card">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-outline font-semibold">Team Progress</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="font-headline text-2xl font-bold text-primary">72%</p>
              <div className="w-24 ts-progress-track"><div className="ts-progress-fill" style={{ width: '72%' }}></div></div>
            </div>
          </div>
          <Link to="/leader/meetings" className="btn-primary text-sm">+ Schedule Meeting</Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-outline-variant/15 mb-8">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''} pb-4 text-sm font-semibold`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab-btn ${activeTab === 'progress' ? 'active' : ''} pb-4 text-sm font-medium text-outline hover:text-on-surface`} onClick={() => setActiveTab('progress')}>Progress Metrics</button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-10 gap-8">
          {/* Recent MOMs */}
          <div className="col-span-10 lg:col-span-4">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="font-headline text-2xl text-on-surface">Recent MOMs</h2>
              <Link to="/leader/mom-list" className="text-[11px] font-medium text-primary hover:underline">VIEW ALL</Link>
            </div>
            <div className="space-y-4">
              <article className="ts-card p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => {}}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-headline text-lg leading-tight text-on-surface">Budget Re-allocation for Cloud Services</h3>
                  <span className="font-mono text-[10px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">JUN 12</span>
                </div>
                <p className="text-xs text-on-surface-variant italic font-headline opacity-80 mb-4 line-clamp-2">"Decided to shift 15% of the marketing budget to infrastructure to handle the surge in user traffic..."</p>
              </article>
              <article className="ts-card p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-headline text-lg leading-tight text-on-surface">Design System V2 Launch Timeline</h3>
                  <span className="font-mono text-[10px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">JUN 10</span>
                </div>
                <p className="text-xs text-on-surface-variant italic font-headline opacity-80 mb-4 line-clamp-2">"The rollout will be staged over three phases starting July 1st, beginning with core layout components..."</p>
              </article>
            </div>
          </div>

          {/* Team Tasks */}
          <div className="col-span-10 lg:col-span-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-headline text-2xl text-on-surface">Team Tasks</h2>
              <Link to="/leader/tasks" className="btn-secondary text-xs px-3 py-1.5">+ Assign Task</Link>
            </div>
            <div className="ts-card overflow-hidden">
              <table className="ts-table">
                <thead><tr><th>Task</th><th className="text-center">Assignee</th><th>Priority</th><th>Status</th></tr></thead>
                <tbody>
                  {[
                    { task: 'Refactor Auth Middleware', assignee: 'JD', priority: 'HIGH', status: 'in-progress', pClass: 'badge-high' },
                    { task: 'Update API Documentation', assignee: 'EV', priority: 'MEDIUM', status: 'todo', pClass: 'badge-medium' },
                    { task: 'Cloud Security Audit', assignee: 'MV', priority: 'HIGH', status: 'completed', pClass: 'badge-high' },
                    { task: 'Optimize Asset Pipeline', assignee: 'JD', priority: 'LOW', status: 'todo', pClass: 'badge-low' },
                  ].map((t, i) => (
                    <tr key={i} className="cursor-pointer">
                      <td className="font-medium text-on-surface">{t.task}</td>
                      <td className="text-center"><Avatar name={ASSIGNEE_FULL_NAMES[t.assignee] || t.assignee} size="28" round={true} className="mx-auto" /></td>
                      <td><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${t.pClass}`}>{t.priority}</span></td>
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
        </div>
      )}

      {/* Tab: Progress Metrics */}
      {activeTab === 'progress' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { label: 'Sprint Velocity', value: '84%', sub: '↑ 12% this sprint', color: 'text-primary' },
              { label: 'Open Tasks', value: '12', sub: 'Across 3 members', color: 'text-on-surface' },
              { label: 'Hours in Meetings', value: '18h', sub: 'This week', color: 'text-on-surface' },
              { label: 'MOMs Published', value: '8', sub: 'This quarter', color: 'text-on-surface' },
            ].map((s, i) => (
              <div key={i} className="stat-card text-center">
                <p className="font-mono text-[10px] uppercase tracking-widest text-outline mb-2">{s.label}</p>
                <p className={`font-headline text-5xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-on-surface-variant mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="ts-card p-6">
              <h2 className="font-headline text-2xl text-on-surface mb-5">Team Breakdown</h2>
              <div className="space-y-4">
                {[
                  { initials: 'EV', name: 'Elena Vance', tasks: '6/8 tasks', progress: 75, color: 'bg-primary' },
                  { initials: 'MC', name: 'Marcus Chen', tasks: '4/6 tasks', progress: 66, color: 'bg-secondary' },
                  { initials: 'JD', name: 'Jane Doe', tasks: '3/4 tasks', progress: 75, color: 'bg-[#7f2500]' },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Avatar name={m.name} size="32" round={true} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-on-surface">{m.name}</span>
                        <span className="font-mono text-xs text-primary">{m.tasks}</span>
                      </div>
                      <div className="ts-progress-track"><div className="ts-progress-fill" style={{ width: `${m.progress}%` }}></div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="ts-card p-6">
              <h2 className="font-headline text-2xl text-on-surface mb-5">Status Distribution</h2>
              <div className="space-y-3">
                {[
                  { color: 'bg-primary', label: 'In Progress', value: 5, textColor: 'text-primary' },
                  { color: 'bg-outline-variant', label: 'To Do', value: 7, textColor: '' },
                  { color: 'bg-secondary', label: 'Completed', value: 14, textColor: 'text-secondary' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low">
                    <span className="flex items-center gap-3 text-sm font-medium"><span className={`w-3 h-3 rounded-full ${s.color}`}></span>{s.label}</span>
                    <span className={`font-mono text-sm font-bold ${s.textColor}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
