import { Router } from 'express';
import {
  handleSaveConsent,
  handleVerifyIdentity,
  handleLogEvent,
  handleGetReport,
  handleGetCompanyReports,
  handleGetAnalytics,
  handleSaveSessionSummary,
  handleSaveDecision,
  handleGetCompanyAnalytics,
} from '../controllers/integrityController';
import { requireRole, requireSelfOrRole } from '../middleware/auth';

const router = Router();

// Candidate-side actions during their own proctored session. Any logged-in
// candidate may call these — candidateId is taken from their own token
// inside the controller below, never trusted from the request body.
router.post('/consent', handleSaveConsent);
router.post('/verify-identity', handleVerifyIdentity);
router.post('/log-event', handleLogEvent);
router.post('/session-summary', handleSaveSessionSummary);

// Recruiter/company decisioning and reporting — company or admin only.
router.post('/decision', requireRole('company', 'admin'), handleSaveDecision);
router.get('/company-analytics/:companyId', requireSelfOrRole('companyId', 'admin'), handleGetCompanyAnalytics);
router.get('/report/:sessionId', requireRole('company', 'admin'), handleGetReport);
router.get('/company/:companyId', requireSelfOrRole('companyId', 'admin'), handleGetCompanyReports);

// Platform-wide analytics — admin only.
router.get('/analytics', requireRole('admin'), handleGetAnalytics);

export default router;
