/**
 * IntegrityStatusBadge — shows a colored badge for an integrity risk level.
 */
import React from 'react';
import type { IntegrityRiskLevel } from '../types';

export interface IntegrityStatusBadgeProps {
  level: IntegrityRiskLevel;
}

const config: Record<IntegrityRiskLevel, { label: string; classes: string }> = {
  low: { label: 'Low Risk', classes: 'bg-success/10 text-success border-success/30' },
  medium: { label: 'Medium Risk', classes: 'bg-warning/10 text-warning-dark border-warning/30' },
  high: { label: 'High Risk', classes: 'bg-error/10 text-error border-error/30' },
  critical: { label: 'Critical', classes: 'bg-error/20 text-error border-error/50 font-black' },
};

export const IntegrityStatusBadge: React.FC<IntegrityStatusBadgeProps> = ({ level }) => {
  const { label, classes } = config[level];
  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold border ${classes}`}>
      {label}
    </span>
  );
};
