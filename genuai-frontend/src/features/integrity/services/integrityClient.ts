/**
 * Integrity Module Frontend API Service
 */
import apiClient from '../../../services/apiClient';
import type {
  IdentityVerificationResult,
  MonitoringEvent,
  IntegrityScoreReport,
  CandidateConsent,
} from '../types';

export function submitConsent(consent: CandidateConsent): Promise<any>;
export function submitConsent(sessionId: string, consent: CandidateConsent): Promise<any>;
export async function submitConsent(
  sessionIdOrConsent: string | CandidateConsent,
  maybeConsent?: CandidateConsent
) {
  let sessionId: string;
  let consent: CandidateConsent;
  if (typeof sessionIdOrConsent === 'string') {
    sessionId = sessionIdOrConsent;
    consent = maybeConsent!;
  } else {
    consent = sessionIdOrConsent;
    sessionId = `session-${(consent as any)?.candidateId || Date.now()}`;
  }
  const res = await apiClient.post('/integrity/consent', { sessionId, ...consent });
  return res.data;
}

export const verifyIdentity = async (payload: {
  sessionId?: string;
  candidateId: number;
  faceImageBase64?: string;
  voiceSampleBase64?: string;
}): Promise<IdentityVerificationResult> => {
  const finalPayload = {
    sessionId: payload.sessionId || `session-${payload.candidateId}-${Date.now()}`,
    ...payload,
  };
  const res = await apiClient.post('/integrity/verify-identity', finalPayload);
  return res.data;
};

export const logMonitoringEvent = async (event: Partial<MonitoringEvent>) => {
  const res = await apiClient.post('/integrity/log-event', event);
  return res.data;
};

export const fetchIntegrityReport = async (sessionId: string): Promise<IntegrityScoreReport> => {
  const res = await apiClient.get(`/integrity/report/${sessionId}`);
  return res.data;
};

export const fetchCompanyIntegrityReports = async (companyId: number): Promise<IntegrityScoreReport[]> => {
  const res = await apiClient.get(`/integrity/company/${companyId}`);
  return res.data;
};

export const fetchAdminIntegrityAnalytics = async () => {
  const res = await apiClient.get('/integrity/analytics');
  return res.data;
};
