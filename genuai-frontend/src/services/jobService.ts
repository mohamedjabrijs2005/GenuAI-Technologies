/**
 * Job & Search Hub Service — jobs, network posts, events, PM status, news.
 */
import apiClient from './apiClient';

export const getJobs = () =>
  apiClient.get('/jobs/list');

export const getJobsByCompany = (companyId: number) =>
  apiClient.get(`/jobs/company/${companyId}`);

export const createJob = (data: any, token: string) =>
  apiClient.post('/jobs/create', data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteJob = (jobId: number, token: string) =>
  apiClient.delete(`/jobs/${jobId}`, { headers: { Authorization: `Bearer ${token}` } });

export const getNetworkPosts = () =>
  apiClient.get('/network/posts');

export const createNetworkPost = (data: { content: string }) =>
  apiClient.post('/network/posts', data);

export const getEvents = () =>
  apiClient.get('/events/list');

export const getPMStatus = () =>
  apiClient.get('/pm/status');

export const getNews = () =>
  apiClient.get('/news/latest');

export const scheduleInterview = (data: {
  candidate_id: number;
  job_id: number;
  scheduled_at: string;
  notes?: string;
}) => apiClient.post('/interviews/schedule', data);

export const getCompanyInterviews = (companyId: number, token: string) =>
  apiClient.get(`/interviews/company/${companyId}`, { headers: { Authorization: `Bearer ${token}` } });

export const getCandidateInterviews = (candidateId: number, token: string) =>
  apiClient.get(`/interviews/candidate/${candidateId}`, { headers: { Authorization: `Bearer ${token}` } });

export const updateInterviewStatus = (id: number, status: string, token: string) =>
  apiClient.put(`/interviews/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
