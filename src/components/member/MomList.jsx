import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';

const API_BASE = 'http://localhost:5000/api';

const FILTER_MAP = {
  'All Time': 'all_time',
  'Today': 'today',
  'Yesterday': 'yesterday',
  'This Week': 'this_week',
  'Last Week': 'last_week',
  'Earlier': 'earlier',
};

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export default function MemberMomList() {
  const navigate = useNavigate();
  const [moms, setMoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('All Time');

  useEffect(() => {
    setLoading(true);
    const tf = FILTER_MAP[timeFilter] || 'all_time';
    apiFetch(`/member/moms?filter=${tf}`)
      .then(res => setMoms(Array.isArray(res) ? res : (res.data || [])))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [timeFilter]);

  return (
    <>
      <div className="mb-10">
        <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-3">Minutes of Meeting</h1>
        <p className="font-headline italic text-xl text-outline max-w-2xl leading-relaxed">Review decisions, track progress, and align your team's vision.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Time filter wired to API */}
            <select
              className="appearance-none pl-4 pr-10 py-2 bg-surface-container-lowest border border-outline-variant/15 rounded-xl text-sm font-medium hover:bg-surface-container-low transition-colors cursor-pointer focus:outline-none"
              value={timeFilter}
              onChange={e => setTimeFilter(e.target.value)}
            >
              {Object.keys(FILTER_MAP).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-outline uppercase tracking-tighter">
          <span className="w-2 h-2 rounded-full bg-primary-container inline-block"></span>
          {moms.length} MOMs you're part of
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-outline animate-pulse">Loading MOMs…</div>
      ) : error ? (
        <div className="flex items-center justify-center h-64 text-error text-sm">Failed to load MOMs: {error}</div>
      ) : moms.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-outline text-sm">No MOMs found for this period.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {moms.map((mom, i) => {
            const decisionsCount = Array.isArray(mom.decisions) ? mom.decisions.length : 0;
            const attendees = Array.isArray(mom.presentAttendees) ? mom.presentAttendees : [];
            const displayDate = mom.createdAt
              ? new Date(mom.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : '—';
            return (
              <div
                key={mom._id || i}
                className="ts-card p-6 hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
                onClick={() => navigate(`/member/mom-detail?id=${mom._id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  {/* label = contextLable (backend field name) */}
                  <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">{mom.contextLable || '—'}</span>
                  <span className="font-mono text-[10px] text-outline">{displayDate}</span>
                </div>
                {/* title = MeetingTitle */}
                <h3 className="font-headline text-2xl text-on-surface mb-3 leading-tight group-hover:text-primary transition-colors">{mom.MeetingTitle || '—'}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-6 line-clamp-3">{mom.summary || ''}</p>
                <div className="mt-auto space-y-4">
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-fixed/30 rounded-full text-[10px] font-bold text-primary uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>{decisionsCount} Decisions
                    </span>
                    {/* actions = totalTasks */}
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant uppercase">
                      <span className="material-symbols-outlined text-xs">assignment</span>{mom.totalTasks ?? 0} Actions
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-outline-variant/10">
                    <div className="flex -space-x-2">
                      {attendees.slice(0, 3).map((a, ai) => (
                        <Avatar key={ai} name={a.name || '?'} size="28" round={true} style={{ marginLeft: ai > 0 ? '-8px' : '0', border: '2px solid white' }} />
                      ))}
                      {attendees.length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-surface-container text-on-surface flex items-center justify-center text-[8px] font-bold ring-2 ring-white">+{attendees.length - 3}</div>
                      )}
                    </div>
                    <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">arrow_forward</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
