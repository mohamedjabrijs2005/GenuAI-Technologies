/**
 * Utility functions for AI Integrity module formatting and calculations
 */
import type { RiskLevel, EventSeverity } from '../types';

export const getRiskBadgeColor = (risk: RiskLevel): { bg: string; text: string; border: string } => {
  switch (risk) {
    case 'LOW':
      return { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30' };
    case 'MEDIUM':
      return { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' };
    case 'HIGH':
      return { bg: 'bg-error/10', text: 'text-error', border: 'border-error/30' };
  }
};

export const getSeverityBadgeColor = (severity: EventSeverity): { bg: string; text: string } => {
  switch (severity) {
    case 'INFO':
      return { bg: 'bg-info/10', text: 'text-info' };
    case 'WARNING':
      return { bg: 'bg-warning/10', text: 'text-warning' };
    case 'CRITICAL':
      return { bg: 'bg-error/10', text: 'text-error' };
  }
};

export const formatIntegrityScore = (score: number): string => {
  return `${Math.max(0, Math.min(100, Math.round(score)))}%`;
};

export const DEFAULT_INTEGRITY_POLICY = {
  facePresenceWeight: 20,
  voiceConsistencyWeight: 15,
  screenIntegrityWeight: 25,
  typingBiometricsWeight: 10,
  aiAssistanceWeight: 15,
  plagiarismWeight: 15,
  requireConsent: true,
  enableFaceSimilarity: false,
};
