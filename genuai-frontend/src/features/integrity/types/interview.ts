/**
 * Integrity interview types.
 */

export interface InterviewQuestion {
  id: string;
  text: string;
  type: 'behavioral' | 'technical' | 'hr';
  timeLimit?: number;
}

export interface InterviewAnswer {
  questionId: string;
  transcription: string;
  duration: number;
  score?: number;
  feedback?: string;
}

export interface InterviewSession {
  sessionId: string;
  role: string;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  completedAt?: string;
}
