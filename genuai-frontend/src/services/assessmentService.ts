/**
 * Assessment Service — submit results, fetch history, cheat logging.
 */
import apiClient, { lambdaClient } from './apiClient';
import type { AssessmentSubmitPayload } from '../types';

export const submitAssessment = (data: AssessmentSubmitPayload) =>
  apiClient.post('/assessment/submit', data);

export const getAssessment = (id: number) =>
  apiClient.get(`/assessment/${id}`);

export const logCheat = (data: {
  user_id: number;
  assessment_id: number;
  violation_type: string;
  count: number;
  auto_terminated: boolean;
}) => apiClient.post('/assessment/cheat', data);

export const getHistory = (userId: number) =>
  apiClient.get(`/history/${userId}`);

export const getBestScore = (userId: number) =>
  apiClient.get(`/history/${userId}/best`);

// Lambda AI evaluation functions
export const checkATS     = (data: any) => lambdaClient.post('/ats-check', data);
export const detectFake   = (data: any) => lambdaClient.post('/fake-detect', data);
export const scoreSkills  = (data: any) => lambdaClient.post('/skill-score', data);
export const runTriangle  = (data: any) => lambdaClient.post('/triangle', data);
