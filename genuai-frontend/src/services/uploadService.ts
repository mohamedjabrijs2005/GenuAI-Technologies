/**
 * Upload Service — Cloudinary file uploads (resume, avatar, logo, media).
 */
import apiClient from './apiClient';

export const uploadResume = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiClient.post('/upload-resume', formData);
  return res.data.text || '';
};

export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('avatar', file);
  const res = await apiClient.post('/upload/avatar', formData);
  return res.data.url || '';
};

export const uploadLogo = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('logo', file);
  const res = await apiClient.post('/upload/logo', formData);
  return res.data.url || '';
};
