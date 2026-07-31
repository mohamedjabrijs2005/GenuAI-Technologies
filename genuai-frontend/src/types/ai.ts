export interface GroqEvaluationResult {
  resume_score: number;
  interview_score: number;
  communication_score: number;
  technical_depth: number;
  confidence_level: string;
  key_strengths: string[];
  areas_to_improve: string[];
  improvement_plan?: string[];
  ai_verdict: string;
  ai_reasoning: string;
}

export interface GroqMockEvaluationResult {
  score: number;
  rating: string;
  strengths: string[];
  improvements: string[];
  ideal_answer: string;
}

export interface GroqSVARResult {
  score: number;
  fluency: number;
  clarity: number;
  feedback: string;
}
