// Roles used throughout candidate dashboard, interview room, and mock interview
export const ROLES = [
  'Software Engineer',
  'AI Engineer',
  'Data Scientist',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Product Manager',
] as const;

export type Role = typeof ROLES[number];

// Mock interview round types
export const INTERVIEW_TYPES = [
  { key: 'HR',         label: 'HR Round',        emoji: '👔', desc: 'Personal, background & motivation questions' },
  { key: 'Technical',  label: 'Technical Round',  emoji: '💻', desc: 'Coding, system design & tech concepts' },
  { key: 'Behavioral', label: 'Behavioral Round', emoji: '🧠', desc: 'Situation-based & soft skill questions' },
] as const;
