import React from 'react';
import { IntegrityStatusBadge } from './IntegrityStatusBadge';

interface Props {
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  verifiedIdentity: boolean;
}

export const RiskSummaryCard: React.FC<Props> = ({ score, riskLevel, verifiedIdentity }) => {
  return (
    <div className="p-4 bg-surface-bright border border-surface-container rounded-xl flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-brand/10 border border-indigo-brand/30 flex items-center justify-center text-xl">
          📊
        </div>
        <div>
          <div className="text-xs font-bold text-on-surface-variant uppercase">Session Risk Summary</div>
          <div className="text-sm font-bold text-on-surface">
            {verifiedIdentity ? '✅ Identity Verified' : '⚠️ Pending Identity Check'}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-[10px] font-bold text-on-surface-variant uppercase">Score</div>
          <div className="text-xl font-black text-indigo-brand">{score}%</div>
        </div>
        <IntegrityStatusBadge riskLevel={riskLevel} />
      </div>
    </div>
  );
};
