/**
 * IdentityCheckModal — guides the candidate through identity verification.
 */
import React from 'react';
import type { IdentityStatus } from '../hooks/useIdentityVerification';

export interface IdentityCheckModalProps {
  status: IdentityStatus;
  onStart: () => void;
  onClose?: () => void;
}

const statusConfig: Record<IdentityStatus, { icon: string; label: string; color: string }> = {
  idle: { icon: 'person_search', label: 'Ready to verify your identity.', color: 'text-indigo-brand' },
  pending: { icon: 'hourglass_top', label: 'Verifying…', color: 'text-warning-dark' },
  verified: { icon: 'verified_user', label: 'Identity verified!', color: 'text-success' },
  failed: { icon: 'gpp_bad', label: 'Verification failed. Please retry.', color: 'text-error' },
};

export const IdentityCheckModal: React.FC<IdentityCheckModalProps> = ({
  status,
  onStart,
  onClose,
}) => {
  const { icon, label, color } = statusConfig[status];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl border border-surface-container p-6 max-w-sm w-full flex flex-col items-center gap-4 shadow-2xl">
        <span className={`material-symbols-outlined text-5xl ${color}`}>{icon}</span>
        <h2 className="font-black text-on-surface text-base text-center">{label}</h2>

        {(status === 'idle' || status === 'failed') && (
          <button
            onClick={onStart}
            className="w-full py-2.5 rounded-xl bg-indigo-brand text-white font-bold text-sm hover:opacity-90 transition-opacity"
          >
            {status === 'failed' ? 'Retry' : 'Start Verification'}
          </button>
        )}

        {status === 'verified' && onClose && (
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-success text-white font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};
