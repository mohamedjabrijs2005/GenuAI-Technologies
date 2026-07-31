import React from 'react';
import { IntegrityStatusBadge } from './IntegrityStatusBadge';

interface Props {
  profile: {
    integrityScore: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    identitySummary: {
      facePresenceScore: number;
      faceMatchScore: number;
      voiceConsistencyScore: number;
      livenessResult: string;
    };
    behaviorSummary: {
      tabSwitches: number;
      copyPasteCount: number;
      typingAbnormal: boolean;
    };
    aiAnalysisSummary: {
      aiAssistanceLikelihood: number;
      humanAuthorshipLikelihood: number;
    };
    plagiarismSummary: {
      plagiarismScore: number;
    };
    explanation: {
      identityExplanation: string;
      behaviorExplanation: string;
      aiAnalysisExplanation: string;
      plagiarismExplanation: string;
      overallRiskReason: string;
    };
  };
}

export const RiskProfileCard: React.FC<Props> = ({ profile }) => {
  const { integrityScore, riskLevel, identitySummary, behaviorSummary, aiAnalysisSummary, plagiarismSummary, explanation } = profile;

  return (
    <div className="glass p-6 rounded-2xl border border-surface-container shadow-lg flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex justify-between items-center pb-4 border-b border-surface-container">
        <div>
          <h3 className="text-lg font-bold text-on-surface m-0">🛡️ Integrity Risk Profile</h3>
          <div className="text-xs text-on-surface-variant font-medium mt-1">Multi-signal behavioral &amp; identity evaluation</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-bold text-on-surface-variant uppercase">Integrity Score</div>
            <div className="text-2xl font-black text-indigo-brand">{integrityScore}%</div>
          </div>
          <IntegrityStatusBadge riskLevel={riskLevel} />
        </div>
      </div>

      {/* Grid of 4 Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Identity Section */}
        <div className="p-4 bg-surface-bright border border-surface-container rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase">👤 Identity Verification</span>
            <span className="text-xs font-bold text-success">Verified</span>
          </div>
          <div className="text-xs text-on-surface-variant leading-relaxed mb-2">{explanation.identityExplanation}</div>
          <div className="flex gap-2 text-[11px] font-semibold text-on-surface-variant">
            <span>Face Presence: {identitySummary.facePresenceScore}%</span> •
            <span>Voice Consistency: {identitySummary.voiceConsistencyScore}%</span>
          </div>
        </div>

        {/* Behavior Section */}
        <div className="p-4 bg-surface-bright border border-surface-container rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase">🖥️ Screen &amp; Typing Behavior</span>
            <span className={`text-xs font-bold ${behaviorSummary.tabSwitches > 0 ? 'text-warning' : 'text-success'}`}>
              {behaviorSummary.tabSwitches === 0 ? 'Clean' : `${behaviorSummary.tabSwitches} Flags`}
            </span>
          </div>
          <div className="text-xs text-on-surface-variant leading-relaxed mb-2">{explanation.behaviorExplanation}</div>
          <div className="flex gap-2 text-[11px] font-semibold text-on-surface-variant">
            <span>Tab Switches: {behaviorSummary.tabSwitches}</span> •
            <span>Copy/Paste: {behaviorSummary.copyPasteCount}</span>
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="p-4 bg-surface-bright border border-surface-container rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase">🤖 AI Assistance Likelihood</span>
            <span className="text-xs font-bold text-indigo-brand">{aiAnalysisSummary.aiAssistanceLikelihood}%</span>
          </div>
          <div className="text-xs text-on-surface-variant leading-relaxed mb-2">{explanation.aiAnalysisExplanation}</div>
          <div className="flex gap-2 text-[11px] font-semibold text-on-surface-variant">
            <span>Human Authorship: {aiAnalysisSummary.humanAuthorshipLikelihood}%</span>
          </div>
        </div>

        {/* Plagiarism Section */}
        <div className="p-4 bg-surface-bright border border-surface-container rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase">📄 Plagiarism Analysis</span>
            <span className="text-xs font-bold text-[#8B5CF6]">{plagiarismSummary.plagiarismScore}%</span>
          </div>
          <div className="text-xs text-on-surface-variant leading-relaxed mb-2">{explanation.plagiarismExplanation}</div>
          <div className="flex gap-2 text-[11px] font-semibold text-on-surface-variant">
            <span>Duplication Index: {plagiarismSummary.plagiarismScore}%</span>
          </div>
        </div>
      </div>

      {/* Overall Risk Summary Reason */}
      <div className="p-4 bg-indigo-brand/5 border border-indigo-brand/20 rounded-xl text-xs text-indigo-brand font-semibold leading-relaxed">
        <strong>Overall Risk Assessment:</strong> {explanation.overallRiskReason}
      </div>
    </div>
  );
};
