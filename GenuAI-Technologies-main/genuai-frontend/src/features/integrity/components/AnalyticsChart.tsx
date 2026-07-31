import React from 'react';

interface Props {
  title: string;
  data: { label: string; value: number; color?: string }[];
}

export const AnalyticsChart: React.FC<Props> = ({ title, data }) => {
  const total = data.reduce((a, b) => a + b.value, 0) || 1;

  return (
    <div className="p-4 bg-surface-bright border border-surface-container rounded-xl flex flex-col gap-3">
      <div className="text-xs font-bold text-on-surface-variant uppercase">{title}</div>
      <div className="flex h-4 bg-surface-container rounded-full overflow-hidden">
        {data.map((item, idx) => {
          const pct = Math.round((item.value / total) * 100);
          return (
            <div
              key={idx}
              style={{ width: `${pct}%`, backgroundColor: item.color || '#667EEA' }}
              className="h-full transition-all duration-500"
              title={`${item.label}: ${item.value} (${pct}%)`}
            />
          );
        })}
      </div>
      <div className="flex gap-4 flex-wrap text-xs font-bold">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color || '#667EEA' }} />
            <span className="text-on-surface">{item.label}:</span>
            <span className="text-on-surface-variant">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
