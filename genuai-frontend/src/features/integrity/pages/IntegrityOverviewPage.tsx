/**
 * IntegrityOverviewPage — dashboard overview for integrity monitoring.
 */
import React from 'react';
import { DashboardMetricCard } from '../components/DashboardMetricCard';
import { AnalyticsChart } from '../components/AnalyticsChart';

export interface IntegrityOverviewPageProps {
  sessionId?: string;
}

export const IntegrityOverviewPage: React.FC<IntegrityOverviewPageProps> = () => {
  const metrics = [
    { label: 'Risk Score', value: '12%', icon: 'shield', color: 'success' as const },
    { label: 'Violations', value: 3, icon: 'warning', color: 'warning' as const },
    { label: 'Identity Checks', value: '✓ Pass', icon: 'verified_user', color: 'indigo' as const },
    { label: 'Flagged Events', value: 1, icon: 'flag', color: 'error' as const },
  ];

  const chartData = [
    { label: 'Tab Switches', value: 2, color: '#F59E0B' },
    { label: 'Copy/Paste', value: 1, color: '#EF4444' },
    { label: 'Face Alerts', value: 0, color: '#10B981' },
    { label: 'Audio Peaks', value: 3, color: '#6366F1' },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-black text-on-surface">Integrity Overview</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <DashboardMetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* Analytics Chart */}
      <AnalyticsChart title="Violation Breakdown" data={chartData} />
    </div>
  );
};
