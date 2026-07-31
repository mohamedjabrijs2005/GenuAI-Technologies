import React from 'react';
import type { RiskLevel } from '../types';
import { getRiskBadgeColor } from '../utils/integrityUtils';

interface Props {
  riskLevel: RiskLevel;
  score?: number;
}

export const IntegrityStatusBadge: React.FC<Props> = ({ riskLevel, score }) => {
  const { bg, text, border } = getRiskBadgeColor(riskLevel);

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${bg} ${text} ${border}`}>
      <span className="w-2 h-2 rounded-full bg-current" />
      <span>{riskLevel} RISK</span>
      {score !== undefined && <span className="opacity-75">({score}%)</span>}
    </span>
  );
};
