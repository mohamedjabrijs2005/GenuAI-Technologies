import React from 'react';
import { IntegrityStatusBadge } from '../components/IntegrityStatusBadge';

export const IntegrityOverviewPage: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto glass rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 text-on-surface">🛡️ AI Integrity & Identity Verification System</h1>
      <p className="text-on-surface-variant mb-6">
        Privacy-conscious, browser-compatible monitoring and risk engine for recruitment assessments.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-surface-bright border border-surface-container rounded-xl">
          <div className="text-xs font-bold text-on-surface-variant uppercase mb-1">Status</div>
          <IntegrityStatusBadge riskLevel="LOW" score={95} />
        </div>
        <div className="p-4 bg-surface-bright border border-surface-container rounded-xl">
          <div className="text-xs font-bold text-on-surface-variant uppercase mb-1">Identity Check</div>
          <div className="text-lg font-bold text-success">Verified</div>
        </div>
        <div className="p-4 bg-surface-bright border border-surface-container rounded-xl">
          <div className="text-xs font-bold text-on-surface-variant uppercase mb-1">Responsible AI</div>
          <div className="text-xs font-medium text-on-surface-variant">Recruiter decides hiring</div>
        </div>
      </div>
    </div>
  );
};
