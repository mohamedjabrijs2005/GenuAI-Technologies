/**
 * AIMockInterviewPage — integrity-monitored AI Mock Interview session page.
 */
import React from 'react';

export interface AIMockInterviewPageProps {
  sessionId?: string;
  onComplete?: () => void;
}

export const AIMockInterviewPage: React.FC<AIMockInterviewPageProps> = ({
  onComplete,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 min-h-[60vh]">
      <div className="w-16 h-16 rounded-2xl bg-indigo-brand/10 flex items-center justify-center border border-indigo-brand/20">
        <span className="material-symbols-outlined text-indigo-brand text-3xl">
          smart_toy
        </span>
      </div>
      <h1 className="text-2xl font-black text-on-surface">AI Mock Interview</h1>
      <p className="text-on-surface-variant text-sm text-center max-w-md">
        This session is monitored for integrity. Your screen, audio, and identity
        will be verified throughout the interview.
      </p>
      {onComplete && (
        <button
          onClick={onComplete}
          className="px-6 py-3 rounded-xl bg-indigo-brand text-white font-bold hover:opacity-90 transition-opacity text-sm"
        >
          Start Session
        </button>
      )}
    </div>
  );
};
