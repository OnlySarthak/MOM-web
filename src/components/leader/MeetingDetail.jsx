import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Avatar from 'react-avatar';

const API_BASE = 'http://localhost:5000/api';

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export default function LeaderMeetingDetail() {
  const [searchParams] = useSearchParams();
  const meetingId = searchParams.get('id');
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!meetingId) { setLoading(false); return; }
    apiFetch(`/leader/meetings/${meetingId}`)
      .then(res => setData(res.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [meetingId]);

  if (loading) return <div className="flex items-center justify-center h-64 text-outline animate-pulse">Loading meeting…</div>;
  if (error) return <div className="flex items-center justify-center h-64 text-error text-sm">Failed to load meeting: {error}</div>;
  if (!data) return <div className="flex items-center justify-center h-64 text-outline text-sm">Meeting not found.</div>;

  const meeting = data;
  const mom = data.mom || {};
  // presentAttendees from participants
  const participants = Array.isArray(mom.presentAttendees) ? mom.presentAttendees : [];
  const transcriptsData = Array.isArray(data.transcripts) ? data.transcripts : [];
  const transcripts = transcriptsData.flatMap(t => Array.isArray(t.content) ? t.content : t);
  const momId = mom._id || null;
  const displayDate = meeting.meetingDate
    ? new Date(meeting.meetingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  return (
    <>
      <Link to="/leader/meetings" className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:-translate-x-1 transition-transform mb-8">
        <span className="material-symbols-outlined text-sm">arrow_back</span>Back to Meetings
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="badge-scheduled text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              {meeting.processingStage || 'initialized'}
            </span>
            <span className="font-mono text-xs text-outline">ID: {meeting._id}</span>
          </div>
          <h1 className="font-headline text-5xl text-on-surface tracking-tight leading-tight">{meeting.title || '—'}</h1>
          <p className="font-mono text-sm text-outline flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            {displayDate}
          </p>
        </div>
        {/* View MOM — uses real momId */}
        {momId && (
          <Link to={`/leader/mom-detail?id=${momId}`} className="btn-secondary gap-2 flex-shrink-0">
            <span className="material-symbols-outlined text-sm">description</span>View MOM
          </Link>
        )}
      </div>

      {/* Tabs */}
      <nav className="flex gap-8 border-b border-outline-variant/15 mb-8">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''} pb-4 text-sm font-semibold`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab-btn ${activeTab === 'transcript' ? 'active' : ''} pb-4 text-sm font-medium text-outline hover:text-on-surface`} onClick={() => setActiveTab('transcript')}>Transcript</button>
      </nav>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6 mb-10">
          {/* Agenda (static — stored in meeting description/agenda field if present) */}
          {meeting.agenda && (
            <div className="ts-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-sm">format_list_bulleted</span></div>
                <h2 className="font-headline text-xl text-on-surface">Agenda</h2>
              </div>
              <p className="text-sm text-on-surface-variant whitespace-pre-line">{meeting.agenda}</p>
            </div>
          )}
          <div className="grid grid-cols-12 gap-6">
            {/* Meeting Details */}
            <div className="col-span-12 lg:col-span-4 glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined">info</span></div>
                <h2 className="font-headline text-xl text-on-surface">Meeting Details</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Organizer</p>
                  <div className="flex items-center gap-3">
                    <Avatar name={meeting.leaderName || '?'} size="28" round={true} />
                    <p className="text-sm font-semibold">{meeting.leaderName || '—'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Project</p>
                  <p className="text-sm font-medium">{meeting.projectName || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Stage</p>
                  <p className="text-sm font-medium capitalize">{meeting.processingStage || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Duration</p>
                  <p className="text-sm font-medium">
                    {meeting.meetingDuration
                      ? `${Math.floor(meeting.meetingDuration / 60)}m ${meeting.meetingDuration % 60}s`
                      : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Participants — from presentAttendees */}
            <div className="col-span-12 lg:col-span-5 glass-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined">groups</span></div>
                  <h2 className="font-headline text-xl text-on-surface">Participants</h2>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">{participants.length} Present</span>
              </div>
              {participants.length === 0 ? (
                <p className="text-sm text-outline italic">No participants recorded.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {participants.map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Avatar name={p.name || '?'} size="40" round={true} />
                      <div>
                        <p className="text-sm font-semibold">{p.name}</p>
                        {/* participant role = functionalRole */}
                        <p className="text-[10px] text-outline">{p.functionalRole || '—'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* MOM Artifact */}
            <div className="col-span-12 lg:col-span-3 ts-card p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined">description</span></div>
                  <h2 className="font-headline text-xl text-on-surface">MOM Artifact</h2>
                </div>
                {momId ? (
                  <div className="bg-surface-container-low rounded-xl p-5 border border-dashed border-outline-variant text-center">
                    <span className="material-symbols-outlined text-3xl text-outline mb-2">draft</span>
                    <p className="text-sm font-semibold mb-1">{mom.MeetingTitle || 'MOM'}</p>
                    <p className="font-mono text-[10px] text-outline mb-4">Auto-generated</p>
                    <div className="flex gap-2">
                      {/* Open MOM → real momId navigation */}
                      <Link to={`/leader/mom-detail?id=${momId}`} className="flex-1 py-2 text-xs font-semibold bg-on-surface text-white rounded-lg hover:opacity-80 transition-all text-center">Open MOM</Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-surface-container-low rounded-xl p-5 border border-dashed border-outline-variant text-center">
                    <span className="material-symbols-outlined text-3xl text-outline mb-2">hourglass_empty</span>
                    <p className="text-sm text-outline">MOM not yet generated</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transcript Tab */}
      {activeTab === 'transcript' && (
        <div className="ts-card p-8 max-w-3xl">
          <h2 className="font-headline text-2xl text-on-surface mb-6">Meeting Transcript</h2>
          {transcripts.length === 0 ? (
            <p className="text-sm text-outline italic">No transcript available.</p>
          ) : (
            <div className="space-y-6 font-mono text-sm text-on-surface-variant leading-relaxed">
              {transcripts.map((t, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-outline w-16 flex-shrink-0">{t.timestamp || '—'}</span>
                  <p><strong className="text-on-surface">{t.speaker || 'Unknown'}:</strong> {t.text || ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
