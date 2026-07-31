/**
 * EvidenceViewer — renders a list of integrity evidence items.
 */
import React from 'react';

export interface EvidenceItem {
  id: string;
  type: string;
  timestamp: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface EvidenceViewerProps {
  items: EvidenceItem[];
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({ items }) => {
  const severityColor = {
    low: 'text-success',
    medium: 'text-warning-dark',
    high: 'text-error',
  };

  return (
    <div className="flex flex-col gap-2">
      {items.length === 0 && (
        <p className="text-on-surface-variant text-sm text-center py-4">
          No evidence recorded.
        </p>
      )}
      {items.map((item) => (
        <div
          key={item.id}
          className="glass rounded-xl border border-surface-container p-3 flex items-start gap-3"
        >
          <span
            className={`material-symbols-outlined text-lg mt-0.5 ${severityColor[item.severity]}`}
          >
            {item.severity === 'high'
              ? 'error'
              : item.severity === 'medium'
              ? 'warning'
              : 'info'}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-on-surface">{item.type}</span>
              <span className="text-[10px] text-on-surface-variant shrink-0">
                {item.timestamp}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
