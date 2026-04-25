import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const API_BASE = 'http://localhost:5000/api';

const FILTER_MAP = {
  'All Time': 'all_time',
  'Today': 'today',
  'Yesterday': 'yesterday',
  'This Week': 'this_week',
  'Last Week': 'last_week',
  'Earlier': 'earlier',
};

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...opts });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

const PAGE_SIZE = 3;
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB

// S3 client — credentials from Vite env
function getS3Client() {
  return new S3Client({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
  });
}

export default function LeaderMeetings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQ, setSearchQ] = useState('');
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [showCreate, setShowCreate] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [openDD, setOpenDD] = useState(null);
  const [form, setForm] = useState({ title: '', projectName: '', agenda: '' });
  const [formErrors, setFormErrors] = useState({});
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [meetingId, setMeetingId] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [page, setPage] = useState(1);
  const [initiating, setInitiating] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef(null);

  function loadMeetings() {
    setLoading(true);
    const tf = FILTER_MAP[timeFilter] || 'all_time';
    apiFetch(`/leader/meetings?filter=${tf}`)
      .then(res => setMeetings(Array.isArray(res) ? res : []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadMeetings(); }, [timeFilter]);

  const filtered = meetings.filter(m => !searchQ || (m.title || '').toLowerCase().includes(searchQ.toLowerCase()));
  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  function deleteMeeting(id) {
    const m = meetings.find(m => m._id === id);
    if (m && window.confirm(`Delete "${m.title}"?`)) {
      apiFetch(`/leader/meetings/${id}`, { method: 'DELETE' })
        .then(() => loadMeetings())
        .catch(e => alert('Failed to delete: ' + e.message));
    }
    setOpenDD(null);
  }

  // ─── STEP 1: Validate form ───
  function validateForm() {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Meeting Title is required';
    if (!form.projectName.trim()) errors.projectName = 'Project Name is required';
    if (!form.agenda.trim()) errors.agenda = 'Agenda is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // ─── STEP 2: Initialize meeting → get meetingId ───
  async function handleNext(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setInitiating(true);
    try {
      const res = await apiFetch('/leader/meetings/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          projectName: form.projectName.trim(),
          agenda: form.agenda.trim(),
        }),
      });
      setMeetingId(res.meetingId);
      setCreateStep(2);
      setUploadProgress(0);
      setUploadFile(null);
      setUploading(false);
      setUploadError(null);
      setUploadSuccess(false);
    } catch (err) {
      alert('Failed to initiate meeting: ' + err.message);
    } finally {
      setInitiating(false);
    }
  }

  // ─── STEP 3: Validate and select MP3 file ───
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type — MP3 only
    if (file.type !== 'audio/mpeg') {
      setUploadError('Only .mp3 files are allowed. Please select an MP3 audio file.');
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File size exceeds 500MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`);
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploadError(null);
    setUploadFile(file);
    setUploadProgress(0);
    setUploadSuccess(false);

    // Extract audio duration
    const audioEl = new Audio();
    const objectUrl = URL.createObjectURL(file);
    audioEl.src = objectUrl;
    audioEl.addEventListener('loadedmetadata', () => {
      setAudioDuration(Math.round(audioEl.duration)); // duration in seconds
      URL.revokeObjectURL(objectUrl);
    });
    audioEl.addEventListener('error', () => {
      URL.revokeObjectURL(objectUrl);
      // If we can't read duration, continue without it
      setAudioDuration(0);
    });
  }

  // ─── STEP 4 & 5: Upload to S3 → Generate signed URL → Trigger processing ───
  async function handleUploadAndProcess() {
    if (!uploadFile || !meetingId) return;

    setUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // 4a. Get workspaceId and teamId from API
      const ids = await apiFetch('/leader/meetings/workspaceId-teamId');
      const { workspaceId, teamId } = ids;

      // 4b. Build S3 key
      const timestamp = Date.now();
      const s3Key = `Mom-Audios/${workspaceId}/${teamId}/${timestamp}.mp3`;
      const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;

      // 4c. Read file as ArrayBuffer for SDK upload
      const fileBuffer = await uploadFile.arrayBuffer();

      // 4d. Upload to S3 using PutObjectCommand
      // We use XMLHttpRequest for progress tracking since SDK v3 doesn't natively support upload progress
      const s3Client = getS3Client();

      // Start progress simulation for the SDK upload (SDK v3 doesn't expose upload progress natively)
      let progressInterval;
      let fakeProg = 0;
      progressInterval = setInterval(() => {
        fakeProg = Math.min(fakeProg + Math.random() * 8 + 2, 90);
        setUploadProgress(Math.round(fakeProg));
      }, 300);

      const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: 'audio/mpeg',
      });

      await s3Client.send(putCommand);

      // Upload complete
      clearInterval(progressInterval);
      setUploadProgress(100);

      // 4e. Generate signed URL (2 hour expiry)
      const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
      });

      const signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 7200 }); // 2 hours

      setUploadSuccess(true);
      setUploading(false);

      // ─── STEP 5: Trigger backend processing ───
      setProcessing(true);
      await apiFetch(`/leader/meetings/${meetingId}/processing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl: signedUrl, meetingDuration: audioDuration }),
      });

      setProcessing(false);

      // Success! Close modal and refresh
      setTimeout(() => {
        closeCreateModal();
        loadMeetings();
      }, 1500);

    } catch (err) {
      setUploading(false);
      setProcessing(false);
      setUploadError(`Upload failed: ${err.message}`);
      console.error('S3 upload error:', err);
    }
  }

  function closeCreateModal() {
    setShowCreate(false);
    setCreateStep(1);
    setForm({ title: '', projectName: '', agenda: '' });
    setFormErrors({});
    setUploadFile(null);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(false);
    setMeetingId(null);
    setAudioDuration(0);
    setInitiating(false);
    setProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
        <div>
          <h1 className="font-headline text-5xl text-on-surface tracking-tight mb-2">Meetings</h1>
          <p className="font-headline italic text-xl text-outline">Schedule, review, and track your team syncs.</p>
        </div>
        <button className="btn-primary gap-2 text-sm flex-shrink-0" onClick={() => setShowCreate(true)}>
          <span className="material-symbols-outlined text-lg">add</span>Create Meeting
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
            <input className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary" placeholder="Search meetings..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
          </div>
          <div className="relative">
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
            <thead><tr><th>Meeting Title</th><th>Date & Time</th><th>Participants</th><th></th></tr></thead>
            <tbody>
              {paginated.map((m, idx) => {
                const memberNames = Array.isArray(m.memberNames) ? m.memberNames : [];
                const displayDate = m.meetingDate ? new Date(m.meetingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
                return (
                  <tr key={m._id || idx} className="cursor-pointer group" onClick={() => navigate(`/leader/meeting-detail?id=${m._id}`)}>
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
                      <span className="material-symbols-outlined text-outline hover:text-on-surface cursor-pointer" onClick={e => { e.stopPropagation(); setOpenDD(openDD === idx ? null : idx); }}>more_vert</span>
                      <div className={`ts-dropdown ${openDD === idx ? 'open' : ''}`}>
                        <button className="ts-dropdown-item" onClick={e => { e.stopPropagation(); navigate(`/leader/meeting-detail?id=${m._id}`); setOpenDD(null); }}><span className="material-symbols-outlined text-sm">visibility</span>View Details</button>
                        <div className="ts-dropdown-sep"></div>
                        <button className="ts-dropdown-item danger" onClick={e => { e.stopPropagation(); deleteMeeting(m._id); }}><span className="material-symbols-outlined text-sm">delete</span>Delete Meeting</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="text-xs text-outline">Showing <span className="text-on-surface">{paginated.length}</span> of <span className="text-on-surface">{filtered.length}</span> meetings</p>
          <div className="flex gap-2">
            {page > 1 && (
              <button className="p-2 rounded-lg border border-outline-variant/15 text-outline hover:bg-surface-container-low transition-colors" onClick={() => setPage(p => Math.max(1, p - 1))}>
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
            )}
            {hasMore && (
              <button className="px-4 py-2 rounded-lg border border-outline-variant/15 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-1.5" onClick={() => setPage(p => p + 1)}>
                <span className="material-symbols-outlined text-sm">expand_more</span>Load More
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Create Meeting Modal — Step 1: Meeting Details ═══ */}
      <div className={`ts-modal-overlay ${showCreate && createStep === 1 ? 'open' : ''}`} onClick={e => { if (e.target === e.currentTarget) closeCreateModal(); }}>
        <div className="ts-modal">
          <div className="ts-modal-header">
            <div>
              <h2>Create Meeting</h2>
              <p className="text-xs text-outline mt-0.5">Step 1 of 2 — Meeting Details</p>
            </div>
            <button className="ts-close-btn" onClick={closeCreateModal}><span className="material-symbols-outlined">close</span></button>
          </div>
          <div className="ts-modal-body">
            <form id="create-meeting-form" className="space-y-5" onSubmit={handleNext}>
              <div>
                <label className="ts-label">Meeting Title *</label>
                <input
                  className={`ts-field ${formErrors.title ? 'border-error' : ''}`}
                  type="text"
                  placeholder="e.g. Sprint Review #13"
                  required
                  value={form.title}
                  onChange={e => { setForm({ ...form, title: e.target.value }); setFormErrors(prev => ({ ...prev, title: '' })); }}
                />
                {formErrors.title && <p className="text-xs text-error mt-1">{formErrors.title}</p>}
              </div>
              <div>
                <label className="ts-label">Project Name *</label>
                <input
                  className={`ts-field ${formErrors.projectName ? 'border-error' : ''}`}
                  type="text"
                  placeholder="e.g. Rebranding 2026"
                  required
                  value={form.projectName}
                  onChange={e => { setForm({ ...form, projectName: e.target.value }); setFormErrors(prev => ({ ...prev, projectName: '' })); }}
                />
                {formErrors.projectName && <p className="text-xs text-error mt-1">{formErrors.projectName}</p>}
              </div>
              <div>
                <label className="ts-label">Agenda *</label>
                <textarea
                  className={`ts-field resize-none h-24 ${formErrors.agenda ? 'border-error' : ''}`}
                  placeholder="Brief description of this meeting..."
                  required
                  value={form.agenda}
                  onChange={e => { setForm({ ...form, agenda: e.target.value }); setFormErrors(prev => ({ ...prev, agenda: '' })); }}
                ></textarea>
                {formErrors.agenda && <p className="text-xs text-error mt-1">{formErrors.agenda}</p>}
              </div>
            </form>
          </div>
          <div className="ts-modal-footer">
            <button className="btn-secondary text-sm" onClick={closeCreateModal}>Cancel</button>
            <button
              className="btn-primary text-sm"
              disabled={initiating}
              onClick={() => document.getElementById('create-meeting-form').requestSubmit()}
            >
              {initiating ? (
                <><span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>Initiating…</>
              ) : (
                <>Next <span className="material-symbols-outlined text-sm">arrow_forward</span></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Create Meeting Modal — Step 2: Audio Upload ═══ */}
      <div className={`ts-modal-overlay ${showCreate && createStep === 2 ? 'open' : ''}`} onClick={e => { if (e.target === e.currentTarget) closeCreateModal(); }}>
        <div className="ts-modal">
          <div className="ts-modal-header">
            <div>
              <h2>Upload Meeting Audio</h2>
              <p className="text-xs text-outline mt-0.5">Step 2 of 2 — Audio Recording</p>
            </div>
            <button className="ts-close-btn" onClick={closeCreateModal}><span className="material-symbols-outlined">close</span></button>
          </div>
          <div className="ts-modal-body">
            <div className="space-y-6">
              <div>
                <label className="ts-label">Meeting Audio File (.mp3 only)</label>
                <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all ${uploadError ? 'border-error/50 bg-error/3' : 'border-outline-variant/30 hover:border-primary/40 hover:bg-primary/3'
                  } ${uploading || uploadSuccess ? 'pointer-events-none opacity-60' : ''}`}>
                  <span className="material-symbols-outlined text-3xl text-outline mb-2">{uploadError ? 'error' : 'upload_file'}</span>
                  <p className="text-sm text-on-surface-variant font-medium">
                    {uploading ? 'Uploading...' : uploadSuccess ? 'Upload complete!' : 'Click to select MP3 file'}
                  </p>
                  <p className="text-xs text-outline mt-1">MP3 files only, up to 500MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/mpeg,.mp3"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading || uploadSuccess}
                  />
                </label>
              </div>

              {/* Error message */}
              {uploadError && (
                <div className="flex items-start gap-2 p-3 bg-error/5 border border-error/20 rounded-xl">
                  <span className="material-symbols-outlined text-error text-lg flex-shrink-0 mt-0.5">warning</span>
                  <div>
                    <p className="text-sm text-error font-medium">{uploadError}</p>
                    <button
                      className="text-xs text-error/70 hover:text-error underline mt-1"
                      onClick={() => { setUploadError(null); setUploadFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}

              {/* File info + progress */}
              {uploadFile && !uploadError && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                    <span className="material-symbols-outlined text-primary text-lg">audio_file</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">{uploadFile.name}</p>
                      <p className="text-xs text-outline">{(uploadFile.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                    {uploadSuccess && <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                  </div>

                  {/* Progress bar — only show during/after upload */}
                  {(uploading || uploadProgress > 0) && (
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <p className="text-xs text-outline font-medium">
                          {processing ? 'Starting AI processing...' : uploading ? 'Uploading to cloud...' : uploadSuccess ? 'Upload complete!' : 'Ready to upload'}
                        </p>
                        <p className="text-xs font-mono text-primary font-bold">{uploadProgress}%</p>
                      </div>
                      <div className="w-full bg-surface-container-high rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${uploadSuccess ? 'bg-secondary' : 'bg-primary'}`}
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Success state */}
                  {uploadSuccess && !processing && (
                    <div className="flex items-center gap-2 p-3 bg-secondary/5 border border-secondary/20 rounded-xl">
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <p className="text-sm text-secondary font-medium">Audio uploaded & processing started! Closing shortly...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="ts-modal-footer">
            <button className="btn-secondary text-sm" onClick={() => { if (!uploading) setCreateStep(1); }} disabled={uploading || processing}>
              <span className="material-symbols-outlined text-sm">arrow_back</span> Back
            </button>
            <button
              className="btn-primary text-sm"
              onClick={handleUploadAndProcess}
              disabled={!uploadFile || uploading || uploadSuccess || processing || !!uploadError}
            >
              {uploading ? (
                <><span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>Uploading…</>
              ) : processing ? (
                <><span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>Processing…</>
              ) : uploadSuccess ? (
                <><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>Done!</>
              ) : (
                <><span className="material-symbols-outlined text-sm">cloud_upload</span>Upload & Process</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
