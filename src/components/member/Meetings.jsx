import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';

const MEETINGS = [
  { id:1, title:'Product Strategy Sync', project:'Roadmap Q2', date:'Apr 24, 2026 · 10:30 AM', organizer:{name:'Sarah Miller',initials:'SM',color:'bg-primary'}, status:'Scheduled', participants:[{initials:'DC',color:'bg-secondary'},{initials:'JD',color:'bg-tertiary'},{extra:3}], mom:{title:'Product Strategy Sync — MOM',date:'Apr 24, 2026',decisions:['Align on Q2 roadmap top features'],actionItems:[{task:'Prepare deck',assignee:'Sarah Miller',due:'Apr 26'}],notes:'Q2 roadmap priorities discussed.'} },
  { id:2, title:'Weekly Engineering Review', project:'Engineering', date:'Apr 22, 2026 · 02:00 PM', organizer:{name:'David Chen',initials:'DC',color:'bg-secondary'}, status:'Completed', participants:[{initials:'JD',color:'bg-primary'},{initials:'MV',color:'bg-outline'}], mom:{title:'Weekly Engineering Review — MOM',date:'Apr 22, 2026',decisions:['Auth refactor top priority'],actionItems:[],notes:'Sprint status check.'} },
  { id:3, title:'Design Review: Mobile UI', project:'TeamSync Mobile', date:'Apr 26, 2026 · 04:30 PM', organizer:{name:'Jane Doe',initials:'JD',color:'bg-surface-container-high'}, status:'Scheduled', participants:[{initials:'EV',color:'bg-primary'}], mom:{title:'Design Review: Mobile UI — MOM',date:'Apr 26, 2026',decisions:[],actionItems:[],notes:'Upcoming design review.'} },
];

export default function MemberMeetings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meetings] = useState(MEETINGS);
  const [searchQ, setSearchQ] = useState('');
  const [showMom, setShowMom] = useState(false);
  const [activeMom, setActiveMom] = useState(null);
  const [openDD, setOpenDD] = useState(null);

  const filtered = meetings.filter(m => !searchQ || m.title.toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
        <div>
          <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">Meetings</h1>
          <p className="font-headline italic text-xl text-outline">Your upcoming and past team syncs.</p>
        </div>
      </div>

      <div className="flex w-full md:w-auto gap-4 mb-8">
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

      <div className="ts-card overflow-hidden mb-12">
        <table className="ts-table">
          <thead><tr><th>Meeting Title</th><th>Date & Time</th><th>Organizer</th><th>Participants</th><th></th></tr></thead>
          <tbody>
            {filtered.map((m, idx) => (
              <tr key={m.id} className="cursor-pointer group" onClick={() => { setActiveMom(m); setShowMom(true); }}>
                <td><p className="font-headline text-lg text-on-surface group-hover:text-primary transition-colors">{m.title}</p><p className="text-xs text-outline">Project: {m.project}</p></td>
                <td className="font-mono text-xs text-on-surface-variant">{m.date}</td>
                <td><div className="flex items-center gap-2"><Avatar name={m.organizer.name} size="28" round={true} /><span className="text-sm font-medium">{m.organizer.name}</span></div></td>
                <td><div className="flex -space-x-1.5">{m.participants.map((p, pi) => p.extra ? <div key={pi} className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-[9px] font-bold ring-2 ring-white">+{p.extra}</div> : <Avatar key={pi} name={p.initials} size="28" round={true} style={{ marginLeft: '-4px', border: '2px solid white' }} />)}</div></td>
                <td className="text-right relative">
                  <span className="material-symbols-outlined text-outline hover:text-on-surface cursor-pointer" onClick={e => { e.stopPropagation(); setOpenDD(openDD === idx ? null : idx); }}>more_vert</span>
                  <div className={`ts-dropdown ${openDD === idx ? 'open' : ''}`}>
                    <button className="ts-dropdown-item" onClick={e => { e.stopPropagation(); navigate('/member/meeting-detail'); setOpenDD(null); }}><span className="material-symbols-outlined text-sm">visibility</span>View Details</button>
                    <button className="ts-dropdown-item" onClick={e => { e.stopPropagation(); navigate('/member/mom-detail'); setOpenDD(null); }}><span className="material-symbols-outlined text-sm">description</span>View MOM</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="text-xs text-outline">Showing <span className="text-on-surface">{filtered.length}</span> meetings</p>
        </div>
      </div>

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
              <div className="mb-6"><p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-3">Key Decisions</p>
                {activeMom.mom.decisions.length > 0 ? <ul className="space-y-2">{activeMom.mom.decisions.map((d, i) => <li key={i} className="flex items-start gap-2"><span className="material-symbols-outlined text-secondary text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span><span className="text-sm text-on-surface">{d}</span></li>)}</ul> : <p className="text-sm text-outline italic">No decisions recorded yet.</p>}
              </div>
              <div className="mb-8"><p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-2">Insights</p><p className="text-sm text-on-surface-variant leading-relaxed">{activeMom.mom.notes}</p></div>
              <button className="btn-primary gap-2 text-sm w-full justify-center" onClick={() => { setShowMom(false); navigate('/member/mom-detail'); }}><span className="material-symbols-outlined text-sm">open_in_new</span>View Full MOM</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
