import { useNavigate } from 'react-router-dom';

export default function AdminMomList() {
  const navigate = useNavigate();

  return (
    <>
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-3">Minutes of Meeting</h1>
        <p className="font-headline italic text-xl text-outline max-w-2xl leading-relaxed">Capture the essence of your creative dialogues. Review decisions, track progress, and align your team's vision.</p>
      </div>

      {/* MOM Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          { project: 'Project Atelier-X', projectColor: 'text-primary', date: 'Oct 24, 2023', title: 'Q4 Brand Strategy & Visual Language Sync', desc: 'Discussed the transition from skeletal wireframes to the "Digital Atelier" concept. Focus on tactile textures, typography hierarchy, and the removal of standard UI borders.', decisions: 8, actions: 12, members: [{ initials: 'JP', color: 'bg-primary' }, { initials: 'SK', color: 'bg-secondary' }], extra: 2 },
          { project: 'Engineering', projectColor: 'text-[#7f2500]', date: 'Oct 21, 2023', title: 'Micro-interaction Framework & Tailwind Config', desc: 'Review of the new design system tokens. Mapping Material Design roles to the bespoke "Atelier" palette. Discussion on performance budgets for backdrop blurs.', decisions: 4, actions: 5, members: [{ initials: 'DC', color: 'bg-[#7f2500]' }], extra: 1 },
          { project: 'Studio Ops', projectColor: 'text-primary', date: 'Oct 18, 2023', title: 'Weekly Resource Allocation & Burn Rate', desc: 'Reviewing team capacity for the upcoming sprint. Shifted focus from maintenance tasks to the high-end UI overhaul. New hiring needs for motion design.', decisions: 3, actions: 8, members: [{ initials: 'JT', color: 'bg-primary' }, { initials: 'EV', color: 'bg-secondary' }, { initials: 'MC', color: 'bg-[#7f2500]' }], extra: 0 },
          { project: 'Client Review', projectColor: 'text-secondary', date: 'Oct 15, 2023', title: 'Phase 1 Delivery & Feedback Session', desc: 'The client praised the "paper-like" surface hierarchy. Minor feedback on icon weights being too heavy in dark mode. Approval to move to Phase 2.', decisions: 15, actions: 2, members: [{ initials: 'CL', color: 'bg-secondary' }], extra: 4 },
        ].map((m, i) => (
          <div key={i} className="ts-card p-6 hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer" onClick={() => navigate('/admin/mom-detail')}>
            <div className="flex justify-between items-start mb-4">
              <span className={`font-mono text-[10px] uppercase tracking-widest ${m.projectColor} font-bold`}>{m.project}</span>
              <span className="font-mono text-[10px] text-outline">{m.date}</span>
            </div>
            <h3 className="font-headline text-2xl text-on-surface mb-3 leading-tight group-hover:text-primary transition-colors">{m.title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6 line-clamp-3">{m.desc}</p>
            <div className="mt-auto space-y-4">
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-fixed/30 rounded-full text-[10px] font-bold text-primary uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>{m.decisions} Decisions
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant uppercase">
                  <span className="material-symbols-outlined text-xs">assignment</span>{m.actions} Actions
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-outline-variant/10">
                <div className="flex -space-x-2">
                  {m.members.map((mb, mi) => <div key={mi} className={`w-7 h-7 rounded-full ${mb.color} text-white text-[8px] font-bold flex items-center justify-center ring-2 ring-white`}>{mb.initials}</div>)}
                  {m.extra > 0 && <div className="w-7 h-7 rounded-full bg-surface-container text-on-surface flex items-center justify-center text-[8px] font-bold ring-2 ring-white">+{m.extra}</div>}
                </div>
                <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">arrow_forward</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
