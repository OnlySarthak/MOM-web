import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Avatar from 'react-avatar';

const API_BASE = 'http://localhost:5000/api';

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...opts });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export default function MemberMomDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const momId = searchParams.get('id');

  const [momData, setMomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogueText, setDialogueText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [posting, setPosting] = useState(false);

  function loadMom() {
    if (!momId) { setLoading(false); return; }
    apiFetch(`/member/moms/${momId}`)
      .then(res => {
        const d = res.data || {};
        setMomData(d);
        setSuggestions(Array.isArray(d.suggestions) ? d.suggestions : []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadMom(); }, [momId]);

  async function handlePost() {
    if (!dialogueText.trim()) return;
    setPosting(true);
    try {
      await apiFetch(`/member/moms/${momId}/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: dialogueText.trim() }),
      });
      setDialogueText('');
      loadMom();
    } catch (err) {
      alert('Failed to post suggestion: ' + err.message);
    } finally {
      setPosting(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-outline animate-pulse">Loading MOM…</div>;
  if (error) return <div className="flex items-center justify-center h-64 text-error text-sm">Failed to load MOM: {error}</div>;
  if (!momData) return <div className="flex items-center justify-center h-64 text-outline text-sm">MOM not found.</div>;

  const decisions = Array.isArray(momData.decisions) ? momData.decisions : [];
  const participants = Array.isArray(momData.presentAttendees) ? momData.presentAttendees : [];
  const pendingTasks = Array.isArray(momData.pendingTasks) ? momData.pendingTasks : [];
  const meetingId = momData.meetingId || null;

  return (
    <>
      <Link to="/member/mom-list" className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:-translate-x-1 transition-transform mb-10">
        <span className="material-symbols-outlined text-sm">arrow_back</span>Back to MOMs
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-14">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs tracking-tight text-outline bg-surface-container px-2 py-0.5 rounded uppercase">{momData._id}</span>
            <div className="flex items-center gap-1.5 text-primary"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span><span className="text-[10px] font-bold tracking-widest uppercase">Archived</span></div>
          </div>
          {/* title = MeetingTitle */}
          <h1 className="font-headline text-5xl text-on-surface leading-tight mb-4">{momData.MeetingTitle || '—'}</h1>
          <p className="font-mono text-sm text-outline">
            {momData.createdAt ? new Date(momData.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
          </p>
        </div>
        {meetingId && (
          <button className="btn-secondary gap-2 flex-shrink-0" onClick={() => navigate(`/member/meeting-detail?id=${meetingId}`)}>
            <span className="material-symbols-outlined text-sm">calendar_today</span>View Meeting
          </button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-14">
          {/* Narrative = summary */}
          <section>
            <h2 className="font-headline text-2xl text-on-surface mb-5 italic opacity-80">The Narrative</h2>
            <div className="ts-card p-8">
              <p className="font-body text-lg text-on-surface-variant leading-relaxed first-letter:text-4xl first-letter:font-headline first-letter:mr-2 first-letter:float-left first-letter:text-primary first-letter:leading-none">
                {momData.summary || 'No summary available.'}
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

          {/* Pending Actions */}
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
                      <td><span className="text-sm font-medium">{task.title || '—'}</span></td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Avatar name={task.resposibleName || 'User'} size="24" round={true} />
                          <span className="text-xs text-on-surface-variant">{task.resposibleName || '—'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-10">
          {/* Participants — from presentAttendees with functionalRole */}
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
                    <p className="text-[10px] uppercase text-outline tracking-wider">{p.functionalRole || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dialogue / Suggestions — from API, with POST to create suggestions */}
          <section>
            <h3 className="font-headline text-xl text-on-surface mb-5 italic">Dialogue</h3>
            <div className="space-y-5">
              {suggestions.map((s, i) => (
                <div key={s._id || i} className="relative pl-5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-outline-variant/30">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-mono text-outline uppercase">{s.suggestedBy?.name || 'Member'}</p>
                    {s.status === 'accepted' && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-secondary/10 text-secondary">
                        <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>Accepted
                      </span>
                    )}
                    {s.status === 'rejected' && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-outline-variant/20 text-outline">
                        <span className="material-symbols-outlined text-[10px]">close</span>Not accepted
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant italic leading-relaxed">"{s.suggestionText || ''}"</p>
                </div>
              ))}

              {/* Member dialogue input — sends POST /member/moms/:id/suggestions */}
              <div className="ts-card p-4 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <textarea
                  className="w-full bg-transparent border-none text-sm placeholder:text-outline focus:ring-0 resize-none h-16 font-body outline-none"
                  placeholder="Add a suggestion or comment..."
                  value={dialogueText}
                  onChange={e => setDialogueText(e.target.value)}
                ></textarea>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-outline-variant/5">
                  <div className="flex gap-2">
                    <span className="material-symbols-outlined text-outline text-lg cursor-pointer hover:text-primary">mood</span>
                  </div>
                  <button
                    className="text-xs font-bold text-primary uppercase tracking-widest hover:bg-primary-fixed px-3 py-1 rounded transition-colors disabled:opacity-50"
                    onClick={handlePost}
                    disabled={posting}
                  >{posting ? 'Posting…' : 'Post'}</button>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-primary/5 rounded-2xl p-6 overflow-hidden relative group">
            <div className="relative z-10">
              <h5 className="font-headline text-lg mb-2">Workspace Insight</h5>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {momData.contextLable ? <><span className="text-primary font-medium">{momData.contextLable}</span> — </> : ''}
                {momData.insights || 'No additional insights.'}
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t border-outline-variant/10 flex justify-between items-center">
        <button className="btn-secondary gap-2 text-sm"><span className="material-symbols-outlined text-sm">download</span>Export PDF</button>
        <p className="font-mono text-[10px] uppercase text-outline tracking-widest">
          {momData.updatedAt ? `Last sync: ${new Date(momData.updatedAt).toLocaleString()}` : ''}
        </p>
      </div>
    </>
  );
}
