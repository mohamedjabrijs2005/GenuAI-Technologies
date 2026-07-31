export type RoleType = 'candidate' | 'company' | 'admin';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: RoleType;
  phone?: string;
  college?: string;
  github?: string;
  linkedin?: string;
}

export interface UserSession {
  token: string;
  user: UserProfile;
}

export interface CandidateInfo {
  id: number;
  name: string;
  email: string;
  role: string;
  github: string;
  linkedin: string;
  skills: string[];
  resumeText: string;
  profilePhoto?: string;
}
