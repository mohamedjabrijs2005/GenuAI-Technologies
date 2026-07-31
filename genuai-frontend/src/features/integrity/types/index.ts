/**
 * Integrity feature types — core.
 */

export type IntegrityRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface IntegritySession {
  sessionId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  riskLevel: IntegrityRiskLevel;
  riskScore: number;
  violations: IntegrityViolation[];
}

export interface IntegrityViolation {
  id: string;
  type: string;
  timestamp: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface IntegrityConfig {
  enableFaceMonitor: boolean;
  enableScreenMonitor: boolean;
  enableTypingBiometrics: boolean;
  enableAudioMonitor: boolean;
}
