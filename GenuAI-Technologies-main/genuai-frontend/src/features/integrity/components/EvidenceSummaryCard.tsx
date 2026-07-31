import React from 'react';

interface Props {
  behaviorSummary: {
    tabSwitches: number;
    copyPasteCount: number;
    typingAbnormal: boolean;
    totalEventsCount: number;
  };
}

export const EvidenceSummaryCard: React.FC<Props> = ({ behaviorSummary }) => {
  return (
    <div className="p-4 bg-surface-bright border border-surface-container rounded-xl">
      <div className="text-xs font-bold text-on-surface-variant uppercase mb-3">📁 Evidence Timeline Summary</div>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-2 bg-surface-container/30 rounded-lg">
          <div className="text-[10px] text-on-surface-variant font-bold">TOTAL EVENTS</div>
          <div className="text-base font-black text-on-surface">{behaviorSummary.totalEventsCount}</div>
        </div>
        <div className="p-2 bg-surface-container/30 rounded-lg">
          <div className="text-[10px] text-on-surface-variant font-bold">TAB SWITCHES</div>
          <div className={`text-base font-black ${behaviorSummary.tabSwitches > 0 ? 'text-warning' : 'text-success'}`}>
            {behaviorSummary.tabSwitches}
          </div>
        </div>
        <div className="p-2 bg-surface-container/30 rounded-lg">
          <div className="text-[10px] text-on-surface-variant font-bold">COPY/PASTE</div>
          <div className={`text-base font-black ${behaviorSummary.copyPasteCount > 0 ? 'text-warning' : 'text-success'}`}>
            {behaviorSummary.copyPasteCount}
          </div>
        </div>
        <div className="p-2 bg-surface-container/30 rounded-lg">
          <div className="text-[10px] text-on-surface-variant font-bold">TYPING</div>
          <div className="text-base font-black text-indigo-brand">
            {behaviorSummary.typingAbnormal ? 'VAR' : 'NORM'}
          </div>
        </div>
      </div>
    </div>
  );
};
