import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';

const ALL_PARTICIPANTS = [
  { name: 'Julian Pierce', role: 'Design Lead' },
  { name: 'Sarah Kim', role: 'Product Manager' },
  { name: "Liam O'Brien", role: 'CTO' },
  { name: 'Elena Rossi', role: 'Brand Strategist' },
  { name: 'Marcus Chen', role: 'Developer' },
  { name: 'Nina Park', role: 'UX Researcher' },
];

export default function LeaderMomDetail() {
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({
    insights: 'This MOM is linked to the Brand Vision 2024 project epic.',
    decisions: [
      'Standardize #faf9f6 as the primary canvas color.',
      'Adopt Newsreader for all editorial-style headers.',
      'De-prioritize 1px borders in favor of tonal background shifts.',
    ],
    participants: [
      { name: 'Julian Pierce', role: 'Design Lead' },
      { name: 'Sarah Kim', role: 'Product Manager' },
      { name: "Liam O'Brien", role: 'CTO' },
    ],
    narrative: 'The discussion centered on evolving our visual identity to reflect a more sophisticated, "Digital Atelier" aesthetic. We scrutinized the current SaaS dashboard fatigue and agreed to pivot toward high-contrast typography and tonal layering.',
  });
  const [newParticipant, setNewParticipant] = useState('');

  function addDecision() {
    setEditData(prev => ({ ...prev, decisions: [...prev.decisions, ''] }));
  }

  function removeDecision(idx) {
    setEditData(prev => ({ ...prev, decisions: prev.decisions.filter((_, i) => i !== idx) }));
  }

  function updateDecision(idx, value) {
    setEditData(prev => ({
      ...prev,
      decisions: prev.decisions.map((d, i) => i === idx ? value : d),
    }));
  }

  function addParticipant() {
    if (!newParticipant) return;
    const found = ALL_PARTICIPANTS.find(p => p.name === newParticipant);
    if (found && !editData.participants.find(p => p.name === found.name)) {
      setEditData(prev => ({ ...prev, participants: [...prev.participants, found] }));
    }
    setNewParticipant('');
  }

  function removeParticipant(name) {
    setEditData(prev => ({ ...prev, participants: prev.participants.filter(p => p.name !== name) }));
  }

  const availableToAdd = ALL_PARTICIPANTS.filter(p => !editData.participants.find(ep => ep.name === p.name));

  return (
    <>
      <Link to="/leader/mom-list" className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:-translate-x-1 transition-transform mb-10">
        <span className="material-symbols-outlined text-sm">arrow_back</span>Back to MOMs
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-14">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs tracking-tight text-outline bg-surface-container px-2 py-0.5 rounded uppercase">MOM-2023-Q4-01</span>
            <div className="flex items-center gap-1.5 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-widest uppercase">Archived</span>
            </div>
          </div>
          <h1 className="font-headline text-5xl text-on-surface leading-tight mb-4">Q4 Brand Strategy &amp; Visual Language Sync</h1>
          <p className="font-mono text-sm text-outline">Oct 24, 2023 • 10:00 AM — 11:30 AM EST</p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button className="btn-secondary gap-2" onClick={() => navigate('/leader/meeting-detail')}>
            <span className="material-symbols-outlined text-sm">calendar_today</span>View Meeting
          </button>
          <button className="btn-primary gap-2" onClick={() => setShowEdit(true)}>
            <span className="material-symbols-outlined text-sm">edit</span>Edit MOM
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-14">
          <section>
            <h2 className="font-headline text-2xl text-on-surface mb-5 italic opacity-80">The Narrative</h2>
            <div className="ts-card p-8">
              <p className="font-body text-lg text-on-surface-variant leading-relaxed first-letter:text-4xl first-letter:font-headline first-letter:mr-2 first-letter:float-left first-letter:text-primary first-letter:leading-none">
                The discussion centered on evolving our visual identity to reflect a more sophisticated, "Digital Atelier" aesthetic. We scrutinized the current SaaS dashboard fatigue and agreed to pivot toward high-contrast typography and tonal layering.
              </p>
            </div>
          </section>
          <section>
            <h2 className="font-headline text-2xl text-on-surface mb-5 italic opacity-80">Key Decisions</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 ts-card"><span className="font-headline text-primary text-2xl italic">01.</span><p className="font-body text-on-surface py-1">Standardize <code className="font-mono text-xs bg-surface-container px-1.5 py-0.5 rounded">#faf9f6</code> as the primary canvas color.</p></div>
              <div className="flex items-start gap-4 p-5 ts-card border-l-4 border-primary"><span className="font-headline text-primary text-2xl italic">02.</span><p className="font-body text-on-surface py-1">Adopt <span className="font-semibold italic">Newsreader</span> for all editorial-style headers.</p></div>
              <div className="flex items-start gap-4 p-5 ts-card"><span className="font-headline text-primary text-2xl italic">03.</span><p className="font-body text-on-surface py-1">De-prioritize 1px borders in favor of tonal background shifts.</p></div>
            </div>
          </section>
          <section>
            <h2 className="font-headline text-2xl text-on-surface mb-5 italic opacity-80">Pending Actions</h2>
            <div className="ts-card overflow-hidden">
              <table className="ts-table">
                <thead><tr><th>Task Details</th><th>Assignee</th></tr></thead>
                <tbody>
                  <tr><td><span className="text-sm font-medium">Update Brand Style Guide PDF</span></td><td><div className="flex items-center gap-2"><Avatar name="Aria V." size="24" round={true} /><span className="text-xs text-on-surface-variant">Aria V.</span></div></td></tr>
                  <tr><td><span className="text-sm font-medium">Develop Tailwind Config for Atelier Palette</span></td><td><div className="flex items-center gap-2"><Avatar name="Marcus T." size="24" round={true} /><span className="text-xs text-on-surface-variant">Marcus T.</span></div></td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-10">
          <section>
            <h3 className="font-headline text-xl text-on-surface mb-5 italic">Participants</h3>
            <div className="ts-card p-5 space-y-4">
              {[{ name: 'Julian Pierce', role: 'Design Lead' }, { name: 'Sarah Kim', role: 'Product Manager' }, { name: "Liam O'Brien", role: 'CTO' }].map((p, i) => (
                <div key={i} className="flex items-center gap-3"><Avatar name={p.name} size="40" round={true} /><div><p className="text-sm font-semibold">{p.name}</p><p className="text-[10px] uppercase text-outline tracking-wider">{p.role}</p></div></div>
              ))}
            </div>
          </section>

          {/* Dialogue — with Like/Dislike buttons */}
          <section>
            <h3 className="font-headline text-xl text-on-surface mb-5 italic">Dialogue</h3>
            <div className="space-y-5">
              <div className="relative pl-5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-outline-variant/30">
                <p className="text-xs font-mono text-outline mb-1 uppercase">Elena Rossi</p>
                <p className="text-sm text-on-surface-variant italic leading-relaxed">"Should we consider a darker mode for the Atelier concept, or keep it strictly paper-light?"</p>
                <div className="flex items-center gap-2 mt-2">
                  <button className="inline-flex items-center gap-1 text-[10px] text-outline hover:text-primary transition-colors px-1.5 py-0.5 rounded hover:bg-primary/5">
                    <span className="material-symbols-outlined text-sm">thumb_up</span>
                  </button>
                  <button className="inline-flex items-center gap-1 text-[10px] text-outline hover:text-error transition-colors px-1.5 py-0.5 rounded hover:bg-error/5">
                    <span className="material-symbols-outlined text-sm">thumb_down</span>
                  </button>
                </div>
              </div>
              <div className="relative pl-5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-outline-variant/30">
                <p className="text-xs font-mono text-outline mb-1 uppercase">Julian Pierce</p>
                <p className="text-sm text-on-surface-variant italic leading-relaxed">"Let's focus on the light foundation first. The 'warmth' is our differentiator."</p>
                <div className="flex items-center gap-2 mt-2">
                  <button className="inline-flex items-center gap-1 text-[10px] text-outline hover:text-primary transition-colors px-1.5 py-0.5 rounded hover:bg-primary/5">
                    <span className="material-symbols-outlined text-sm">thumb_up</span>
                  </button>
                  <button className="inline-flex items-center gap-1 text-[10px] text-outline hover:text-error transition-colors px-1.5 py-0.5 rounded hover:bg-error/5">
                    <span className="material-symbols-outlined text-sm">thumb_down</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-primary/5 rounded-2xl p-6 overflow-hidden relative group">
            <div className="relative z-10">
              <h5 className="font-headline text-lg mb-2">Workspace Insight</h5>
              <p className="text-xs text-on-surface-variant leading-relaxed">This MOM is linked to the <span className="text-primary font-medium">Brand Vision 2024</span> project epic.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t border-outline-variant/10 flex justify-between items-center">
        <button className="btn-secondary gap-2 text-sm"><span className="material-symbols-outlined text-sm">download</span>Export PDF</button>
        <p className="font-mono text-[10px] uppercase text-outline tracking-widest">Last sync: Today at 2:45 PM</p>
      </div>

      {/* Edit MOM Slide-over Panel — fixed z-index to be above navbar */}
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

          {/* Key Decisions — separate input fields */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="ts-label mb-0">Key Decisions</label>
              <button
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:bg-primary/5 px-2 py-1 rounded-lg transition-colors"
                onClick={addDecision}
                type="button"
              >
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
                  <button
                    className="p-1.5 text-outline hover:text-error rounded-lg transition-colors flex-shrink-0"
                    onClick={() => removeDecision(idx)}
                    type="button"
                    title="Remove"
                  >
                    <span className="material-symbols-outlined text-sm">remove_circle</span>
                  </button>
                </div>
              ))}
              {editData.decisions.length === 0 && (
                <p className="text-sm text-outline italic">No decisions yet. Click "Add" to create one.</p>
              )}
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className="ts-label">Participants</label>
            <div className="space-y-2 mb-3">
              {editData.participants.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-surface-container-low rounded-xl">
                  <Avatar name={p.name} size="32" round={true} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-on-surface">{p.name}</p>
                    <p className="text-[10px] uppercase text-outline tracking-wider">{p.role}</p>
                  </div>
                  <button
                    className="p-1 text-outline hover:text-error rounded-lg transition-colors"
                    onClick={() => removeParticipant(p.name)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ))}
            </div>
            {availableToAdd.length > 0 && (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    className="ts-field"
                    value={newParticipant}
                    onChange={e => setNewParticipant(e.target.value)}
                  >
                    <option value="">Add attendee…</option>
                    {availableToAdd.map(p => (
                      <option key={p.name} value={p.name}>{p.name} — {p.role}</option>
                    ))}
                  </select>
                </div>
                <button
                  className="btn-secondary text-sm flex-shrink-0 px-3"
                  onClick={addParticipant}
                  type="button"
                  disabled={!newParticipant}
                >
                  <span className="material-symbols-outlined text-sm">add</span>Add
                </button>
              </div>
            )}
          </div>

          {/* Workspace Insights */}
          <div>
            <label className="ts-label">Workspace Insights</label>
            <textarea
              className="ts-field resize-none h-20"
              value={editData.insights}
              onChange={e => setEditData({ ...editData, insights: e.target.value })}
            ></textarea>
          </div>

          <button className="btn-primary w-full justify-center text-sm mt-4" onClick={() => setShowEdit(false)}>
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
