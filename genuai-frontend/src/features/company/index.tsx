import React from 'react';

interface Props {
  user: any;
  onLogout?: () => void;
  onStartTest?: () => void;
}

export function CompanyOverviewPage({ onStartTest }: Props) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-4">
      <h1 className="text-3xl font-black text-on-surface">Company Overview</h1>
      <p className="text-on-surface-variant">Explore opportunities & requirements.</p>
      {onStartTest && (
        <button
          onClick={onStartTest}
          className="px-6 py-3 rounded-xl bg-indigo-brand text-white font-bold"
        >
          Start Candidate Pipeline
        </button>
      )}
    </div>
  );
}

export function CompanyDashboardPage({ onLogout }: Props) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-4">
      <h1 className="text-3xl font-black text-on-surface">Company / HR Dashboard</h1>
      <p className="text-on-surface-variant">Manage job postings and evaluate candidate applications.</p>
      {onLogout && (
        <button
          onClick={onLogout}
          className="px-6 py-2 rounded-xl bg-surface-bright border border-surface-container text-on-surface-variant font-bold text-xs"
        >
          Logout
        </button>
      )}
    </div>
  );
}
