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

export default function AdminMeetings() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQ, setSearchQ] = useState('');
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [openDD, setOpenDD] = useState(null);

  function loadMeetings() {
    setLoading(true);
    const tf = FILTER_MAP[timeFilter] || 'all_time';
    apiFetch(`/admin/meetings?timeframe=${tf}`)
      .then(res => setMeetings(Array.isArray(res) ? res : (res.data || [])))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadMeetings(); }, [timeFilter]);

  const filtered = meetings.filter(m =>
    !searchQ || (m.title || '').toLowerCase().includes(searchQ.toLowerCase())
  );

  function cancelMeeting(id, title) {
    if (window.confirm(`Cancel "${title}"?`)) {
      apiFetch(`/admin/meetings/${id}`)
        .then(() => loadMeetings())
        .catch(e => alert('Failed: ' + e.message));
    }
    setOpenDD(null);
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
        <div>
          <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">Meetings</h1>
          <p className="font-headline italic text-xl text-outline">Schedule, review, and track your team syncs.</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-80">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
              placeholder="Search meetings..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
            />
          </div>
          <div className="relative">
            {/* Time filter wired to API */}
            <select
              className="appearance-none pl-4 pr-10 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm cursor-pointer focus:outline-none"
              value={timeFilter}
              onChange={e => setTimeFilter(e.target.value)}
            >
              {Object.keys(FILTER_MAP).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="ts-card overflow-hidden mb-12">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-outline animate-pulse">Loading meetings…</div>
        ) : (error && filtered.length === 0) || filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-outline text-3xl">event_busy</span>
            </div>
            <p className="text-on-surface font-headline text-xl mb-1">No meetings found</p>
            <p className="text-outline text-sm italic max-w-xs mx-auto mb-6">
              {error ? "We couldn't load your meetings right now." : "Try adjusting your filters or search terms."}
            </p>
            {(error || timeFilter !== 'All Time' || searchQ) && (
              <button 
                onClick={() => { setError(null); setTimeFilter('All Time'); setSearchQ(''); loadMeetings(); }}
                className="btn-secondary text-xs"
              >
                Clear all filters & refresh
              </button>
            )}
          </div>
        ) : (
          <table className="ts-table">
            <thead>
              <tr><th>Meeting Title</th><th>Date & Time</th><th>Participants</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((m, idx) => {
                const memberNames = Array.isArray(m.attendees) ? m.attendees : Array.isArray(m.memberNames) ? m.memberNames : [];
                const displayDate = m.meetingDate
                  ? new Date(m.meetingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—';
                const momId = m.mom?._id || null;
                return (
                  <tr
                    key={m._id || idx}
                    className="cursor-pointer group"
                    onClick={() => navigate(`/admin/meeting-detail?id=${m._id}`)}
                  >
                    <td>
                      <p className="font-headline text-lg text-on-surface group-hover:text-primary transition-colors">{m.title || '—'}</p>
                      <p className="text-xs text-outline">Project: {m.projectName || '—'}</p>
                    </td>
                    <td className="font-mono text-xs text-on-surface-variant">{displayDate}</td>
                    <td>
                      <div className="flex -space-x-1.5">
                        {memberNames.slice(0, 3).map((name, pi) => (
                          <Avatar key={pi} name={name || '?'} size="28" round={true} style={{ marginLeft: '-4px', border: '2px solid white' }} />
                        ))}
                        {memberNames.length > 3 && (
                          <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-[9px] font-bold ring-2 ring-white">+{memberNames.length - 3}</div>
                        )}
                      </div>
                    </td>
                    <td className="text-right relative">
                      <span
                        className="material-symbols-outlined text-outline hover:text-on-surface transition-colors cursor-pointer"
                        onClick={e => { e.stopPropagation(); setOpenDD(openDD === idx ? null : idx); }}
                      >more_vert</span>
                      <div className={`ts-dropdown ${openDD === idx ? 'open' : ''}`}>
                        <button
                          className="ts-dropdown-item"
                          onClick={e => { e.stopPropagation(); navigate(`/admin/meeting-detail?id=${m._id}`); setOpenDD(null); }}
                        ><span className="material-symbols-outlined text-sm">visibility</span>View Details</button>
                        {momId && (
                          <button
                            className="ts-dropdown-item"
                            onClick={e => { e.stopPropagation(); navigate(`/admin/mom-detail?id=${momId}`); setOpenDD(null); }}
                          ><span className="material-symbols-outlined text-sm">description</span>View MOM</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="text-xs text-outline font-medium">
            Showing <span className="text-on-surface">{filtered.length}</span> of <span className="text-on-surface">{meetings.length}</span> meetings
          </p>
        </div>
      </div>
    </>
  );
}
