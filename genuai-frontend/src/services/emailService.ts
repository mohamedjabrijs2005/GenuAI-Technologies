/**
 * Email Service — send assessment result email and verdict email.
 */
import apiClient from './apiClient';

export interface AssessmentEmailPayload {
  candidateEmail: string;
  candidateName: string;
  overallScore: number;
  verdict: string;
  salaryMin: number;
  salaryMax: number;
  atsScore: number;
  testScore: number;
  interviewScore: number;
  authenticityScore: number;
  triangleStatus: string;
  role: string;
  keyStrengths: string[];
  improvementPlan: string[];
}

export const sendAssessmentEmail = (data: AssessmentEmailPayload) =>
  apiClient.post('/email/send', data);

export const sendVerdictEmail = (data: {
  candidateEmail: string;
  candidateName: string;
  verdict: string;
  companyName: string;
  jobTitle: string;
}) => apiClient.post('/email/verdict', data);
