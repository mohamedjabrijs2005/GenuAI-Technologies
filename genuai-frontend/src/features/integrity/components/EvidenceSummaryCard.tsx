/**
 * EvidenceSummaryCard — shows a brief summary of integrity evidence.
 */
import React from 'react';

export interface EvidenceSummaryCardProps {
  label: string;
  value: string | number;
  icon?: string;
}

export const EvidenceSummaryCard: React.FC<EvidenceSummaryCardProps> = ({
  label,
  value,
  icon,
}) => (
  <div className="glass rounded-xl border border-surface-container p-4 flex items-center gap-3">
    {icon && (
      <span className="material-symbols-outlined text-indigo-brand text-xl">{icon}</span>
    )}
    <div>
      <div className="text-xs text-on-surface-variant font-medium">{label}</div>
      <div className="text-base font-black text-on-surface">{value}</div>
    </div>
  </div>
);
