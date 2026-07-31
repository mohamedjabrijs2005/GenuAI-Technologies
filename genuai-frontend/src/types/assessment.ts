export type VerdictType = 'HIRE' | 'REVIEW' | 'REJECT';

export interface AssessmentResult {
  id?: number;
  overall_score: number;
  ats_score: number;
  test_score: number;
  interview_score: number;
  authenticity_score: number;
  consistency_score: number;
  verdict: VerdictType;
  triangle_status: string;
  salary_min: number;
  salary_max: number;
  key_strengths: string[];
  improvement_plan: string[];
  cheat_count?: number;
  created_at?: string;
}

export interface AssessmentSubmitPayload {
  user_id: number;
  resume_text: string;
  skills: string;
  ats_score: number;
  resume_score: number;
  interview_score: number;
  test_score: number;
  consistency_score: number;
  overall_score: number;
  authenticity_score: number;
  verdict: VerdictType | string;
  triangle_status: string;
  salary_min?: number;
  salary_max?: number;
  improvement_plan?: string;
  company_ids?: number[];
  job_id?: number | null;
}

export interface CheatLogEvent {
  time: string;
  event: string;
  level: 'yellow' | 'red';
}
