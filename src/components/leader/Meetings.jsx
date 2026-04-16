// Leader role — identical content to admin pages (separate copy per plan)
// Re-exports admin component but with leader navigation paths
import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';

const MEETINGS = [
  {
    id: 1, title: 'Quarterly Brand Alignment', project: 'Rebranding 2026',
    date: 'Apr 24, 2026 · 10:00 AM', organizer: { name: 'Sarah Miller', initials: 'SM', color: 'bg-primary' },
    status: 'Scheduled',
    participants: [{ initials: 'DC', color: 'bg-secondary' }, { initials: 'JD', color: 'bg-tertiary' }, { extra: 4 }],
    mom: { title: 'Quarterly Brand Alignment — MOM', date: 'Apr 24, 2026', decisions: ['Finalize brand palette by end of sprint'], actionItems: [{ task: 'Prepare logo concepts', assignee: 'David Chen', due: 'Apr 28' }], notes: 'Brand refresh prioritized.' }
  },
  {
    id: 2, title: 'Mobile App UX Review', project: 'TeamSync Mobile',
    date: 'Apr 22, 2026 · 02:30 PM', organizer: { name: 'David Chen', initials: 'DC', color: 'bg-secondary' },
    status: 'Completed',
    participants: [{ initials: 'JD', color: 'bg-primary' }, { initials: 'MV', color: 'bg-outline' }],
    mom: { title: 'Mobile App UX Review — MOM', date: 'Apr 22, 2026', decisions: ['Adopt bottom nav pattern'], actionItems: [], notes: 'Navigation pattern decided.' }
  },
  {
    id: 3, title: 'Architecture Sprint Planning', project: 'Engineering',
    date: 'Apr 26, 2026 · 11:30 AM', organizer: { name: 'Marcus V.', initials: 'MV', color: 'bg-tertiary' },
    status: 'Scheduled',
    participants: [{ initials: 'EV', color: 'bg-primary' }, { extra: 5 }],
    mom: { title: 'Architecture Sprint Planning — MOM', date: 'Apr 26, 2026', decisions: ['Auth refactor first'], actionItems: [], notes: 'Sprint planning.' }
  },
];

