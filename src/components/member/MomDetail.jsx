import { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';

export default function MemberMomDetail() {
  const [dialogueText, setDialogueText] = useState('');

  function handlePost() {
    if (dialogueText.trim()) {
      alert(`Dialogue posted: "${dialogueText.trim()}" (demo)`);
      setDialogueText('');
    }
  }

  return (
    <>
      <Link to="/member/mom-list" className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:-translate-x-1 transition-transform mb-10">
        <span className="material-symbols-outlined text-sm">arrow_back</span>Back to MOMs
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-14">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs tracking-tight text-outline bg-surface-container px-2 py-0.5 rounded uppercase">MOM-2023-Q4-01</span>
            <div className="flex items-center gap-1.5 text-primary"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span><span className="text-[10px] font-bold tracking-widest uppercase">Archived</span></div>
          </div>
          <h1 className="font-headline text-5xl text-on-surface leading-tight mb-4">Q4 Brand Strategy &amp; Visual Language Sync</h1>
          <p className="font-mono text-sm text-outline">Oct 24, 2023 • 10:00 AM — 11:30 AM EST</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-14">
          <section>
            <h2 className="font-headline text-2xl text-on-surface mb-5 italic opacity-80">The Narrative</h2>
            <div className="ts-card p-8">
              <p className="font-body text-lg text-on-surface-variant leading-relaxed first-letter:text-4xl first-letter:font-headline first-letter:mr-2 first-letter:float-left first-letter:text-primary first-letter:leading-none">
                The discussion centered on evolving our visual identity to reflect a more sophisticated, "Digital Atelier" aesthetic. We scrutinized the current SaaS dashboard fatigue and agreed to pivot toward high-contrast typography.
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
                <thead><tr><th>Task Details</th><th>Assignee</th><th>Priority</th></tr></thead>
                <tbody>
                  <tr><td><span className="text-sm font-medium">Update Brand Style Guide PDF</span></td><td><div className="flex items-center gap-2"><Avatar name="Aria V." size="24" round={true} /><span className="text-xs text-on-surface-variant">Aria V.</span></div></td><td><span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold badge-critical">Critical</span></td></tr>
                  <tr><td><span className="text-sm font-medium">Develop Tailwind Config for Atelier Palette</span></td><td><div className="flex items-center gap-2"><Avatar name="Marcus T." size="24" round={true} /><span className="text-xs text-on-surface-variant">Marcus T.</span></div></td><td><span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold badge-medium">Medium</span></td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-10">
          <section>
            <h3 className="font-headline text-xl text-on-surface mb-5 italic">Participants</h3>
            <div className="ts-card p-5 space-y-4">
              {[{initials:'JP',name:'Julian Pierce',role:'Design Lead',color:'bg-primary'},{initials:'SK',name:'Sarah Kim',role:'Product Manager',color:'bg-secondary'},{initials:'LO',name:"Liam O'Brien",role:'CTO',color:'bg-[#7f2500]'},{initials:'ER',name:'Elena Rossi',role:'Brand Strategist',color:'bg-surface-container-high text-on-surface'}].map((p,i)=>(
                <div key={i} className="flex items-center gap-3"><Avatar name={p.name} size="40" round={true} /><div><p className="text-sm font-semibold">{p.name}</p><p className="text-[10px] uppercase text-outline tracking-wider">{p.role}</p></div></div>
              ))}
            </div>
          </section>

          {/* Dialogue */}
          <section>
            <h3 className="font-headline text-xl text-on-surface mb-5 italic">Dialogue</h3>
            <div className="space-y-5">
              <div className="relative pl-5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-outline-variant/30">
                <p className="text-xs font-mono text-outline mb-1 uppercase">Elena Rossi</p>
                <p className="text-sm text-on-surface-variant italic leading-relaxed">"Should we consider a darker mode for the Atelier concept, or keep it strictly paper-light?"</p>
              </div>
              <div className="relative pl-5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-outline-variant/30">
                <p className="text-xs font-mono text-outline mb-1 uppercase">Julian Pierce</p>
                <p className="text-sm text-on-surface-variant italic leading-relaxed">"Let's focus on the light foundation first. The 'warmth' is our differentiator."</p>
              </div>
              {/* Member dialogue input — matching original HTML design */}
              <div className="ts-card p-4 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <textarea
                  className="w-full bg-transparent border-none text-sm placeholder:text-outline focus:ring-0 resize-none h-16 font-body outline-none"
                  placeholder="Add a suggestion or comment..."
                  value={dialogueText}
                  onChange={e => setDialogueText(e.target.value)}
                ></textarea>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-outline-variant/5">
                  <div className="flex gap-2">
                    <span className="material-symbols-outlined text-outline text-lg cursor-pointer hover:text-primary">attach_file</span>
                    <span className="material-symbols-outlined text-outline text-lg cursor-pointer hover:text-primary">mood</span>
                  </div>
                  <button className="text-xs font-bold text-primary uppercase tracking-widest hover:bg-primary-fixed px-3 py-1 rounded transition-colors" onClick={handlePost}>Post</button>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-primary/5 rounded-2xl p-6 overflow-hidden relative group">
            <div className="relative z-10"><h5 className="font-headline text-lg mb-2">Workspace Insight</h5><p className="text-xs text-on-surface-variant leading-relaxed">This MOM is linked to the <span className="text-primary font-medium">Brand Vision 2024</span> project epic.</p></div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700"><span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span></div>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t border-outline-variant/10 flex justify-between items-center">
        <button className="btn-secondary gap-2 text-sm"><span className="material-symbols-outlined text-sm">download</span>Export PDF</button>
        <p className="font-mono text-[10px] uppercase text-outline tracking-widest">Last sync: Today at 2:45 PM</p>
      </div>
    </>
  );
}
