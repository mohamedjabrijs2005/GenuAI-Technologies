import React, { useState } from 'react';
import apiClient from '../../../services/apiClient';

interface Props {
  sessionId: string;
  candidateId: number;
  candidateName: string;
  initialStatus?: 'Shortlisted' | 'Hold' | 'Rejected' | 'Selected' | 'Pending';
  initialNotes?: string;
  onSaved?: () => void;
}

export const RecruiterDecisionPanel: React.FC<Props> = ({
  sessionId,
  candidateId,
  candidateName,
  initialStatus = 'Pending',
  initialNotes = '',
  onSaved,
}) => {
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes);
  const [nextInterviewDate, setNextInterviewDate] = useState('');
  const [reviewer, setReviewer] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiClient.post('/integrity/decision', {
        sessionId,
        candidateId,
        recruiterNotes: notes,
        decisionStatus: status,
        scheduledNextInterviewAt: nextInterviewDate || undefined,
        assignedReviewer: reviewer || undefined,
        updatedAt: new Date().toISOString(),
      });
      setSavedMsg('✅ Recruiter decision saved successfully!');
      setTimeout(() => setSavedMsg(''), 3000);
      if (onSaved) onSaved();
    } catch {
      alert('Failed to save recruiter decision.');
    }
    setIsSaving(false);
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'Selected':
        return 'bg-success/10 text-success border-success/30';
      case 'Shortlisted':
        return 'bg-indigo-brand/10 text-indigo-brand border-indigo-brand/30';
      case 'Hold':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'Rejected':
        return 'bg-error/10 text-error border-error/30';
      default:
        return 'bg-surface-container text-on-surface-variant border-surface-container';
    }
  };

  return (
    <div className="glass p-6 rounded-2xl border border-surface-container shadow-md flex flex-col gap-4">
      <div className="flex justify-between items-center pb-3 border-b border-surface-container">
        <div>
          <h4 className="text-base font-bold text-on-surface m-0">👤 Recruiter Decision &amp; Notes Panel</h4>
          <div className="text-xs font-semibold text-on-surface-variant mt-0.5">
            Human Decision Authority — Candidate: <strong className="text-on-surface">{candidateName}</strong>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(status)}`}>
          {status.toUpperCase()}
        </span>
      </div>

      {/* Decision Buttons */}
      <div>
        <label className="text-xs font-bold text-on-surface-variant uppercase mb-2 block">Set Hiring Decision Status</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['Shortlisted', 'Hold', 'Selected', 'Rejected'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                status === s
                  ? getStatusBadge(s) + ' shadow-sm scale-[1.02]'
                  : 'bg-surface-bright text-on-surface-variant border-surface-container hover:bg-surface-container/50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Next Interview & Reviewer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-on-surface-variant uppercase mb-1 block">Schedule Next Interview Date</label>
          <input
            type="datetime-local"
            value={nextInterviewDate}
            onChange={(e) => setNextInterviewDate(e.target.value)}
            className="w-full p-2.5 bg-surface-bright border border-surface-container rounded-xl text-xs font-bold text-on-surface outline-none focus:border-indigo-brand"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-on-surface-variant uppercase mb-1 block">Assign Reviewer</label>
          <input
            type="text"
            placeholder="e.g. Lead Engineer / HR Name"
            value={reviewer}
            onChange={(e) => setReviewer(e.target.value)}
            className="w-full p-2.5 bg-surface-bright border border-surface-container rounded-xl text-xs font-bold text-on-surface outline-none focus:border-indigo-brand"
          />
        </div>
      </div>

      {/* Private Notes */}
      <div>
        <label className="text-xs font-bold text-on-surface-variant uppercase mb-1 block">Private Recruiter Notes &amp; HR Comments</label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add private evaluation notes, interview feedback, or HR rationale..."
          className="w-full p-3 bg-surface-bright border border-surface-container rounded-xl text-xs font-medium text-on-surface outline-none focus:border-indigo-brand leading-relaxed"
        />
      </div>

      {savedMsg && <div className="p-2.5 bg-success/10 border border-success/30 text-success rounded-xl font-bold text-xs text-center">{savedMsg}</div>}

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-3 bg-indigo-brand text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-indigo-brand/30 hover:scale-[1.01] transition-all"
      >
        {isSaving ? 'Saving Decision...' : '💾 Save Recruiter Decision & Notes'}
      </button>
    </div>
  );
};
