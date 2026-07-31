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

export const submitConsent = async (consent: CandidateConsent) => {
  const res = await apiClient.post('/integrity/consent', consent);
  return res.data;
};

export const verifyIdentity = async (payload: {
  candidateId: number;
  faceImageBase64?: string;
  voiceSampleBase64?: string;
}): Promise<IdentityVerificationResult> => {
  const res = await apiClient.post('/integrity/verify-identity', payload);
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
