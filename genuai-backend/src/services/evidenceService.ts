import crypto from 'crypto';
import pool from '../db';
import { JWT_SECRET } from '../config/jwt';

/**
 * Computes a tamper-evident signature for an evidence record. If any of
 * these fields were altered after issuance (e.g. a score edited directly
 * in the database), recomputing this hash would no longer match what's
 * stored — that mismatch is how tampering gets detected.
 */
function computeSignature(candidateId: number, attemptId: number, score: number, issuedAt: string): string {
  return crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${candidateId}:${attemptId}:${score}:${issuedAt}`)
    .digest('hex');
}

export class EvidenceService {
  /**
   * Turns a completed, verified assessment attempt into a durable
   * evidence record. Idempotent — calling this twice for the same
   * attempt returns the existing record instead of duplicating it.
   */
  static async generateFromAttempt(attemptId: number, candidateId: number) {
    const attemptRes = await pool.query(
      `SELECT aa.*, am.name as module_name
       FROM assessment_attempts aa
       LEFT JOIN assessment_modules am ON aa.assessment_module_id = am.id
       WHERE aa.id = $1 AND aa.candidate_id = $2`,
      [attemptId, candidateId]
    );

    if (attemptRes.rows.length === 0) {
      throw new Error('Assessment attempt not found for this candidate.');
    }

    const attempt = attemptRes.rows[0];

    if (attempt.status !== 'completed' && attempt.status !== 'verified') {
      throw new Error('This assessment must be completed before evidence can be generated.');
    }

    const existing = await pool.query(
      `SELECT * FROM evidence_records WHERE assessment_attempt_id = $1`,
      [attemptId]
    );
    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    const issuedAt = new Date().toISOString();
    const validityMonths = attempt.validity_months || 6;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + validityMonths);

    const signature = computeSignature(candidateId, attemptId, Number(attempt.score) || 0, issuedAt);

    const result = await pool.query(
      `INSERT INTO evidence_records (
        candidate_id, assessment_attempt_id, module_name, score, percentage,
        issued_at, expires_at, signature_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        candidateId,
        attemptId,
        attempt.module_name || 'Assessment Module',
        attempt.score,
        attempt.percentage,
        issuedAt,
        expiresAt,
        signature,
      ]
    );

    return result.rows[0];
  }

  /** All of a candidate's own evidence, with each record's current share list. */
  static async getCandidateEvidence(candidateId: number) {
    const evidenceRes = await pool.query(
      `SELECT * FROM evidence_records WHERE candidate_id = $1 ORDER BY issued_at DESC`,
      [candidateId]
    );

    const evidence = evidenceRes.rows;
    if (evidence.length === 0) return [];

    const sharesRes = await pool.query(
      `SELECT es.*, COALESCE(cp.company_name, u.name) as company_name
       FROM evidence_shares es
       LEFT JOIN users u ON es.company_id = u.id
       LEFT JOIN company_profiles cp ON u.id = cp.user_id
       WHERE es.candidate_id = $1 AND es.revoked_at IS NULL`,
      [candidateId]
    );

    const sharesByRecord = new Map<number, any[]>();
    for (const share of sharesRes.rows) {
      const list = sharesByRecord.get(share.evidence_record_id) || [];
      list.push({
        shareId: share.id,
        companyId: share.company_id,
        companyName: share.company_name,
        sharedAt: share.shared_at,
        expiresAt: share.expires_at,
      });
      sharesByRecord.set(share.evidence_record_id, list);
    }

    return evidence.map(record => ({
      ...record,
      isExpired: record.expires_at && new Date(record.expires_at) < new Date(),
      sharedWith: sharesByRecord.get(record.id) || [],
    }));
  }

  /** Shares one evidence record with one company, generating a public verification token. */
  static async shareEvidence(evidenceId: number, candidateId: number, companyId: number, expiresInDays?: number) {
    const evidenceRes = await pool.query(
      `SELECT * FROM evidence_records WHERE id = $1 AND candidate_id = $2`,
      [evidenceId, candidateId]
    );
    if (evidenceRes.rows.length === 0) {
      throw new Error('Evidence record not found.');
    }

    const companyRes = await pool.query(`SELECT id FROM users WHERE id = $1 AND role = 'company'`, [companyId]);
    if (companyRes.rows.length === 0) {
      throw new Error('Target company not found.');
    }

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = expiresInDays ? new Date(Date.now() + expiresInDays * 86400000) : null;

    const result = await pool.query(
      `INSERT INTO evidence_shares (evidence_record_id, candidate_id, company_id, share_token, expires_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (evidence_record_id, company_id) DO UPDATE SET
         share_token = EXCLUDED.share_token, expires_at = EXCLUDED.expires_at, revoked_at = NULL, shared_at = NOW()
       RETURNING *`,
      [evidenceId, candidateId, companyId, token, expiresAt]
    );

    return result.rows[0];
  }

  /** Revokes a share — the company immediately loses access, past shares are never deleted (audit trail). */
  static async revokeShare(shareId: number, candidateId: number) {
    const result = await pool.query(
      `UPDATE evidence_shares SET revoked_at = NOW()
       WHERE id = $1 AND candidate_id = $2 AND revoked_at IS NULL
       RETURNING *`,
      [shareId, candidateId]
    );
    if (result.rows.length === 0) {
      throw new Error('Share not found or already revoked.');
    }
    return result.rows[0];
  }

  /** Everything currently shared with a given company (their view of candidates' evidence). */
  static async getCompanyVisibleEvidence(companyId: number) {
    const result = await pool.query(
      `SELECT er.*, u.name as candidate_name, es.shared_at, es.expires_at as share_expires_at
       FROM evidence_shares es
       JOIN evidence_records er ON es.evidence_record_id = er.id
       JOIN users u ON er.candidate_id = u.id
       WHERE es.company_id = $1
         AND es.revoked_at IS NULL
         AND (es.expires_at IS NULL OR es.expires_at > NOW())
       ORDER BY es.shared_at DESC`,
      [companyId]
    );
    return result.rows;
  }

  /**
   * Public verification lookup by share token — no login required, this
   * is the link a candidate can hand to any employer. Re-checks the
   * tamper-evidence signature before confirming validity.
   */
  static async verifyByToken(token: string) {
    const shareRes = await pool.query(
      `SELECT es.*, er.*, u.name as candidate_name
       FROM evidence_shares es
       JOIN evidence_records er ON es.evidence_record_id = er.id
       JOIN users u ON er.candidate_id = u.id
       WHERE es.share_token = $1`,
      [token]
    );

    if (shareRes.rows.length === 0) {
      return { valid: false, reason: 'Verification link not found.' };
    }

    const row = shareRes.rows[0];

    if (row.revoked_at) {
      return { valid: false, reason: 'This evidence share has been revoked by the candidate.' };
    }
    if (row.expires_at && new Date(row.expires_at) < new Date()) {
      return { valid: false, reason: 'This verification link has expired.' };
    }
    if (row.status !== 'active') {
      return { valid: false, reason: `Evidence record status: ${row.status}.` };
    }

    const expectedSignature = computeSignature(
      row.candidate_id,
      row.assessment_attempt_id,
      Number(row.score) || 0,
      new Date(row.issued_at).toISOString()
    );
    const tamperDetected = expectedSignature !== row.signature_hash;

    return {
      valid: !tamperDetected,
      reason: tamperDetected ? 'Integrity check failed — this record may have been altered.' : undefined,
      candidateName: row.candidate_name,
      moduleName: row.module_name,
      score: row.score,
      percentage: row.percentage,
      issuedAt: row.issued_at,
      expiresAt: row.expires_at,
    };
  }
}
