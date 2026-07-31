import { Router } from 'express';
import { handleEvaluateRisk, handleGetPolicy, handleSetPolicy } from '../controllers/riskController';

const router = Router();

router.post('/evaluate', handleEvaluateRisk);
router.get('/policy/:companyId', handleGetPolicy);
router.post('/policy/:companyId', handleSetPolicy);

export default router;
