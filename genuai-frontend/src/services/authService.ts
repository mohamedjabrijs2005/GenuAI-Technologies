/**
 * Auth Service — all authentication-related API calls.
 * No raw axios usage should exist in Auth UI components.
 */
import apiClient from './apiClient';

export const register = (data: {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  college?: string;
  github?: string;
  linkedin?: string;
}) => apiClient.post('/auth/register', data);

export const login = (data: { email: string; password: string }) =>
  apiClient.post('/auth/login', data);

export const sendOtp = (data: {
  email: string;
  name?: string;
  password?: string;
  role?: string;
  phone?: string;
  college?: string;
  github?: string;
  linkedin?: string;
}) => apiClient.post('/auth/send-otp', data);

export const verifyOtp = (data: { email: string; otp: string }) =>
  apiClient.post('/auth/verify-otp', data);

export const requestPasswordReset = (data: { email: string }) =>
  apiClient.post('/auth/forgot-password-otp', data);

export const resetPassword = (data: { email: string; otp: string; password?: string; newPassword?: string }) =>
  apiClient.post('/auth/reset-password', data);
