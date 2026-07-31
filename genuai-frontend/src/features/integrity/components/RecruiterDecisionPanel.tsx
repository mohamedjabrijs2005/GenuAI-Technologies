/**
 * RecruiterDecisionPanel — allows a recruiter to make a hire/reject decision
 * based on integrity data.
 */
import React, { useState } from 'react';

export interface RecruiterDecisionPanelProps {
  candidateName: string;
  onDecision?: (decision: 'hire' | 'reject' | 'review', notes: string) => void;
}

export const RecruiterDecisionPanel: React.FC<RecruiterDecisionPanelProps> = ({
  candidateName,
  onDecision,
}) => {
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handle = (decision: 'hire' | 'reject' | 'review') => {
    onDecision?.(decision, notes);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="glass rounded-xl border border-success/30 p-4 text-center text-success font-bold text-sm">
        Decision submitted for {candidateName}.
      </div>
    );
  }

  return (
    <div className="glass rounded-xl border border-surface-container p-4 flex flex-col gap-3">
      <div className="font-bold text-on-surface text-sm">
        Recruiter Decision — <span className="text-indigo-brand">{candidateName}</span>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add notes (optional)…"
        rows={3}
        className="w-full rounded-lg border border-surface-container bg-surface-bright px-3 py-2 text-sm text-on-surface resize-none focus:outline-none focus:border-indigo-brand"
      />
      <div className="flex gap-2">
        <button
          onClick={() => handle('hire')}
          className="flex-1 py-2 rounded-lg bg-success text-white text-xs font-bold hover:opacity-90 transition-opacity"
        >
          Hire
        </button>
        <button
          onClick={() => handle('review')}
          className="flex-1 py-2 rounded-lg bg-warning text-white text-xs font-bold hover:opacity-90 transition-opacity"
        >
          Review
        </button>
        <button
          onClick={() => handle('reject')}
          className="flex-1 py-2 rounded-lg bg-error text-white text-xs font-bold hover:opacity-90 transition-opacity"
        >
          Reject
        </button>
      </div>
    </div>
  );
};
