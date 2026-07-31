// Centralized API base URL — avoids duplicate `import.meta.env.VITE_API_URL` across files
export const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

// AI providers
export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
export const GROQ_MODEL   = 'llama-3.3-70b-versatile';

// Lambda / AI evaluation endpoints (base URL configured via VITE_LAMBDA_URL)
export const LAMBDA_BASE_URL = (import.meta.env.VITE_LAMBDA_URL as string) || 'http://localhost:3000';
