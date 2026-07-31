/**
 * Admin Service — candidates list, platform stats, verdict updates, CSV export.
 */
import apiClient from './apiClient';

export const getCandidates = () =>
  apiClient.get('/admin/candidates');

export const getStats = () =>
  apiClient.get('/admin/stats');

export const getRoleAnalytics = () =>
  apiClient.get('/admin/role-analytics');

export const getCandidatesForCompany = (companyId: number, token: string) =>
  apiClient.get(`/admin/candidates/for-company/${companyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getCompanies = () =>
  apiClient.get('/admin/companies');

export const updateVerdict = (candidateId: number, verdict: string, token: string) =>
  apiClient.put(`/admin/verdict/${candidateId}`, { verdict }, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const sendVerdictEmail = (data: any, token: string) =>
  apiClient.post('/email/verdict', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
