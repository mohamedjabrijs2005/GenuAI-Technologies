import React from 'react';

interface Props {
  recommendation: {
    primaryAction: 'Proceed' | 'Manual Review' | 'Additional Technical Interview' | 'Additional HR Interview';
    secondaryAction?: string;
    reasoning: string;
  };
}

export const RecommendationCard: React.FC<Props> = ({ recommendation }) => {
  const getBadgeStyle = (act: string) => {
    switch (act) {
      case 'Proceed':
        return 'bg-success/10 text-success border-success/30';
      case 'Manual Review':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'Additional Technical Interview':
        return 'bg-indigo-brand/10 text-indigo-brand border-indigo-brand/30';
      case 'Additional HR Interview':
        return 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30';
      default:
        return 'bg-surface-container text-on-surface-variant border-surface-container';
    }
  };

  return (
    <div className="glass p-5 rounded-2xl border border-surface-container shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">💡</span>
        <h4 className="text-sm font-bold text-on-surface uppercase m-0">Recruiter AI Recommendation</h4>
      </div>

      <div className="flex gap-2 mb-3 flex-wrap">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeStyle(recommendation.primaryAction)}`}>
          RECOMMENDED: {recommendation.primaryAction}
        </span>
        {recommendation.secondaryAction && (
          <span className="px-3 py-1 rounded-full text-xs font-bold border bg-surface-bright text-on-surface-variant border-surface-container">
            ALT: {recommendation.secondaryAction}
          </span>
        )}
      </div>

      <p className="text-xs font-medium text-on-surface-variant leading-relaxed m-0 bg-surface-bright p-3 rounded-xl border border-surface-container">
        {recommendation.reasoning}
      </p>

      <div className="mt-3 text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-wider text-right">
        ⚖️ Responsible AI Policy: Final hiring decisions belong strictly to the recruiter.
      </div>
    </div>
  );
};
