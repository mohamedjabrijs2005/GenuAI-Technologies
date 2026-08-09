import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://yevyzrckpivqfiqamfez.supabase.co';
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlldnl6cmNrcGl2cWZpcWFtZmV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNzE3NzEsImV4cCI6MjA1NTc0Nzc3MX0.mock_or_real_anon_token';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
