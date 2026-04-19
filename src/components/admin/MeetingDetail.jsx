import { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';

export default function AdminMeetingDetail() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <>
      {/* Back */}
      <Link to="/admin/meetings" className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:-translate-x-1 transition-transform mb-8">
        <span className="material-symbols-outlined text-sm">arrow_back</span>Back to Meetings
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="badge-scheduled text-[10px]"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>Scheduled</span>
            <span className="font-mono text-xs text-outline">REF: TS-2023-1024</span>
          </div>
          <h1 className="font-headline text-5xl text-on-surface tracking-tight leading-tight">Product Strategy Sync</h1>
          <p className="font-mono text-sm text-outline flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            Oct 24, 2023 · 10:30 AM – 11:15 AM
            <span className="text-outline/50">·</span>
            <span>45 mins</span>
          </p>
        </div>
        <Link to="/admin/mom-detail" className="btn-secondary gap-2 flex-shrink-0">
          <span className="material-symbols-outlined text-sm">description</span>View MOM
        </Link>
      </div>

      {/* Tabs */}
      <nav className="flex gap-8 border-b border-outline-variant/15 mb-8">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''} pb-4 text-sm font-semibold`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab-btn ${activeTab === 'transcript' ? 'active' : ''} pb-4 text-sm font-medium text-outline hover:text-on-surface`} onClick={() => setActiveTab('transcript')}>Transcript</button>
      </nav>

      {activeTab === 'overview' && (
        <div className="space-y-6 mb-10">
          {/* Agenda */}
          <div className="ts-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-sm">format_list_bulleted</span></div>
              <h2 className="font-headline text-xl text-on-surface">Agenda</h2>
            </div>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-sm mt-0.5">chevron_right</span>Align on Q3 roadmap top-priority features</li>
              <li className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-sm mt-0.5">chevron_right</span>Review onboarding flow wireframes from Design</li>
              <li className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-sm mt-0.5">chevron_right</span>Discuss auth refactor blocking mobile team</li>
              <li className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-sm mt-0.5">chevron_right</span>Plan security audit timeline with QA</li>
            </ul>
          </div>
          <div className="grid grid-cols-12 gap-6">
          {/* Meeting Info */}
          <div className="col-span-12 lg:col-span-4 glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">info</span>
              </div>
              <h2 className="font-headline text-xl text-on-surface">Meeting Details</h2>
            </div>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Organizer</p>
                <div className="flex items-center gap-3">
                  <Avatar name="Sarah Miller" size="28" round={true} />
                  <p className="text-sm font-semibold">Sarah Miller</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Location</p>
                <p className="text-sm flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">videocam</span>Virtual Atelier</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Duration</p>
                <p className="text-sm font-medium">45 minutes</p>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="col-span-12 lg:col-span-5 glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined">groups</span></div>
                <h2 className="font-headline text-xl text-on-surface">Participants</h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">4 Present</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { initials: 'SM', name: 'Sarah Miller', role: 'Product Lead', color: 'bg-primary' },
                { initials: 'DC', name: 'David Chen', role: 'Design Director', color: 'bg-secondary' },
                { initials: 'JD', name: 'Jane Doe', role: 'Tech Architect', color: 'bg-surface-container-high text-on-surface' },
                { initials: 'MV', name: 'Marcus V.', role: 'QA Manager', color: 'bg-[#7f2500]' },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Avatar name={p.name} size="40" round={true} />
                  <div><p className="text-sm font-semibold">{p.name}</p><p className="text-[10px] text-outline">{p.role}</p></div>
                </div>
              ))}
            </div>
          </div>

          {/* MOM Artifact */}
          <div className="col-span-12 lg:col-span-3 ts-card p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined">description</span></div>
                <h2 className="font-headline text-xl text-on-surface">MOM Artifact</h2>
              </div>
              <div className="bg-surface-container-low rounded-xl p-5 border border-dashed border-outline-variant text-center">
                <span className="material-symbols-outlined text-3xl text-outline mb-2">draft</span>
                <p className="text-sm font-semibold mb-1">Draft MOM.pdf</p>
                <p className="font-mono text-[10px] text-outline mb-4">1.2 MB · Auto-generated</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 text-xs font-semibold bg-white border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-all">Preview</button>
                  <Link to="/admin/mom-detail" className="flex-1 py-2 text-xs font-semibold bg-on-surface text-white rounded-lg hover:opacity-80 transition-all text-center">Open MOM</Link>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}


      {/* Tab: Transcript */}
      {activeTab === 'transcript' && (
        <div className="ts-card p-8 max-w-3xl">
          <h2 className="font-headline text-2xl text-on-surface mb-6">Meeting Transcript</h2>
          <div className="space-y-6 font-mono text-sm text-on-surface-variant leading-relaxed">
            <div className="flex gap-4"><span className="text-outline w-16 flex-shrink-0">10:30</span><p><strong className="text-on-surface">Sarah Miller:</strong> Let's begin with the Q3 roadmap priorities. I want us to align on the top three features...</p></div>
            <div className="flex gap-4"><span className="text-outline w-16 flex-shrink-0">10:34</span><p><strong className="text-on-surface">David Chen:</strong> From a design perspective, the onboarding flow is our highest impact item. We have the wireframes ready.</p></div>
            <div className="flex gap-4"><span className="text-outline w-16 flex-shrink-0">10:38</span><p><strong className="text-on-surface">Jane Doe:</strong> Agreed. The auth refactor needs to happen first though — it's blocking the mobile team.</p></div>
            <div className="flex gap-4"><span className="text-outline w-16 flex-shrink-0">10:45</span><p><strong className="text-on-surface">Marcus V.:</strong> QA is ready to run the security audit in parallel with the refactor — we can overlap...</p></div>
          </div>
        </div>
      )}
    </>
  );
}
