/**
 * RiskSummaryCard — a compact summary tile showing overall risk status.
 */
import React from 'react';
import type { IntegrityRiskLevel } from '../types';

export interface RiskSummaryCardProps {
  riskLevel: IntegrityRiskLevel;
  riskScore: number;
  label?: string;
}

const colorMap: Record<IntegrityRiskLevel, string> = {
  low: 'border-success/30 bg-success/5 text-success',
  medium: 'border-warning/30 bg-warning/5 text-warning-dark',
  high: 'border-error/30 bg-error/5 text-error',
  critical: 'border-error/50 bg-error/10 text-error',
};

export const RiskSummaryCard: React.FC<RiskSummaryCardProps> = ({
  riskLevel,
  riskScore,
  label = 'Risk Summary',
}) => (
  <div className={`rounded-2xl border p-4 flex items-center gap-4 ${colorMap[riskLevel]}`}>
    <div className="text-3xl font-black">{riskScore}</div>
    <div>
      <div className="font-bold text-sm capitalize">{riskLevel} Risk</div>
      <div className="text-xs opacity-70 mt-0.5">{label}</div>
    </div>
  </div>
);
