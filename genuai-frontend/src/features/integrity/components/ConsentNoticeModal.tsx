/**
 * ConsentNoticeModal — displays an integrity consent notice before a session.
 */
import React from 'react';

export interface ConsentNoticeModalProps {
  onAccept: () => void;
  onDecline?: () => void;
}

export const ConsentNoticeModal: React.FC<ConsentNoticeModalProps> = ({
  onAccept,
  onDecline,
}) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="glass rounded-2xl border border-surface-container p-6 max-w-md w-full flex flex-col gap-4 shadow-2xl">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-indigo-brand text-2xl">shield</span>
        <h2 className="font-black text-on-surface text-lg">Integrity Monitoring Notice</h2>
      </div>
      <p className="text-on-surface-variant text-sm leading-relaxed">
        This session will be monitored for integrity. Your screen activity, keystrokes,
        and (if enabled) webcam feed may be recorded to ensure a fair assessment.
        By clicking "I Agree", you consent to this monitoring.
      </p>
      <div className="flex gap-3 mt-2">
        <button
          onClick={onAccept}
          className="flex-1 py-2.5 rounded-xl bg-indigo-brand text-white font-bold text-sm hover:opacity-90 transition-opacity"
        >
          I Agree
        </button>
        {onDecline && (
          <button
            onClick={onDecline}
            className="flex-1 py-2.5 rounded-xl bg-surface-bright border border-surface-container text-on-surface-variant font-bold text-sm hover:border-error hover:text-error transition-colors"
          >
            Decline
          </button>
        )}
      </div>
    </div>
  </div>
);
