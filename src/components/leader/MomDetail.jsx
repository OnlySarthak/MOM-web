import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Avatar from 'react-avatar';

const API_BASE = 'http://localhost:5000/api';

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...opts });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export default function LeaderMomDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const momId = searchParams.get('id');

  const [momData, setMomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({ narrative: '', decisions: [], participants: [] });
  const [newParticipant, setNewParticipant] = useState('');

  function loadMom() {
    if (!momId) { setLoading(false); return; }
    apiFetch(`/leader/moms/${momId}`)
      .then(res => {
        const d = res.data || {};
        setMomData(d);
        setEditData({
          narrative: d.summary || '',
          decisions: Array.isArray(d.decisions) ? d.decisions : [],
          participants: Array.isArray(d.presentAttendees) ? d.presentAttendees : [],
        });
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadMom(); }, [momId]);

  function addDecision() { setEditData(prev => ({ ...prev, decisions: [...prev.decisions, ''] })); }
  function removeDecision(idx) { setEditData(prev => ({ ...prev, decisions: prev.decisions.filter((_, i) => i !== idx) })); }
  function updateDecision(idx, value) { setEditData(prev => ({ ...prev, decisions: prev.decisions.map((d, i) => i === idx ? value : d) })); }
  function removeParticipant(name) { setEditData(prev => ({ ...prev, participants: prev.participants.filter(p => p.name !== name) })); }

  async function handleSave() {
    try {
      await apiFetch(`/leader/moms/${momId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summery: editData.narrative, // backend uses 'summery' (typo preserved)
          decisions: editData.decisions,
          presentAttendees: editData.participants,
        }),
      });
      setShowEdit(false);
      loadMom();
    } catch (err) {
      alert('Failed to save: ' + err.message);
    }
  }

  async function handleApprove(sId) {
    try {
      await apiFetch(`/leader/moms/suggestion/${sId}/approve`, { method: 'PUT' });
      loadMom();
    } catch (e) {
      alert("Failed to approve suggestion: " + e.message);
    }
  }

  async function handleReject(sId) {
    try {
      await apiFetch(`/leader/moms/suggestion/${sId}/reject`, { method: 'PUT' });
      loadMom();
    } catch (e) {
      alert("Failed to reject suggestion: " + e.message);
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-outline animate-pulse">Loading MOM…</div>;
  if (error) return <div className="flex items-center justify-center h-64 text-error text-sm">Failed to load MOM: {error}</div>;
  if (!momData) return <div className="flex items-center justify-center h-64 text-outline text-sm">MOM not found.</div>;

  const decisions = Array.isArray(momData.decisions) ? momData.decisions : [];
  // presentAttendees → participants, show functionalRole below name
  const participants = Array.isArray(momData.presentAttendees) ? momData.presentAttendees : [];
  const pendingTasks = Array.isArray(momData.pendingTasks) ? momData.pendingTasks : [];
  const suggestions = Array.isArray(momData.suggestions) ? momData.suggestions : [];
  const meetingId = momData.meetingId || null;

  return (
    <>
      <Link to="/leader/mom-list" className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:-translate-x-1 transition-transform mb-10">
        <span className="material-symbols-outlined text-sm">arrow_back</span>Back to MOMs
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-14">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs tracking-tight text-outline bg-surface-container px-2 py-0.5 rounded uppercase">{momData._id}</span>
            <div className="flex items-center gap-1.5 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-widest uppercase">Archived</span>
            </div>
          </div>
          {/* title = MeetingTitle */}
          <h1 className="font-headline text-5xl text-on-surface leading-tight mb-4">{momData.MeetingTitle || '—'}</h1>
          <p className="font-mono text-sm text-outline">
            {momData.createdAt ? new Date(momData.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          {meetingId && (
            <button className="btn-secondary gap-2" onClick={() => navigate(`/leader/meeting-detail?id=${meetingId}`)}>
              <span className="material-symbols-outlined text-sm">calendar_today</span>View Meeting
            </button>
          )}
          <button className="btn-primary gap-2" onClick={() => setShowEdit(true)}>
            <span className="material-symbols-outlined text-sm">edit</span>Edit MOM
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-14">
          {/* Narrative = summary — first-letter styling consistent */}
          <section>
            <h2 className="font-headline text-2xl text-on-surface mb-5 italic opacity-80">The Narrative</h2>
            <div className="ts-card p-8">
              <p className="font-body text-lg text-on-surface-variant leading-relaxed first-letter:text-4xl first-letter:font-headline first-letter:mr-2 first-letter:float-left first-letter:text-primary first-letter:leading-none">
                {momData.summary || 'No summary available.'}
              </p>
            </div>
          </section>
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
                    {/* functionalRole below name per spec */}
                    <p className="text-[10px] uppercase text-outline tracking-wider">{p.functionalRole || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dialogue / Suggestions */}
          <section>
            <h3 className="font-headline text-xl text-on-surface mb-5 italic">Dialogue</h3>
            <div className="space-y-5">
              {suggestions.length === 0 ? (
                <p className="text-sm text-outline italic">No suggestions yet.</p>
              ) : suggestions.map((s, i) => (
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
                  <p className="text-sm text-on-surface-variant italic leading-relaxed mb-2">"{s.suggestionText || ''}"</p>
                  
                  {s.status === 'pending' && (
                    <div className="flex items-center gap-2">
                       <button className="p-1.5 rounded-lg bg-surface-container hover:bg-secondary/10 text-outline hover:text-secondary transition-colors" onClick={() => handleApprove(s._id)} title="Accept">
                         <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                       </button>
                       <button className="p-1.5 rounded-lg bg-surface-container hover:bg-error/10 text-outline hover:text-error transition-colors" onClick={() => handleReject(s._id)} title="Reject">
                         <span className="material-symbols-outlined text-[14px]">thumb_down</span>
                       </button>
                    </div>
                  )}
                </div>
              ))}
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

      {/* Edit MOM Slide-over Panel */}
      <div
        className={`fixed inset-0 bg-on-surface/20 backdrop-blur-sm transition-opacity duration-300 ${showEdit ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ zIndex: 200 }}
        onClick={() => setShowEdit(false)}
      ></div>
      <div
        className={`fixed top-0 right-0 bottom-0 w-full md:w-[440px] bg-surface flex flex-col shadow-2xl transition-transform duration-300 overflow-hidden ${showEdit ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ zIndex: 201 }}
      >
        <div className="ts-slideover-header">
          <h2 className="font-headline text-xl text-on-surface">Edit MOM</h2>
          <button className="ts-close-btn" onClick={() => setShowEdit(false)}><span className="material-symbols-outlined">close</span></button>
        </div>
        <div className="flex-1 overflow-y-auto ts-slideover-body space-y-6">
          {/* Narrative */}
          <div>
            <label className="ts-label">Narrative</label>
            <textarea
              className="ts-field resize-none h-28"
              value={editData.narrative}
              onChange={e => setEditData({ ...editData, narrative: e.target.value })}
            ></textarea>
          </div>

          {/* Key Decisions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="ts-label mb-0">Key Decisions</label>
              <button className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:bg-primary/5 px-2 py-1 rounded-lg transition-colors" onClick={addDecision} type="button">
                <span className="material-symbols-outlined text-sm">add</span>Add
              </button>
            </div>
            <div className="space-y-2">
              {editData.decisions.map((d, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-headline text-primary text-sm italic w-6 flex-shrink-0">{String(idx + 1).padStart(2, '0')}.</span>
                  <input
                    className="ts-field flex-1"
                    type="text"
                    placeholder={`Decision ${idx + 1}...`}
                    value={d}
                    onChange={e => updateDecision(idx, e.target.value)}
                  />
                  <button className="p-1.5 text-outline hover:text-error rounded-lg transition-colors flex-shrink-0" onClick={() => removeDecision(idx)} type="button">
                    <span className="material-symbols-outlined text-sm">remove_circle</span>
                  </button>
                </div>
              ))}
              {editData.decisions.length === 0 && (
                <p className="text-sm text-outline italic">No decisions yet. Click "Add" to create one.</p>
              )}
            </div>
          </div>

          {/* Participants — functionalRole shown */}
          <div>
            <label className="ts-label">Participants</label>
            <div className="space-y-2 mb-3">
              {editData.participants.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-surface-container-low rounded-xl">
                  <Avatar name={p.name || '?'} size="32" round={true} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-on-surface">{p.name}</p>
                    <p className="text-[10px] uppercase text-outline tracking-wider">{p.functionalRole || '—'}</p>
                  </div>
                  <button className="p-1 text-outline hover:text-error rounded-lg transition-colors" onClick={() => removeParticipant(p.name)} type="button">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary w-full justify-center text-sm mt-4" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
