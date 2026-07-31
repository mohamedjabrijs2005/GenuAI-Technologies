/**
 * AnalyticsChart — a simple bar-chart wrapper for integrity analytics.
 * Uses inline SVG so there is no extra dependency.
 */
import React from 'react';

export interface AnalyticsChartDataPoint {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

export interface AnalyticsChartProps {
  title?: string;
  data: AnalyticsChartDataPoint[];
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ title, data }) => {
  const max = Math.max(...data.map((d) => d.maxValue ?? d.value), 100);

  return (
    <div className="glass rounded-xl border border-surface-container p-4 flex flex-col gap-3">
      {title && <div className="font-bold text-on-surface text-sm">{title}</div>}
      <div className="flex flex-col gap-2">
        {data.map((d, i) => {
          const pct = Math.round((d.value / max) * 100);
          return (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant w-24 shrink-0 truncate">
                {d.label}
              </span>
              <div className="flex-1 bg-surface-container rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: d.color ?? 'var(--color-indigo-brand, #4F46E5)',
                  }}
                />
              </div>
              <span className="text-xs font-bold text-on-surface w-8 text-right">
                {d.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
