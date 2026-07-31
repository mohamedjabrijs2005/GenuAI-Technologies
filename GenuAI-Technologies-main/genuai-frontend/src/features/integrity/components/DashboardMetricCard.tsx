import React from 'react';

interface Props {
  icon: string;
  label: string;
  value: string | number;
  subtext?: string;
  colorClass?: string;
}

export const DashboardMetricCard: React.FC<Props> = ({
  icon,
  label,
  value,
  subtext,
  colorClass = 'text-indigo-brand',
}) => {
  return (
    <div className="p-4 bg-surface-bright border border-surface-container rounded-xl flex items-center gap-3 shadow-sm hover:border-surface-container-high transition-colors">
      <div className="w-10 h-10 rounded-xl bg-surface-container/40 flex items-center justify-center text-xl shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{label}</div>
        <div className={`text-2xl font-black ${colorClass}`}>{value}</div>
        {subtext && <div className="text-[10px] font-medium text-on-surface-variant/80 mt-0.5">{subtext}</div>}
      </div>
    </div>
  );
};
