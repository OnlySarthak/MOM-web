import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Avatar from 'react-avatar';

const API_BASE = 'http://localhost:5000/api';

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export default function AdminMomDetail() {
  const [searchParams] = useSearchParams();
  const momId = searchParams.get('id');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!momId) { setLoading(false); return; }
    apiFetch(`/admin/moms/${momId}`)
      .then(res => setData(res.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [momId]);

  if (loading) return <div className="flex items-center justify-center h-64 text-outline animate-pulse">Loading MOM…</div>;
  if (error) return <div className="flex items-center justify-center h-64 text-error text-sm">Failed to load MOM: {error}</div>;
  if (!data) return <div className="flex items-center justify-center h-64 text-outline text-sm">MOM not found.</div>;

  const mom = data;
  const decisions = Array.isArray(mom.decisions) ? mom.decisions : [];
  // presentAttendees → participants with functionalRole
  const participants = Array.isArray(mom.presentAttendees) ? mom.presentAttendees : [];
  const pendingTasks = Array.isArray(mom.pendingTasks) ? mom.pendingTasks : [];
  const meetingId = mom.meetingId || null;

  return (
    <>
      {/* Breadcrumb */}
      <Link to="/admin/mom-list" className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:-translate-x-1 transition-transform mb-10">
        <span className="material-symbols-outlined text-sm">arrow_back</span>Back to MOMs
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-14">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs tracking-tight text-outline bg-surface-container px-2 py-0.5 rounded uppercase">{mom._id}</span>
            <div className="flex items-center gap-1.5 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-widest uppercase">Archived</span>
            </div>
          </div>
          {/* title = MeetingTitle */}
          <h1 className="font-headline text-5xl text-on-surface leading-tight mb-4">{mom.MeetingTitle || '—'}</h1>
          <p className="font-mono text-sm text-outline">
            {mom.createdAt ? new Date(mom.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
          </p>
        </div>
        {/* View Meeting → meetingId */}
        {meetingId && (
          <Link to={`/admin/meeting-detail?id=${meetingId}`} className="btn-secondary gap-2 flex-shrink-0">
            <span className="material-symbols-outlined text-sm">calendar_today</span>View Meeting
          </Link>
        )}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Main body */}
        <div className="col-span-12 lg:col-span-8 space-y-14">
          {/* Narrative = summary — keep first-letter styling consistent */}
          <section>
            <h2 className="font-headline text-2xl text-on-surface mb-5 italic opacity-80">The Narrative</h2>
            <div className="ts-card p-8">
              <p className="font-body text-lg text-on-surface-variant leading-relaxed first-letter:text-4xl first-letter:font-headline first-letter:mr-2 first-letter:float-left first-letter:text-primary first-letter:leading-none">
                {mom.summary || 'No summary available.'}
              </p>
            </div>
          </section>

          {/* Key Decisions */}
          <section>
            <h2 className="font-headline text-2xl text-on-surface mb-5 italic opacity-80">Key Decisions</h2>
            {decisions.length === 0 ? (
              <p className="text-sm text-outline italic">No decisions recorded.</p>
            ) : (
              <div className="space-y-4">
                {decisions.map((d, i) => (
                  <div key={i} className={`flex items-start gap-4 p-5 ts-card ${i === 1 ? 'border-l-4 border-primary' : ''}`}>
                    <span className="font-headline text-primary text-2xl italic">{String(i + 1).padStart(2, '0')}.</span>
                    <p className="font-body text-on-surface py-1">{d}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Action Items = pendingTasks */}
          <section>
            <h2 className="font-headline text-2xl text-on-surface mb-5 italic opacity-80">Pending Actions</h2>
            <div className="ts-card overflow-hidden">
              <table className="ts-table">
                <thead><tr><th>Task Details</th><th>Assignee</th></tr></thead>
                <tbody>
                  {pendingTasks.length === 0 ? (
                    <tr><td colSpan={2} className="text-center text-outline py-6 text-sm">No pending tasks.</td></tr>
                  ) : pendingTasks.map((task, i) => (
                    <tr key={task._id || i}>
                      <td><div className="flex items-center gap-3"><span className="text-sm font-medium">{task.title || '—'}</span></div></td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Avatar name={task.responsibleId || 'User'} size="24" round={true} />
                          <span className="text-xs text-on-surface-variant">{task.responsibleId || '—'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-10">
          {/* Participants — show functionalRole below name */}
          <section>
            <h3 className="font-headline text-xl text-on-surface mb-5 italic">Participants</h3>
            <div className="ts-card p-5 space-y-4">
              {participants.length === 0 ? (
                <p className="text-sm text-outline italic">No participants recorded.</p>
              ) : participants.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Avatar name={p.name || '?'} size="40" round={true} />
                  <div>
                    <p className="text-sm font-semibold">{p.name}</p>
                    {/* show functionalRole below name */}
                    <p className="text-[10px] uppercase text-outline tracking-wider">{p.functionalRole || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Workspace Insight */}
          <div className="bg-primary/5 rounded-2xl p-6 overflow-hidden relative group">
            <div className="relative z-10">
              <h5 className="font-headline text-lg mb-2">Workspace Insight</h5>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {mom.contextLable ? <><span className="text-primary font-medium">{mom.contextLable}</span> — </> : ''}
                {mom.insights || 'No additional insights.'}
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-10 border-t border-outline-variant/10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button className="btn-secondary gap-2 text-sm"><span className="material-symbols-outlined text-sm">download</span>Export PDF</button>
        </div>
        <p className="font-mono text-[10px] uppercase text-outline tracking-widest">
          {mom.updatedAt ? `Last sync: ${new Date(mom.updatedAt).toLocaleString()}` : ''}
        </p>
      </div>
    </>
  );
}
