/**
 * Centralized Axios instance for backend API calls.
 * Automatically injects Bearer token from localStorage on every request.
 */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const LAMBDA_URL = import.meta.env.VITE_LAMBDA_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Attach JWT token to every outgoing request
apiClient.interceptors.request.use((config) => {
  const stored = localStorage.getItem('genuai_user');
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // Ignore malformed storage
    }
  }
  return config;
});

/**
 * Lambda / AI evaluation endpoint client.
 * Reads from VITE_LAMBDA_URL env variable.
 */
export const lambdaClient = axios.create({
  baseURL: LAMBDA_URL,
});

export default apiClient;
