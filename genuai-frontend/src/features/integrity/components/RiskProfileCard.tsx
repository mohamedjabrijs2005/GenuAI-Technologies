/**
 * RiskProfileCard — displays a candidate's full integrity risk profile.
 */
import React from 'react';
import type { IntegrityRiskLevel } from '../types';
import { IntegrityStatusBadge } from './IntegrityStatusBadge';

export interface RiskProfileCardProps {
  candidateName: string;
  riskLevel: IntegrityRiskLevel;
  riskScore: number;
  violationCount: number;
  sessionDuration?: string;
}

export const RiskProfileCard: React.FC<RiskProfileCardProps> = ({
  candidateName,
  riskLevel,
  riskScore,
  violationCount,
  sessionDuration,
}) => (
  <div className="glass rounded-2xl border border-surface-container p-5 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div>
        <div className="font-black text-on-surface text-base">{candidateName}</div>
        {sessionDuration && (
          <div className="text-xs text-on-surface-variant mt-0.5">
            Session: {sessionDuration}
          </div>
        )}
      </div>
      <IntegrityStatusBadge level={riskLevel} />
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="bg-surface-bright rounded-xl border border-surface-container p-3 text-center">
        <div className="text-2xl font-black text-on-surface">{riskScore}</div>
        <div className="text-[11px] text-on-surface-variant font-medium mt-0.5">Risk Score</div>
      </div>
      <div className="bg-surface-bright rounded-xl border border-surface-container p-3 text-center">
        <div className="text-2xl font-black text-error">{violationCount}</div>
        <div className="text-[11px] text-on-surface-variant font-medium mt-0.5">Violations</div>
      </div>
    </div>
  </div>
);
