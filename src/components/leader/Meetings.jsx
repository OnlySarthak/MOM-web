import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';

const MEETINGS = [
  {
    id: 1, title: 'Quarterly Brand Alignment', project: 'Rebranding 2026',
    date: 'Apr 24, 2026 · 10:00 AM', organizer: { name: 'Sarah Miller', initials: 'SM', color: 'bg-primary' },
    agenda: 'Review brand palette options and finalize direction for the 2026 rebrand. Discuss logo refresh concepts.',
    status: 'Scheduled',
    participants: [{ initials: 'DC', color: 'bg-secondary' }, { initials: 'JD', color: 'bg-tertiary' }, { extra: 4 }],
    mom: { title: 'Quarterly Brand Alignment — MOM', date: 'Apr 24, 2026', decisions: ['Finalize brand palette by end of sprint'], actionItems: [{ task: 'Prepare logo concepts', assignee: 'David Chen', due: 'Apr 28' }], notes: 'Brand refresh prioritized.' }
  },
  {
    id: 2, title: 'Mobile App UX Review', project: 'TeamSync Mobile',
    date: 'Apr 22, 2026 · 02:30 PM', organizer: { name: 'David Chen', initials: 'DC', color: 'bg-secondary' },
    agenda: 'Review mobile navigation patterns and discuss dark mode implementation timeline.',
    status: 'Completed',
    participants: [{ initials: 'JD', color: 'bg-primary' }, { initials: 'MV', color: 'bg-outline' }],
    mom: { title: 'Mobile App UX Review — MOM', date: 'Apr 22, 2026', decisions: ['Adopt bottom nav pattern'], actionItems: [], notes: 'Navigation pattern decided.' }
  },
  {
    id: 3, title: 'Architecture Sprint Planning', project: 'Engineering',
    date: 'Apr 26, 2026 · 11:30 AM', organizer: { name: 'Marcus V.', initials: 'MV', color: 'bg-tertiary' },
    agenda: 'Plan sprint tasks and prioritize auth refactor work.',
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
  const [showCreate, setShowCreate] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [openDD, setOpenDD] = useState(null);
  const [form, setForm] = useState({ title: '', project: '', agenda: '' });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 3;

  const filtered = meetings.filter(m => !searchQ || m.title.toLowerCase().includes(searchQ.toLowerCase()));
  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  function cancelMeeting(idx) {
    if (window.confirm(`Cancel "${meetings[idx].title}"?`)) { const u = [...meetings]; u.splice(idx, 1); setMeetings(u); }
    setOpenDD(null);
  }

  function handleNext(e) {
    e.preventDefault();
    setCreateStep(2);
    setUploadProgress(0);
    setUploadFile(null);
    setUploading(false);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadFile(file);
    setUploading(true);
    setUploadProgress(0);
    // Simulate upload progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 20 + 5;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setUploading(false);
      }
      setUploadProgress(Math.min(Math.round(prog), 100));
    }, 200);
  }

  function handleDone() {
    const initials = user.name.split(' ').map(n => n[0]).join('');
    setMeetings([{
      id: Date.now(),
      title: form.title,
      project: form.project || 'General',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' · TBD',
      organizer: { name: user.name, initials, color: 'bg-primary' },
      agenda: form.agenda,
      status: 'Scheduled',
      participants: [],
      mom: { title: form.title + ' — MOM', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), decisions: [], actionItems: [], notes: '' }
    }, ...meetings]);
    setShowCreate(false);
    setCreateStep(1);
    setForm({ title: '', project: '', agenda: '' });
    setUploadFile(null);
  }

  function closeCreateModal() {
    setShowCreate(false);
    setCreateStep(1);
    setForm({ title: '', project: '', agenda: '' });
    setUploadFile(null);
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
        <div>
          <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">Meetings</h1>
          <p className="font-headline italic text-xl text-outline">Schedule, review, and track your team syncs.</p>
        </div>
        <button className="btn-primary gap-2 text-sm flex-shrink-0" onClick={() => setShowCreate(true)}>
          <span className="material-symbols-outlined text-lg">add</span>Create Meeting
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
          <thead><tr><th>Meeting Title</th><th>Date & Time</th><th>Participants</th><th></th></tr></thead>
          <tbody>
            {paginated.map((m, idx) => (
              <tr key={m.id} className="cursor-pointer group" onClick={() => navigate('/leader/meeting-detail')}>
                <td><p className="font-headline text-lg text-on-surface group-hover:text-primary transition-colors">{m.title}</p><p className="text-xs text-outline">Project: {m.project}</p></td>
                <td className="font-mono text-xs text-on-surface-variant">{m.date}</td>
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



      {/* Create Meeting Modal — Step 1 */}
      <div className={`ts-modal-overlay ${showCreate && createStep === 1 ? 'open' : ''}`} onClick={e => { if (e.target === e.currentTarget) closeCreateModal(); }}>
        <div className="ts-modal">
          <div className="ts-modal-header">
            <div>
              <h2>Create Meeting</h2>
              <p className="text-xs text-outline mt-0.5">Step 1 of 2 — Meeting Details</p>
            </div>
            <button className="ts-close-btn" onClick={closeCreateModal}><span className="material-symbols-outlined">close</span></button>
          </div>
          <div className="ts-modal-body">
            <form id="create-meeting-form" className="space-y-5" onSubmit={handleNext}>
              <div><label className="ts-label">Meeting Title *</label><input className="ts-field" type="text" placeholder="e.g. Sprint Review #13" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div><label className="ts-label">Project Name</label><input className="ts-field" type="text" placeholder="e.g. Rebranding 2026" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} /></div>
              <div><label className="ts-label">Agenda</label><textarea className="ts-field resize-none h-24" placeholder="Brief agenda for this meeting..." value={form.agenda} onChange={e => setForm({ ...form, agenda: e.target.value })}></textarea></div>
            </form>
          </div>
          <div className="ts-modal-footer">
            <button className="btn-secondary text-sm" onClick={closeCreateModal}>Cancel</button>
            <button className="btn-primary text-sm" onClick={() => document.getElementById('create-meeting-form').requestSubmit()}>
              Next <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Create Meeting Modal — Step 2 */}
      <div className={`ts-modal-overlay ${showCreate && createStep === 2 ? 'open' : ''}`} onClick={e => { if (e.target === e.currentTarget) closeCreateModal(); }}>
        <div className="ts-modal">
          <div className="ts-modal-header">
            <div>
              <h2>Upload Meeting Audio</h2>
              <p className="text-xs text-outline mt-0.5">Step 2 of 2 — Audio Recording</p>
            </div>
            <button className="ts-close-btn" onClick={closeCreateModal}><span className="material-symbols-outlined">close</span></button>
          </div>
          <div className="ts-modal-body">
            <div className="space-y-6">
              <div>
                <label className="ts-label">Meeting Audio File</label>
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-outline-variant/30 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/3 transition-all">
                  <span className="material-symbols-outlined text-3xl text-outline mb-2">upload_file</span>
                  <p className="text-sm text-on-surface-variant font-medium">Click to upload audio</p>
                  <p className="text-xs text-outline mt-1">MP3, WAV, M4A up to 500MB</p>
                  <input type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
              {uploadFile && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                    <span className="material-symbols-outlined text-primary text-lg">audio_file</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">{uploadFile.name}</p>
                      <p className="text-xs text-outline">{(uploadFile.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                    {uploadProgress === 100 && <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <p className="text-xs text-outline font-medium">{uploading ? 'Uploading...' : 'Upload complete'}</p>
                      <p className="text-xs font-mono text-primary font-bold">{uploadProgress}%</p>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="ts-modal-footer">
            <button className="btn-secondary text-sm" onClick={() => setCreateStep(1)}>
              <span className="material-symbols-outlined text-sm">arrow_back</span> Back
            </button>
            <button className="btn-primary text-sm" onClick={handleDone} disabled={uploading}>
              <span className="material-symbols-outlined text-sm">check</span>Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
