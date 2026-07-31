export interface Interview {
  id: number;
  candidate_id: number;
  company_id: number;
  job_id?: number;
  scheduled_at: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  room_id?: string;
  notes?: string;
  candidate_name?: string;
  company_name?: string;
  job_title?: string;
  created_at?: string;
}

export interface SocketSession {
  roomId: string;
  role: 'candidate' | 'hr' | 'mobile';
  userId: string | number;
}

export type InterviewPhase = 'env_check' | 'waiting' | 'active' | 'terminated';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
