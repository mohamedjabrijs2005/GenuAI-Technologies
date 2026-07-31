/**
 * Integrity utility functions.
 */

import type { IntegrityViolation, IntegrityRiskLevel } from '../types';

/**
 * Compute a risk level label from a numeric score (0–100).
 */
export function getRiskLevel(score: number): IntegrityRiskLevel {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

/**
 * Count violations by severity.
 */
export function countViolationsBySeverity(
  violations: IntegrityViolation[]
): Record<'low' | 'medium' | 'high', number> {
  return violations.reduce(
    (acc, v) => {
      acc[v.severity] += 1;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );
}

/**
 * Format a timestamp string to locale time.
 */
export function formatIntegrityTimestamp(ts: string): string {
  try {
    return new Date(ts).toLocaleTimeString();
  } catch {
    return ts;
  }
}
