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

const router = Router();

router.post('/consent', handleSaveConsent);
router.post('/verify-identity', handleVerifyIdentity);
router.post('/log-event', handleLogEvent);
router.post('/session-summary', handleSaveSessionSummary);
router.post('/decision', handleSaveDecision);
router.get('/company-analytics/:companyId', handleGetCompanyAnalytics);
router.get('/report/:sessionId', handleGetReport);
router.get('/company/:companyId', handleGetCompanyReports);
router.get('/analytics', handleGetAnalytics);

export default router;
