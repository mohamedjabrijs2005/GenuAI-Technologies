import React from 'react';

interface Props {
  user: any;
  onLogout?: () => void;
}

export function AdminDashboardPage({ onLogout }: Props) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-4">
      <h1 className="text-3xl font-black text-on-surface">Admin Dashboard</h1>
      <p className="text-on-surface-variant">System oversight and user management.</p>
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
