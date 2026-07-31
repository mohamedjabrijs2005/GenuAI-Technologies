import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', glass = true }) => {
  const baseClass = glass
    ? 'glass p-6 rounded-2xl border border-surface-container shadow-md'
    : 'bg-surface-bright p-6 rounded-2xl border border-surface-container shadow-sm';

  return <div className={`${baseClass} ${className}`}>{children}</div>;
};