export default function LeaderMeetings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState(MEETINGS);
  const [searchQ, setSearchQ] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);
  const [showMom, setShowMom] = useState(false);
  const [activeMom, setActiveMom] = useState(null);
  const [openDD, setOpenDD] = useState(null);
  const [form, setForm] = useState({ title: '', project: '', date: '', time: '', duration: '45 min', location: 'Virtual Atelier', notes: '' });
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 3;

  const filtered = meetings.filter(m => !searchQ || m.title.toLowerCase().includes(searchQ.toLowerCase()));
  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  function cancelMeeting(idx) {
    if (window.confirm(`Cancel "${meetings[idx].title}"?`)) { const u = [...meetings]; u.splice(idx, 1); setMeetings(u); }
    setOpenDD(null);
  }

  function handleSchedule(e) {
    e.preventDefault();
    const dateStr = new Date(form.date + 'T' + form.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = new Date(form.date + 'T' + form.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const initials = user.name.split(' ').map(n => n[0]).join('');
    setMeetings([{ id: Date.now(), title: form.title, project: form.project || 'General', date: `${dateStr} · ${timeStr}`, organizer: { name: user.name, initials, color: 'bg-primary' }, status: 'Scheduled', participants: [], mom: { title: form.title + ' — MOM', date: dateStr, decisions: [], actionItems: [], notes: '' } }, ...meetings]);
    setShowSchedule(false);
    setForm({ title: '', project: '', date: '', time: '', duration: '45 min', location: 'Virtual Atelier', notes: '' });
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
        <div>
          <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">Meetings</h1>
          <p className="font-headline italic text-xl text-outline">Schedule, review, and track your team syncs.</p>
        </div>
        <button className="btn-primary gap-2 text-sm flex-shrink-0" onClick={() => setShowSchedule(true)}>
          <span className="material-symbols-outlined text-lg">add</span>Schedule Meeting
        </button>
      </div>
      <div className="flex gap-4 mb-8">
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
            <input className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary" placeholder="Search meetings..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
          </div>
          <div className="relative">
            <select className="appearance-none pl-4 pr-10 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm cursor-pointer focus:outline-none" defaultValue="All Time">
              <option value="All Time">All Time</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="This Week">This Week</option>
              <option value="Last Week">Last Week</option>
              <option value="Earlier">Earlier</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
          </div>
        </div>
      </div>
      <div className="ts-card overflow-hidden mb-12">
        <table className="ts-table">
          <thead><tr><th>Meeting Title</th><th>Date & Time</th><th>Organizer</th><th>Status</th><th>Participants</th><th></th></tr></thead>
          <tbody>
            {paginated.map((m, idx) => (
              <tr key={m.id} className="cursor-pointer group" onClick={() => { setActiveMom(m); setShowMom(true); }}>
                <td><p className="font-headline text-lg text-on-surface group-hover:text-primary transition-colors">{m.title}</p><p className="text-xs text-outline">Project: {m.project}</p></td>
                <td className="font-mono text-xs text-on-surface-variant">{m.date}</td>
                <td><div className="flex items-center gap-2"><Avatar name={m.organizer.name} size="28" round={true} /><span className="text-sm font-medium">{m.organizer.name}</span></div></td>
                <td>{m.status === 'Scheduled' ? <span className="badge-scheduled"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>Scheduled</span> : m.status === 'Completed' ? <span className="badge-completed">Completed</span> : <span className="badge-draft">Draft</span>}</td>
                <td><div className="flex -space-x-1.5">{m.participants.map((p, pi) => p.extra ? <div key={pi} className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-[9px] font-bold ring-2 ring-white">+{p.extra}</div> : <Avatar key={pi} name={p.initials} size="28" round={true} style={{ marginLeft: '-4px', border: '2px solid white' }} />)}</div></td>
                <td className="text-right relative">
                  <span className="material-symbols-outlined text-outline hover:text-on-surface cursor-pointer" onClick={e => { e.stopPropagation(); setOpenDD(openDD === idx ? null : idx); }}>more_vert</span>
                  <div className={`ts-dropdown ${openDD === idx ? 'open' : ''}`}>
                    <button className="ts-dropdown-item" onClick={e => { e.stopPropagation(); navigate('/leader/meeting-detail'); setOpenDD(null); }}><span className="material-symbols-outlined text-sm">visibility</span>View Details</button>
                    <button className="ts-dropdown-item" onClick={e => { e.stopPropagation(); navigate('/leader/mom-detail'); setOpenDD(null); }}><span className="material-symbols-outlined text-sm">description</span>View MOM</button>
                    <div className="ts-dropdown-sep"></div>
                    <button className="ts-dropdown-item danger" onClick={e => { e.stopPropagation(); cancelMeeting(idx); }}><span className="material-symbols-outlined text-sm">cancel</span>Cancel Meeting</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="text-xs text-outline">Showing <span className="text-on-surface">{paginated.length}</span> of <span className="text-on-surface">{filtered.length}</span> meetings</p>
          <div className="flex gap-2">
            {page > 1 && (
              <button className="p-2 rounded-lg border border-outline-variant/15 text-outline hover:bg-surface-container-low transition-colors" onClick={() => setPage(p => Math.max(1, p - 1))}>
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
            )}
            {hasMore && (
              <button className="px-4 py-2 rounded-lg border border-outline-variant/15 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-1.5" onClick={() => setPage(p => p + 1)}>
                <span className="material-symbols-outlined text-sm">expand_more</span>Load More
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MOM Slider */}
      <div className={`ts-slideover-overlay ${showMom ? 'open' : ''}`} onClick={() => setShowMom(false)}></div>
      <div className={`ts-slideover ${showMom ? 'open' : ''}`}>
        {activeMom && (
          <>
            <div className="ts-slideover-header">
              <h2 className="font-headline text-xl text-on-surface">{activeMom.mom.title}</h2>
              <button className="ts-close-btn" onClick={() => setShowMom(false)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="ts-slideover-body">
              <div className="mb-6"><p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Meeting Date</p><p className="text-sm font-mono text-on-surface-variant">{activeMom.mom.date}</p></div>
              <div className="mb-6"><p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-3">Key Decisions</p><ul className="space-y-2">{activeMom.mom.decisions.map((d, i) => <li key={i} className="flex items-start gap-2"><span className="material-symbols-outlined text-secondary text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span><span className="text-sm text-on-surface">{d}</span></li>)}</ul></div>
              <div className="mb-8"><p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-2">Insights</p><p className="text-sm text-on-surface-variant leading-relaxed">{activeMom.mom.notes}</p></div>
              <button className="btn-primary gap-2 text-sm w-full justify-center" onClick={() => navigate('/leader/mom-detail')}><span className="material-symbols-outlined text-sm">open_in_new</span>View Full MOM</button>
            </div>
          </>
        )}
      </div>

      {/* Schedule Modal */}
      <div className={`ts-modal-overlay ${showSchedule ? 'open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setShowSchedule(false); }}>
        <div className="ts-modal">
          <div className="ts-modal-header"><h2>Schedule Meeting</h2><button className="ts-close-btn" onClick={() => setShowSchedule(false)}><span className="material-symbols-outlined">close</span></button></div>
          <div className="ts-modal-body">
            <form id="leader-schedule-form" className="space-y-5" onSubmit={handleSchedule}>
              <div><label className="ts-label">Meeting Title *</label><input className="ts-field" type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div><label className="ts-label">Project / Context</label><input className="ts-field" type="text" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4"><div><label className="ts-label">Date *</label><input className="ts-field" type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div><div><label className="ts-label">Time *</label><input className="ts-field" type="time" required value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></div></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="ts-label">Duration</label><select className="ts-field" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}><option>30 min</option><option>45 min</option><option>60 min</option><option>90 min</option></select></div>
                <div><label className="ts-label">Location</label><input className="ts-field" type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
              </div>
              <div><label className="ts-label">Agenda / Notes</label><textarea className="ts-field resize-none h-20" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}></textarea></div>
            </form>
          </div>
          <div className="ts-modal-footer"><button className="btn-secondary text-sm" onClick={() => setShowSchedule(false)}>Cancel</button><button className="btn-primary text-sm" onClick={() => document.getElementById('leader-schedule-form').requestSubmit()}><span className="material-symbols-outlined text-sm">event</span>Schedule</button></div>
        </div>
      </div>
    </>
  );
}
