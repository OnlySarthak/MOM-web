import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import Avatar from 'react-avatar';

const MEETINGS = [
  {
    id: 1, title: 'Quarterly Brand Alignment', project: 'Rebranding 2026',
    date: 'Apr 24, 2026 · 10:00 AM', organizer: { name: 'Sarah Miller', initials: 'SM', color: 'bg-primary' },
    status: 'Scheduled',
    participants: [{ initials: 'DC', color: 'bg-secondary' }, { initials: 'JD', color: 'bg-tertiary' }, { extra: 4 }],
    mom: {
      title: 'Quarterly Brand Alignment — MOM', date: 'Apr 24, 2026',
      decisions: ['Finalize brand palette by end of sprint', 'Logo refresh to be presented next review'],
      actionItems: [{ task: 'Prepare logo concepts', assignee: 'David Chen', due: 'Apr 28' }, { task: 'Compile brand audit report', assignee: 'Sarah Miller', due: 'Apr 30' }],
      notes: 'The team agreed to prioritize the brand refresh ahead of the product redesign.'
    }
  },
  {
    id: 2, title: 'Mobile App UX Review', project: 'TeamSync Mobile',
    date: 'Apr 22, 2026 · 02:30 PM', organizer: { name: 'David Chen', initials: 'DC', color: 'bg-secondary' },
    status: 'Completed',
    participants: [{ initials: 'JD', color: 'bg-primary' }, { initials: 'MV', color: 'bg-outline' }],
    mom: {
      title: 'Mobile App UX Review — MOM', date: 'Apr 22, 2026',
      decisions: ['Adopt bottom nav pattern for mobile', 'Dark mode to ship in v2'],
      actionItems: [{ task: 'Finalize mobile wireframes', assignee: 'David Chen', due: 'Apr 26' }],
      notes: 'Discussed mobile navigation patterns. Consensus reached on bottom tab bar.'
    }
  },
  {
    id: 3, title: 'Client Onboarding: Atelier Inc.', project: 'Sales Pipeline',
    date: 'Apr 25, 2026 · 09:00 AM', organizer: { name: 'Jane Doe', initials: 'JD', color: 'bg-surface-container-high' },
    status: 'Draft',
    participants: [{ initials: 'SK', color: 'bg-tertiary' }],
    mom: { title: 'Client Onboarding: Atelier Inc. — MOM', date: 'Apr 25, 2026', decisions: ['Draft status — meeting not yet conducted'], actionItems: [], notes: 'This meeting is in draft status. No minutes available yet.' }
  },
  {
    id: 4, title: 'Architecture Sprint Planning', project: 'Engineering',
    date: 'Apr 26, 2026 · 11:30 AM', organizer: { name: 'Marcus V.', initials: 'MV', color: 'bg-tertiary' },
    status: 'Scheduled',
    participants: [{ initials: 'EV', color: 'bg-primary' }, { initials: 'JD', color: 'bg-secondary' }, { extra: 8 }],
    mom: { title: 'Architecture Sprint Planning — MOM', date: 'Apr 26, 2026', decisions: ['Prioritize auth refactor before new features'], actionItems: [{ task: 'Auth middleware refactor', assignee: 'Jane Doe', due: 'May 2' }], notes: 'Sprint planning session focused on technical debt.' }
  },
];

export default function AdminMeetings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState(MEETINGS);
  const [searchQ, setSearchQ] = useState('');
  const [openDD, setOpenDD] = useState(null);

  const filtered = meetings.filter(m => !searchQ || m.title.toLowerCase().includes(searchQ.toLowerCase()));



  function cancelMeeting(idx) {
    if (window.confirm(`Cancel "${meetings[idx].title}"?`)) {
      const updated = [...meetings]; updated.splice(idx, 1); setMeetings(updated);
    }
    setOpenDD(null);
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
        <div>
          <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">Meetings</h1>
          <p className="font-headline italic text-xl text-outline">Schedule, review, and track your team syncs.</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-80">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
            <input className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" placeholder="Search meetings..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
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

      {/* Table */}
      <div className="ts-card overflow-hidden mb-12">
        <table className="ts-table">
          <thead>
            <tr><th>Meeting Title</th><th>Date & Time</th><th>Participants</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map((m, idx) => (
              <tr key={m.id} className="cursor-pointer group" onClick={() => navigate('/admin/meeting-detail')}>
                <td>
                  <p className="font-headline text-lg text-on-surface group-hover:text-primary transition-colors">{m.title}</p>
                  <p className="text-xs text-outline">Project: {m.project}</p>
                </td>
                <td className="font-mono text-xs text-on-surface-variant">{m.date}</td>
                <td>
                  <div className="flex -space-x-1.5">
                    {m.participants.map((p, pi) => p.extra
                      ? <div key={pi} className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-[9px] font-bold ring-2 ring-white">+{p.extra}</div>
                      : <Avatar key={pi} name={p.initials} size="28" round={true} style={{ marginLeft: '-4px', border: '2px solid white' }} />
                    )}
                  </div>
                </td>
                <td className="text-right relative">
                  <span className="material-symbols-outlined text-outline hover:text-on-surface transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); setOpenDD(openDD === idx ? null : idx); }}>more_vert</span>
                  <div className={`ts-dropdown ${openDD === idx ? 'open' : ''}`}>
                    <button className="ts-dropdown-item" onClick={(e) => { e.stopPropagation(); navigate('/admin/meeting-detail'); setOpenDD(null); }}><span className="material-symbols-outlined text-sm">visibility</span>View Details</button>
                    <button className="ts-dropdown-item" onClick={(e) => { e.stopPropagation(); navigate('/admin/mom-detail'); setOpenDD(null); }}><span className="material-symbols-outlined text-sm">description</span>View MOM</button>
                    <div className="ts-dropdown-sep"></div>
                    <button className="ts-dropdown-item danger" onClick={(e) => { e.stopPropagation(); cancelMeeting(idx); }}><span className="material-symbols-outlined text-sm">cancel</span>Cancel Meeting</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="text-xs text-outline font-medium">Showing <span className="text-on-surface">{filtered.length}</span> meetings</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-outline-variant/15 text-outline hover:bg-surface-container-low transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
            <button className="p-2 rounded-lg border border-outline-variant/15 text-on-surface bg-surface-container-low hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
          </div>
        </div>
      </div>


    </>
  );
}
