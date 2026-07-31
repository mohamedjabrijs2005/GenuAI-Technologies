import React, { useState } from 'react';
import type { CandidateConsent } from '../types';

interface Props {
  onConsentGiven: (consent: CandidateConsent) => void;
  onDecline: () => void;
}

export const ConsentNoticeModal: React.FC<Props> = ({ onConsentGiven, onDecline }) => {
  const [agreed, setAgreed] = useState(false);

  const handleConfirm = () => {
    if (!agreed) return;
    onConsentGiven({
      given: true,
      timestamp: new Date().toISOString(),
      policyVersion: '1.0',
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[3000] flex items-center justify-center p-4">
      <div className="glass p-8 rounded-2xl max-w-xl w-full border border-surface-container shadow-2xl animate-[fadeIn_0.3s_ease]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-brand/10 border border-indigo-brand/30 flex items-center justify-center text-indigo-brand font-black text-xl">
            🛡️
          </div>
          <div>
            <h2 className="text-xl font-bold text-on-surface m-0">Identity &amp; Security Check Notice</h2>
            <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Candidate Transparency &amp; Privacy Agreement</div>
          </div>
        </div>

        <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
          To ensure a fair assessment process for all candidates, GenuAI uses lightweight identity verification and security monitoring during this session.
        </p>

        <div className="bg-surface-bright border border-surface-container rounded-xl p-4 mb-4 flex flex-col gap-3 text-xs text-on-surface-variant">
          <div className="flex items-start gap-2">
            <span className="text-base leading-none">📷</span>
            <div>
              <strong className="text-on-surface block">Face Presence Monitoring:</strong>
              Monitors whether your face is visible in the frame during the assessment. No raw video is permanently stored.
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-base leading-none">🎙️</span>
            <div>
              <strong className="text-on-surface block">Voice Baseline:</strong>
              Captures a brief 5-second voice sample reading a random sentence to establish a consistency baseline for spoken answers.
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-base leading-none">🔒</span>
            <div>
              <strong className="text-on-surface block">Privacy &amp; Data Retention:</strong>
              Biometric embeddings are used only for session verification and are automatically purged. AI output is treated solely as risk indicator evidence for recruiter review. AI never automatically rejects or fails candidates.
            </div>
          </div>
        </div>

        <label className="flex items-center gap-3 p-3 bg-surface-container/30 border border-surface-container rounded-xl cursor-pointer mb-6 hover:bg-surface-container/50 transition-colors">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 accent-indigo-brand rounded"
          />
          <span className="text-xs font-bold text-on-surface">
            I understand and consent to the Identity &amp; Security Check notice.
          </span>
        </label>

        <div className="flex gap-3">
          <button
            onClick={onDecline}
            className="flex-1 py-3 bg-surface-bright text-on-surface border border-surface-container rounded-xl text-xs font-bold hover:bg-surface-container transition-colors"
          >
            Decline &amp; Exit
          </button>
          <button
            onClick={handleConfirm}
            disabled={!agreed}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
              agreed
                ? 'bg-indigo-brand text-white shadow-lg hover:shadow-indigo-brand/30 hover:scale-[1.02]'
                : 'bg-surface-container text-on-surface-variant/40 cursor-not-allowed'
            }`}
          >
            Agree &amp; Continue →
          </button>
        </div>
      </div>
    </div>
  );
};
