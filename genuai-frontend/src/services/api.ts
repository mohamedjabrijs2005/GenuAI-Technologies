/**
 * Legacy compatibility barrel — re-exports from modular service files.
 * Components that import from here will continue to work while we migrate them.
 */
export { register, login, sendOtp, verifyOtp, requestPasswordReset, resetPassword } from './authService';
export { submitAssessment, getAssessment, logCheat, checkATS, detectFake, scoreSkills, runTriangle } from './assessmentService';
export { getCandidates, getStats } from './adminService';
export { getJobs, getNetworkPosts, createNetworkPost, getEvents, getPMStatus, getNews } from './jobService';
export { sendAssessmentEmail as sendEmail } from './emailService';
export { evaluateAI } from './groqService';
