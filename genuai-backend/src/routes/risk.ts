import { Router } from 'express';
import { handleEvaluateRisk, handleGetPolicy, handleSetPolicy } from '../controllers/riskController';
import { requireRole, requireSelfOrRole } from '../middleware/auth';

const router = Router();

// Risk scoring itself is a recruiter-facing signal, not something a
// candidate should be able to call directly — exposing it to candidates
// would let them probe live responses to learn what does/doesn't trip
// the detection thresholds.
router.post('/evaluate', requireRole('company', 'admin'), handleEvaluateRisk);

// A company's fraud-detection policy is sensitive: reading it could leak
// their thresholds to a competitor, and writing it could let a malicious
// account sabotage someone else's pipeline. Restrict to the owning
// company or an admin.
router.get('/policy/:companyId', requireSelfOrRole('companyId', 'admin'), handleGetPolicy);
router.post('/policy/:companyId', requireSelfOrRole('companyId', 'admin'), handleSetPolicy);

export default router;
