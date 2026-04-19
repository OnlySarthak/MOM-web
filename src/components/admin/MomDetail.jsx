import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';

export default function AdminMomDetail() {
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
            <span className="font-mono text-xs tracking-tight text-outline bg-surface-container px-2 py-0.5 rounded uppercase">MOM-2023-Q4-01</span>
            <div className="flex items-center gap-1.5 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-widest uppercase">Archived</span>
            </div>
          </div>
          <h1 className="font-headline text-5xl text-on-surface leading-tight mb-4">Q4 Brand Strategy & Visual Language Sync</h1>
          <p className="font-mono text-sm text-outline">Oct 24, 2023 • 10:00 AM — 11:30 AM EST</p>
        </div>
        <Link to="/admin/meeting-detail" className="btn-secondary gap-2 flex-shrink-0">
          <span className="material-symbols-outlined text-sm">calendar_today</span>View Meeting
        </Link>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Main body */}
        <div className="col-span-12 lg:col-span-8 space-y-14">
          {/* Narrative */}
          <section>
            <h2 className="font-headline text-2xl text-on-surface mb-5 italic opacity-80">The Narrative</h2>
            <div className="ts-card p-8">
              <p className="font-body text-lg text-on-surface-variant leading-relaxed first-letter:text-4xl first-letter:font-headline first-letter:mr-2 first-letter:float-left first-letter:text-primary first-letter:leading-none">
                The discussion centered on evolving our visual identity to reflect a more sophisticated, "Digital Atelier" aesthetic. We scrutinized the current SaaS dashboard fatigue and agreed to pivot toward high-contrast typography and tonal layering to differentiate TeamSync in a crowded productivity market.
              </p>
            </div>
          </section>

          {/* Key Decisions */}
          <section>
            <h2 className="font-headline text-2xl text-on-surface mb-5 italic opacity-80">Key Decisions</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 ts-card">
                <span className="font-headline text-primary text-2xl italic">01.</span>
                <p className="font-body text-on-surface py-1">Standardize <code className="font-mono text-xs bg-surface-container px-1.5 py-0.5 rounded">#faf9f6</code> as the primary canvas color across all workspace modules to reduce digital eye strain.</p>
              </div>
              <div className="flex items-start gap-4 p-5 ts-card border-l-4 border-primary">
                <span className="font-headline text-primary text-2xl italic">02.</span>
                <p className="font-body text-on-surface py-1">Adopt <span className="font-semibold italic">Newsreader</span> for all editorial-style headers while maintaining Inter for functional UI elements.</p>
              </div>
              <div className="flex items-start gap-4 p-5 ts-card">
                <span className="font-headline text-primary text-2xl italic">03.</span>
                <p className="font-body text-on-surface py-1">De-prioritize 1px borders in favor of tonal background shifts for section delineation.</p>
              </div>
            </div>
          </section>

          {/* Action Items */}
          <section>
            <h2 className="font-headline text-2xl text-on-surface mb-5 italic opacity-80">Pending Actions</h2>
            <div className="ts-card overflow-hidden">
              <table className="ts-table">
                <thead><tr><th>Task Details</th><th>Assignee</th></tr></thead>
                <tbody>
                  <tr>
                    <td><div className="flex items-center gap-3"><span className="text-sm font-medium">Update Brand Style Guide PDF</span></div></td>
                    <td><div className="flex items-center gap-2"><Avatar name="Aria V." size="24" round={true} /><span className="text-xs text-on-surface-variant">Aria V.</span></div></td>
                  </tr>
                  <tr>
                    <td><div className="flex items-center gap-3"><span className="text-sm font-medium">Develop Tailwind Config for Atelier Palette</span></div></td>
                    <td><div className="flex items-center gap-2"><Avatar name="Marcus T." size="24" round={true} /><span className="text-xs text-on-surface-variant">Marcus T.</span></div></td>
                  </tr>
                  <tr>
                    <td><div className="flex items-center gap-3"><span className="text-sm font-medium">Draft internal announcement memo</span></div></td>
                    <td><div className="flex items-center gap-2"><Avatar name="Chloe J." size="24" round={true} /><span className="text-xs text-on-surface-variant">Chloe J.</span></div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-10">
          {/* Participants */}
          <section>
            <h3 className="font-headline text-xl text-on-surface mb-5 italic">Participants</h3>
            <div className="ts-card p-5 space-y-4">
              {[
                { initials: 'JP', name: 'Julian Pierce', role: 'Design Lead', color: 'bg-primary' },
                { initials: 'SK', name: 'Sarah Kim', role: 'Product Manager', color: 'bg-secondary' },
                { initials: 'LO', name: "Liam O'Brien", role: 'CTO', color: 'bg-[#7f2500]' },
                { initials: 'ER', name: 'Elena Rossi', role: 'Brand Strategist', color: 'bg-surface-container-high text-on-surface' },
              ].map((p, i) => (
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
            </div>
          </section>

          {/* Workspace Insight */}
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

      {/* Footer */}
      <div className="mt-16 pt-10 border-t border-outline-variant/10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button className="btn-secondary gap-2 text-sm"><span className="material-symbols-outlined text-sm">download</span>Export PDF</button>
        </div>
        <p className="font-mono text-[10px] uppercase text-outline tracking-widest">Last sync: Today at 2:45 PM</p>
      </div>
    </>
  );
}
