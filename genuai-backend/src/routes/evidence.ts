import express from 'express';
import { EvidenceService } from '../services/evidenceService';
import { authenticateToken, requireRole, paramString } from '../middleware/auth';

const router = express.Router();

router.post('/generate/:attemptId', authenticateToken, async (req, res) => {
  try {
    const attemptId = parseInt(paramString(req.params.attemptId), 10);
    const record = await EvidenceService.generateFromAttempt(attemptId, req.user!.id);
    res.json({ success: true, evidence: record });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const evidence = await EvidenceService.getCandidateEvidence(req.user!.id);
    res.json({ evidence });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/share', authenticateToken, async (req, res) => {
  try {
    const evidenceId = parseInt(paramString(req.params.id), 10);
    const { companyId, expiresInDays } = req.body;
    if (!companyId) {
      return res.status(400).json({ error: 'companyId is required.' });
    }
    const share = await EvidenceService.shareEvidence(evidenceId, req.user!.id, companyId, expiresInDays);
    res.json({ success: true, share });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/share/:shareId', authenticateToken, async (req, res) => {
  try {
    const shareId = parseInt(paramString(req.params.shareId), 10);
    const revoked = await EvidenceService.revokeShare(shareId, req.user!.id);
    res.json({ success: true, revoked });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/company/inbox', authenticateToken, requireRole('company', 'admin'), async (req, res) => {
  try {
    const evidence = await EvidenceService.getCompanyVisibleEvidence(req.user!.id);
    res.json({ evidence });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/verify/:token', async (req, res) => {
  try {
    const token = paramString(req.params.token);
    const result = await EvidenceService.verifyByToken(token);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
