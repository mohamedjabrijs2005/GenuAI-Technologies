/**
 * DashboardMetricCard — a single KPI tile for the integrity dashboard.
 */
import React from 'react';

export interface DashboardMetricCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'indigo' | 'success' | 'warning' | 'error';
}

export const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  label,
  value,
  icon,
  trend,
  color = 'indigo',
}) => {
  const colorMap = {
    indigo: 'text-indigo-brand bg-indigo-brand/10 border-indigo-brand/20',
    success: 'text-success bg-success/10 border-success/20',
    warning: 'text-warning-dark bg-warning/10 border-warning/20',
    error: 'text-error bg-error/10 border-error/20',
  };

  const trendIcon = trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : '';

  return (
    <div
      className={`rounded-2xl border p-4 flex flex-col gap-2 ${colorMap[color]}`}
    >
      <div className="flex items-center justify-between">
        {icon && (
          <span className="material-symbols-outlined text-xl">{icon}</span>
        )}
        {trendIcon && (
          <span className="material-symbols-outlined text-base">{trendIcon}</span>
        )}
      </div>
      <div className="text-2xl font-black">{value}</div>
      <div className="text-xs font-medium opacity-80">{label}</div>
    </div>
  );
};
