export interface Job {
  id: number;
  company_id: number;
  company_name?: string;
  title: string;
  description?: string;
  skills?: string;
  location?: string;
  salary_min: number;
  salary_max: number;
  mode?: 'All' | 'Remote' | 'Hybrid' | 'On-site' | 'Internships';
  type?: string;
  created_at?: string;
}

export interface NetworkPost {
  id: number;
  user_id: number;
  user_name?: string;
  content: string;
  created_at: string;
}

export interface EventItem {
  id: number;
  title: string;
  organizer: string;
  date: string;
  type: string;
}

export interface NewsItem {
  tag: string;
  title: string;
  src: string;
  time: string;
}
