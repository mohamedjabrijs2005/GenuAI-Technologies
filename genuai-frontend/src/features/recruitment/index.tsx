import React from 'react';

interface Props {
  user: any;
  onLogout?: () => void;
  onInterview?: () => void;
}

export function CandidatePipelinePage({ onLogout, onInterview }: Props) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-4">
      <h1 className="text-3xl font-black text-on-surface">Candidate Evaluation Pipeline</h1>
      <p className="text-on-surface-variant">Complete your assessment modules step-by-step.</p>
      <div className="flex gap-4">
        {onInterview && (
          <button
            onClick={onInterview}
            className="px-6 py-3 rounded-xl bg-indigo-brand text-white font-bold"
          >
            Go to AI Mock Interview
          </button>
        )}
        {onLogout && (
          <button
            onClick={onLogout}
            className="px-6 py-3 rounded-xl bg-surface-bright border border-surface-container text-on-surface-variant font-bold"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
