import express from 'express';
import { EvidenceService } from '../services/evidenceService';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Candidate: generate evidence from a completed assessment attempt.
router.post('/generate/:attemptId', authenticateToken, async (req, res) => {
  try {
    const attemptId = parseInt(req.params.attemptId, 10);
    const record = await EvidenceService.generateFromAttempt(attemptId, req.user!.id);
    res.json({ success: true, evidence: record });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Candidate: list their own evidence records and who they're shared with.
router.get('/', authenticateToken, async (req, res) => {
  try {
    const evidence = await EvidenceService.getCandidateEvidence(req.user!.id);
    res.json({ evidence });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Candidate: share one record with one company.
router.post('/:id/share', authenticateToken, async (req, res) => {
  try {
    const evidenceId = parseInt(req.params.id, 10);
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

// Candidate: revoke a previously granted share.
router.delete('/share/:shareId', authenticateToken, async (req, res) => {
  try {
    const shareId = parseInt(req.params.shareId, 10);
    const revoked = await EvidenceService.revokeShare(shareId, req.user!.id);
    res.json({ success: true, revoked });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Company: everything currently shared with them.
router.get('/company/inbox', authenticateToken, requireRole('company', 'admin'), async (req, res) => {
  try {
    const evidence = await EvidenceService.getCompanyVisibleEvidence(req.user!.id);
    res.json({ evidence });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUBLIC: verify a shared evidence link — no login required, this is the
// link a candidate hands to any employer, even one not on GenuAI.
router.get('/verify/:token', async (req, res) => {
  try {
    const result = await EvidenceService.verifyByToken(req.params.token);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
