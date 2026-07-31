/**
 * RecommendationCard — displays an integrity recommendation.
 */
import React from 'react';

export interface RecommendationCardProps {
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  description,
  severity = 'low',
}) => {
  const colors = {
    low: 'border-success/30 bg-success/5 text-success',
    medium: 'border-warning/30 bg-warning/5 text-warning-dark',
    high: 'border-error/30 bg-error/5 text-error',
  };

  return (
    <div className={`rounded-xl border p-4 ${colors[severity]}`}>
      <div className="font-bold text-sm mb-1">{title}</div>
      <div className="text-xs opacity-80">{description}</div>
    </div>
  );
};
